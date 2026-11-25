/**
 * Castkey application intake → Google Sheets, plus anonymous totals for the investor portal.
 *
 * Deploy as a web app: Execute as Me, Who has access: Anyone.
 * After any edit: Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.
 * The live URL keeps running the old code until you do this.
 *
 * POST (from the website): appends or updates one row in Creators, Brands, Partners or Requests,
 *   and emails the Google account that deployed this script. No address is written here or on the site.
 * GET ?stats=1&key=… (from /investors/): anonymous totals only. The key lives in
 *   Project Settings → Script properties → INVESTOR_KEY, never in this file.
 *
 * Referral codes live in the Codes tab. A code is issued once, belongs to one email, and is never
 * changed or reused. Links look like https://getcastkey.netlify.app/r/CODE.
 *   GET ?check=CODE  → is it free?      GET ?visit=CODE → counts one link open.
 *   POST audience "code" → claim a referral link without applying.
 * Mark a creator "Approved" in the Creators Status column; the Codes tab counts approvals per code.
 */

const SHEET_ID = '1q78py2z55qg7aTQpQZhSdY8RsJabAWBLM0ukkETiLlg'; // the "Castkey applications" sheet

const TABS = {
  creator: {
    tab: 'Creators',
    cols: ['submittedAt', 'name', 'email', 'profileUrl', 'followers', 'licensing', 'neverAllowed', 'note', 'invitedBy', 'inviteCode', '_status'],
    required: ['name', 'email'],
  },
  brand: {
    tab: 'Brands',
    cols: ['submittedAt', 'name', 'email', 'company', 'website', 'brandType', 'intendedUse', 'adSpend', 'creatorSpend', 'paysUsage', 'aiTools', '_status'],
    required: ['name', 'email', 'company'],
  },
  partner: {
    tab: 'Partners',
    cols: ['submittedAt', 'name', 'email', 'company', 'website', 'brandType', 'intendedUse', 'rosterSize', 'managesDeals', '_status'],
    required: ['name', 'email', 'company'],
  },
  code: {
    tab: 'Codes',
    cols: [],
    required: ['name', 'email', 'code'],
  },
  bug: {
    tab: 'Bugs',
    cols: ['submittedAt', 'what', 'steps', 'page', 'email', 'account', 'device', '_status'],
    required: ['what'],
    appendOnly: true,
  },
  privacy: {
    tab: 'Requests',
    cols: ['submittedAt', 'email', 'request', 'details', '_status'],
    required: ['email', 'request'],
    appendOnly: true,
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_POSTS_PER_10_MIN = 40; // flood guard for the whole form
const MAX_EMAILS_PER_HOUR = 25; // keeps Gmail's daily quota for real applications

function doPost(e) {
  try {
    if (!allow('posts', MAX_POSTS_PER_10_MIN, 600)) return reply({ received: false, error: 'busy' });
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const spec = TABS[body.audience];
    const f = body.fields || {};
    if (!spec) return reply({ received: false, error: 'unknown audience' });
    if (f.company_url_2) return reply({ received: true }); // honeypot
    for (const k of spec.required) {
      if (!String(f[k] || '').trim()) return reply({ received: false, error: 'missing ' + k });
    }
    const needsEmail = spec.required.indexOf('email') >= 0 || String(f.email || '').trim();
    if (needsEmail && !EMAIL_RE.test(String(f.email))) return reply({ received: false, error: 'bad email' });

    let issued = '';
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let updated = false;
    try {
      const book = SpreadsheetApp.openById(SHEET_ID);
      if (body.audience === 'code') {
        const res = reserveCode(book, f.code, f.name, f.email, 'Referral link');
        if (res.error) return reply({ received: false, error: res.error });
        issued = res.code;
      } else {
        if (body.audience === 'creator') {
          issued = reserveCode(book, f.inviteCode, f.name, f.email, 'Application').code;
          f.inviteCode = issued;
          f.invitedBy = normCode(f.invitedBy);
          if (f.invitedBy === issued) f.invitedBy = ''; // no referring yourself
        }
        updated = writeRow(book, spec, f);
      }
    } finally {
      lock.releaseLock();
    }
    if (allow('emails', MAX_EMAILS_PER_HOUR, 3600)) notify(spec.tab, f, updated);
    return reply(issued ? { received: true, code: issued } : { received: true });
  } catch (err) {
    return reply({ received: false, error: 'server error' });
  }
}

function writeRow(book, spec, f) {
    const row = spec.cols.map(function (c) {
      if (c === 'submittedAt') return new Date();
      if (c === '_status') return 'New';
      let v = String(f[c] == null ? '' : f[c]).slice(0, 2000);
      if (/^[=+\-@]/.test(v)) v = "'" + v; // stop text being read as a formula
      return v;
    });

    const sheet = book.getSheetByName(spec.tab);
    const emailCol = spec.cols.indexOf('email') + 1;
    const existing = spec.appendOnly ? 0 : findRowByEmail(sheet, emailCol, String(f.email));
    if (!existing) {
      sheet.appendRow(row);
      return false;
    }
    // Same person applying again: update their row instead of adding a duplicate.
    const old = sheet.getRange(existing, 1, 1, row.length).getValues()[0];
    const by = spec.cols.indexOf('invitedBy');
    if (by >= 0 && old[by]) row[by] = old[by]; // first referrer keeps the credit
    const status = String(old[row.length - 1] || '');
    row[row.length - 1] = /approved|spam|test/i.test(status) ? status : 'Updated';
    sheet.getRange(existing, 1, 1, row.length).setValues([row]);
    return true;
}

// ---------- Referral codes ----------

const CODE_RE = /^[a-z0-9][a-z0-9-]{1,18}[a-z0-9]$/;
const RESERVED = ['admin', 'castkey', 'invite', 'invited', 'investors', 'privacy', 'apply', 'brand', 'brands', 'creator', 'creators', 'partner', 'partners', 'support', 'help', 'team', 'official', 'test'];

function normCode(c) {
  return String(c || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);
}
function validCode(c) {
  return CODE_RE.test(c) && RESERVED.indexOf(c) < 0;
}
function codeRow(sheet, col, value) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const vals = sheet.getRange(2, col, last - 1, 1).getValues();
  const t = String(value).trim().toLowerCase();
  for (let i = 0; i < vals.length; i++) if (String(vals[i][0]).trim().toLowerCase() === t) return i + 2;
  return 0;
}
function makeCode(sheet, name) {
  const base = normCode(String(name || '').split(/\s+/)[0]).replace(/-/g, '').slice(0, 12) || 'creator';
  for (let i = 0; i < 20; i++) {
    const c = (base.length >= 2 ? base : 'creator') + '-' + Math.random().toString(36).slice(2, 6);
    if (!codeRow(sheet, 1, c)) return c;
  }
  return 'c-' + Utilities.getUuid().slice(0, 8);
}

// Caller holds the script lock. One code per email, issued once, never changed.
function reserveCode(book, desired, name, email, source) {
  const sheet = book.getSheetByName('Codes');
  const mine = codeRow(sheet, 3, email);
  if (mine) return { code: String(sheet.getRange(mine, 1).getValue()) };
  let code = normCode(desired);
  const strict = source !== 'Application';
  if (!validCode(code)) {
    if (strict) return { error: 'invalid' };
    code = makeCode(sheet, name);
  } else if (codeRow(sheet, 1, code)) {
    if (strict) return { error: 'taken' };
    code = makeCode(sheet, name);
  }
  const n = sheet.getLastRow() + 1;
  sheet.getRange(n, 1, 1, 9).setValues([[code, String(name).slice(0, 120), String(email).slice(0, 200), new Date(), source, 0, '', '', '']]);
  sheet.getRange(n, 7).setFormula('=COUNTIF(Creators!I:I,A' + n + ')');
  sheet.getRange(n, 8).setFormula('=COUNTIFS(Creators!I:I,A' + n + ',Creators!K:K,"Approved")');
  return { code: code };
}

function checkCode(c) {
  const code = normCode(c);
  if (!validCode(code)) return { ok: true, valid: false, available: false };
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Codes');
  return { ok: true, valid: true, available: !codeRow(sheet, 1, code) };
}

function countVisit(c) {
  const code = normCode(c);
  if (!validCode(code) || !allow('visits', 400, 600)) return;
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(3000)) return;
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Codes');
    const row = codeRow(sheet, 1, code);
    if (row) sheet.getRange(row, 6).setValue(Number(sheet.getRange(row, 6).getValue() || 0) + 1);
  } finally {
    lock.releaseLock();
  }
}

function findRowByEmail(sheet, col, email) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const values = sheet.getRange(2, col, last - 1, 1).getValues();
  const target = email.trim().toLowerCase();
  for (let i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]).trim().toLowerCase() === target) return i + 2;
  }
  return 0;
}

// Counts events in a time window; false once the limit is reached.
function allow(name, limit, seconds) {
  const cache = CacheService.getScriptCache();
  const key = 'rate_' + name + '_' + Math.floor(Date.now() / (seconds * 1000));
  const n = Number(cache.get(key) || 0);
  if (n >= limit) return false;
  cache.put(key, String(n + 1), seconds);
  return true;
}

const LABELS = {
  name: 'Name', email: 'Email', profileUrl: 'Social link', followers: 'Followers', licensing: 'Wants to license',
  neverAllowed: 'Never allowed', note: 'Notes', invitedBy: 'Invited by (code)', inviteCode: 'Their invite code',
  company: 'Company', website: 'Website', brandType: 'Type', intendedUse: 'What they want',
  adSpend: 'Paid ads / month', creatorSpend: 'Creators & UGC / month', paysUsage: 'Pays for usage rights', aiTools: 'AI ad tools',
  request: 'Request', details: 'Details', what: 'What happened', steps: 'Steps to repeat', page: 'Page', account: 'Signed in as', device: 'Device', code: 'Referral code', rosterSize: 'Roster size', managesDeals: 'Handles brand deals',
};

function notify(tab, f, updated) {
  try {
    if (tab === 'Bugs') {
      const msg = {
        to: Session.getEffectiveUser().getEmail(),
        subject: 'Castkey bug: ' + String(f.what || '').replace(/\s+/g, ' ').slice(0, 70),
        body: 'Forward this to Claude, or say "check the bugs".\n\n' +
          ['what', 'steps', 'page', 'email', 'account', 'device']
            .filter(function (k) { return String(f[k] || '').trim(); })
            .map(function (k) { return LABELS[k] + ': ' + String(f[k]).slice(0, 2000); }).join('\n') +
          '\n\nAll bug reports: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit',
      };
      if (EMAIL_RE.test(String(f.email || ''))) msg.replyTo = String(f.email);
      MailApp.sendEmail(msg);
      return;
    }
    const kind = { Creators: 'creator', Brands: 'brand', Partners: 'partner', Requests: 'privacy request', Codes: 'referral link' }[tab];
    const lines = Object.keys(LABELS)
      .filter(function (k) { return String(f[k] || '').trim(); })
      .map(function (k) { return LABELS[k] + ': ' + String(f[k]).slice(0, 2000); });
    const who = String(f.name || f.email || '').slice(0, 80) + (f.company ? ' (' + String(f.company).slice(0, 80) + ')' : '');
    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      replyTo: String(f.email || ''),
      subject: (updated ? 'Updated' : 'New') + ' Castkey ' + kind + ': ' + who,
      body: lines.join('\n') + '\n\nSaved to the ' + tab + ' tab: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit',
    });
  } catch (err) { /* quota or permission issue: the row is still saved */ }
}

// ---------- Investor portal: anonymous totals ----------

const SPEND = { '$0': [0, 0], 'Under $5K': [0, 5000], '$5K–$25K': [5000, 25000], '$25K–$100K': [25000, 100000], '$100K–$500K': [100000, 500000], 'Over $500K': [500000, 500000] };
const FOLLOWERS = { 'Under 10K': [0, 10000], '10K–50K': [10000, 50000], '50K–250K': [50000, 250000], '250K–1M': [250000, 1000000], 'Over 1M': [1000000, 1000000] };
const MIN_BRANDS_FOR_SPEND = 3; // never show spend totals that could point to one brand

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.check) return reply(checkCode(p.check));
  if (p.visit) { countVisit(p.visit); return reply({ ok: true }); }
  if (!p.stats) return reply({ ok: true, service: 'castkey-intake' });
  const key = PropertiesService.getScriptProperties().getProperty('INVESTOR_KEY');
  if (!key || p.key !== key) return reply({ ok: false, error: 'not allowed' });
  const cache = CacheService.getScriptCache();
  const hit = cache.get('stats_v1');
  if (hit) return ContentService.createTextOutput(hit).setMimeType(ContentService.MimeType.JSON);
  const out = JSON.stringify(stats());
  cache.put('stats_v1', out, 30); // at most one sheet read every 30 seconds
  return ContentService.createTextOutput(out).setMimeType(ContentService.MimeType.JSON);
}

function rows(tab) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(tab);
  const last = sheet.getLastRow();
  if (last < 2) return [];
  return sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues().filter(function (r) {
    const status = String(r[r.length - 1] || '').toLowerCase();
    return r[0] && !/^test/i.test(String(r[1])) && status !== 'spam' && status !== 'test';
  });
}

function count(list) {
  const out = {};
  list.forEach(function (v) { if (v) out[v] = (out[v] || 0) + 1; });
  return out;
}

function weekIndex(d, now) {
  return Math.floor((now - new Date(d).getTime()) / (7 * 864e5));
}

function stats() {
  const now = Date.now();
  const c = rows('Creators');
  const b = rows('Brands');
  const p = rows('Partners');
  const week = 7 * 864e5;
  const weeks = [];
  for (let i = 11; i >= 0; i--) weeks.push({ start: new Date(now - (i + 1) * week).toISOString().slice(0, 10), creators: 0, brands: 0 });
  c.forEach(function (r) { const w = weekIndex(r[0], now); if (w < 12) weeks[11 - w].creators++; });
  b.forEach(function (r) { const w = weekIndex(r[0], now); if (w < 12) weeks[11 - w].brands++; });

  let reachLo = 0, reachHi = 0;
  c.forEach(function (r) { const f = FOLLOWERS[r[4]]; if (f) { reachLo += f[0]; reachHi += f[1]; } });

  function spendTotals(col) {
    let lo = 0, hi = 0, n = 0;
    b.forEach(function (r) { const s = SPEND[r[col]]; if (s) { lo += s[0]; hi += s[1]; n++; } });
    return n >= MIN_BRANDS_FOR_SPEND ? { low: lo, high: hi, brands: n } : { hidden: true, brands: n };
  }
  const tools = [];
  let answeredTools = 0, usesAi = 0;
  b.forEach(function (r) {
    const t = String(r[10] || '').trim();
    if (!t) return;
    answeredTools++;
    if (t !== 'None yet') usesAi++;
    t.split(', ').forEach(function (x) { if (x && x !== 'None yet') tools.push(x); });
  });

  return {
    ok: true,
    updatedAt: new Date().toISOString(),
    creators: {
      total: c.length,
      last7: c.filter(function (r) { return now - new Date(r[0]).getTime() < week; }).length,
      invited: c.filter(function (r) { return String(r[8] || '').trim(); }).length,
      followers: count(c.map(function (r) { return r[4]; })),
      licensing: count(c.map(function (r) { return r[5]; })),
      reach: { low: reachLo, high: reachHi, answered: c.filter(function (r) { return FOLLOWERS[r[4]]; }).length },
    },
    brands: {
      total: b.length,
      last7: b.filter(function (r) { return now - new Date(r[0]).getTime() < week; }).length,
      types: count(b.map(function (r) { return r[5]; })),
      adSpend: spendTotals(7),
      creatorSpend: spendTotals(8),
      paysUsage: count(b.map(function (r) { return r[9]; })),
      aiTools: count(tools),
      usesAi: { yes: usesAi, answered: answeredTools },
    },
    partners: { total: p.length, roster: rosterTotals(p) },
    referrals: referralTotals(),
    weeks: weeks,
  };
}

const ROSTER = { '1–10': [1, 10], '11–50': [11, 50], '51–200': [51, 200], '200+': [200, 200] };
function rosterTotals(p) {
  let lo = 0, hi = 0;
  p.forEach(function (r) { const x = ROSTER[r[7]]; if (x) { lo += x[0]; hi += x[1]; } });
  return { low: lo, high: hi };
}

function referralTotals() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Codes');
  const last = sheet.getLastRow();
  if (last < 2) return { links: 0, opens: 0, approved: 0 };
  const v = sheet.getRange(2, 1, last - 1, 8).getValues().filter(function (r) { return r[0] && !/^test/i.test(String(r[1])); });
  return {
    links: v.length,
    opens: v.reduce(function (s, r) { return s + Number(r[5] || 0); }, 0),
    approved: v.reduce(function (s, r) { return s + Number(r[7] || 0); }, 0),
  };
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor (select "makeInvestorKey" → Run). Creates the investor link key,
// stores it in Script properties and prints the full investor link in the execution log.
// Run it again any time to replace the key; old investor links stop working.
function makeInvestorKey() {
  const key = 'ck_' + Utilities.getUuid().replace(/-/g, '').slice(0, 24);
  PropertiesService.getScriptProperties().setProperty('INVESTOR_KEY', key);
  CacheService.getScriptCache().remove('stats_v1');
  Logger.log('Investor link: https://getcastkey.netlify.app/investors/#k=' + key);
}
