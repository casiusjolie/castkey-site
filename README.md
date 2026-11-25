# Castkey landing page

Creator-first marketing site for Castkey's early access. The centerpiece is the inline creator invitation (a four-step application with a live invitation card, including an optional "what's your likeness worth" step). Brands and agencies can only request a demo, through a sheet. Also: creator pay with an example payout calculator, a four-step how-it-works strip with the interactive workflow demo folded behind a disclosure, trust, and an eight-question FAQ.

Stack: React + TypeScript + Tailwind CSS on Vite. No runtime dependencies beyond React. Design tokens are in `tailwind.config.js` and documented in `DESIGN.md`.

## Run it

```bash
npm install
npm run dev          # local dev server
npm run build        # type-check + production build to dist/
npm run preview      # serve the production build
SINGLE_FILE=1 npx vite build --outDir dist-single   # one self-contained HTML file
```

## Deploy

`dist/` is a static site: Vercel, Netlify, Cloudflare Pages or any static host. On Vercel: import the repo, framework "Vite", build `npm run build`, output `dist`. Set the environment variables below in the host's dashboard.

## Configuration (`.env`, see `.env.example`)

| Variable | Default | What it does |
|---|---|---|
| `VITE_SUBMISSION_MODE` | `demo` | `demo` or `endpoint` |
| `VITE_FORM_ENDPOINT` | empty | Public intake URL used when mode is `endpoint` |
| `VITE_PRIVACY_URL` / `VITE_TERMS_URL` | empty | Footer and form links. Blank shows "pending" |
| `VITE_CANONICAL_URL` | empty | Adds canonical and og:url tags. Leave blank until the domain is decided |

Never put secrets in `VITE_*` variables: they ship to the browser.

## Demo mode (default)

Forms validate fully, show progress, and end with **"Demo only: your application was not sent."** Nothing leaves the page. They never show a success state.

Testing hook: an email containing `+fail` (e.g. `you+fail@test.com`) simulates a failed submission, so you can check the retry path. Entered values are kept.

## Connecting a real backend

Submission goes through `src/lib/submit.ts` (`Submitter` interface). The built-in endpoint adapter POSTs:

```json
{ "audience": "brand" | "creator", "fields": { ... }, "submittedAt": "ISO date" }
```

It shows success **only** when the server answers `200 {"received": true}`. A 429 shows a rate-limit message. Your endpoint should:

- rate-limit by IP (e.g. 5 per 10 minutes) and reject the hidden honeypot field if present
- validate fields server-side and cap lengths (forms cap free text at 600 characters)
- store applications with an agreed retention period, and only email anyone after storage succeeds
- not add anyone to a marketing list (the form copy promises this)

Do not point this at a personal inbox, and keep the founder's personal email out of page source, metadata and client config.

## Identity verification (required, step 5 of the invitation)

Applicants finish with a government ID and live selfie check. The flow is an adapter in `src/lib/verify.ts`:
- `VITE_VERIFY_MODE=preview` (default): nothing is checked; the page says so and labels the submit button "(preview)".
- `provider`: wire a provider SDK (Persona, Veriff or similar) in `providerVerifier.start()`. Images go straight to the provider; Castkey stores only the reference and pass/fail, confirmed server-side via the provider's API or webhook before trusting it. Submission is blocked until verification passes.

Before going live: a privacy notice covering biometric data (Illinois, Texas and Washington have specific rules), provider retention settings, and a plan for people who fail or can't verify.

## Creator invites (10 per creator)

Every creator who applies gets one personal invite link (`/#invite-CODE`, or `?invite=CODE`) that works for up to 10 people. Visitors arriving through a link see "You're applying with an invite" and their application carries `invitedBy: CODE`.

What the page does now: shows the link, a 10-segment counter, Copy link, Share (native share sheet where supported), Text, WhatsApp, Email, X, and Copy message for DMs. In demo mode the code is a local preview and is labeled "Demo: link not active yet".

What the backend must do (none of this can be enforced in the browser):
- Create a unique code per creator on their first application and return it as `invite: { code, remaining }`.
- Count an invite as used only when a new person applies with that code; never on share or click.
- At 0 remaining, still accept the application but store it as uninvited.
- Ignore self-referrals (same email) and rate-limit applications per code to stop abuse.
- Decide what an invite earns the invitee (e.g. earlier review) and say so on the page only once you'll honor it.

## Content

All copy, FAQ and example profiles are in `src/content.ts`. Example profiles, the hero license card and every demo record are fictional and labeled as illustrative on the page. Keep them labeled until real, approved listings replace them.

## Implemented vs demo-only vs launch blockers

**Implemented**
- Responsive page, 360px to wide desktop, no horizontal scroll
- Sticky header with section links, keyboard-accessible mobile menu (Escape closes, focus returns)
- Interactive four-step workflow demo (rules builder with plain-language preview, simulated review checklist, sample license record with the 20% split, buyer-reported usage ledger)
- Creator pay section: two income streams, an example payout calculator (user-entered numbers, fixed 20% commission, labeled illustrative), application-to-payout steps
- Accessible FAQ accordion, skip link, visible focus, reduced-motion support
- Creator invitation (inline, `src/components/Invite.tsx`): four steps (what you license, off-limits topics, platform/audience/current rate, contact), directional step transitions, live preview card, inline validation, focus moved to each step's heading
- Brand demo request: native `<dialog>` sheet (focus trap, Escape, focus restore), audience preserved from the CTA and switchable, inline validation, focus to first error, live status announcements, duplicate-click guard, retryable errors with values preserved, honeypot + minimum-time spam check
- Submission adapter with demo and endpoint modes
- No analytics, pixels or tracking

**Demo-only**
- All submissions (until an endpoint is configured)
- The whole workflow demo: review, licensing, ZIP delivery, usage reports and ad-share arithmetic are simulated in memory
- Hero license card, listing previews, sample brand and creator names
- Creator pay calculator: the $750 and 5% starting values match the deck's illustrative numbers; payouts are the planned model, not a live system

**Decision to honor before launch**
- The invitation promises a suggested monthly price range for creators who share their rates. Someone has to send it. There is no automated valuation on the page, on purpose.

**Launch blockers**
1. Approved application destination, storage and retention approach, plus server-side rate limiting
2. Privacy notice and terms reviewed by counsel (and linked via env)
3. Real identity/liveness verification, buyer vetting, licensing, payments and reporting workflows (separate secure app)
4. Approved brand assets (the keyhole-person mark in /brand is original; run a trademark search before committing)
5. Replace illustrative content with real marketplace data only once listings are approved
6. Production domain, canonical URL and social preview image


## Share thumbnails

Each shareable page has its own title, description and 1200×630 thumbnail, injected at build time from `PAGES` in `vite.config.ts`:

| Page | Shared from | Thumbnail |
| --- | --- | --- |
| `/` | Any link to the site | `public/og/og-home.jpg` |
| `/invite/` | "Share with a creator" and "Share the invite" | `public/og/og-invite.jpg` |
| `/invited/#invite-CODE` | A creator's personal 10-use invite link | `public/og/og-invited.jpg` |

Social apps only show thumbnails from absolute URLs, so set `VITE_SITE_URL` before building. The thumbnails are rendered from `../og/render.py` (HTML templates), so copy changes there and re-run it.


## Saving applications to Google Sheets

Applications go to the **Castkey applications** Google Sheet (tabs: Creators, Brands, Partners) through a small Google Apps Script web app. The script is in `google-apps-script/Code.gs`.

1. Open the sheet → **Extensions → Apps Script**. Delete what's there and paste in `Code.gs`. Save.
2. **Deploy → New deployment → Web app.** Execute as: **Me**. Who has access: **Anyone**. Authorize when asked.
3. Copy the web app URL (ends in `/exec`). In `.env`, set:
   ```
   VITE_SUBMISSION_MODE=endpoint
   VITE_FORM_ENDPOINT=<that URL>
   VITE_SITE_URL=https://your-domain
   ```
4. `npm run build` and upload `dist/` to your host (Netlify, Vercel, Cloudflare Pages).

The page sends JSON as text/plain, so the request needs no CORS preflight. The page only shows "You're in the queue" after the script answers `{ "received": true }`. To get an email for each new row, use the sheet's **Tools → Notification settings**.


## Investor portal

`/investors/#k=KEY` shows live, anonymous totals from the sheet (creators, follower ranges, brand demo requests, self-reported spend ranges, AI tool use, weekly applications). It refreshes every minute.

- The key is created by running `makeInvestorKey` once in the Apps Script editor; the full link appears in the execution log. Running it again replaces the key and turns off old links.
- The script only returns totals, never names, emails, links or companies. Spend totals stay hidden until 3 or more brands have answered.
- Mark a row's Status as `Spam` or `Test` (or start the name with TEST) to leave it out of the totals.

## Privacy

`/privacy/` is the privacy notice (a plain-language draft; have a lawyer review it). Its request form saves to the Requests tab.

## Deploying

Netlify builds from GitHub using `netlify.toml`. To deploy by hand instead: `VITE_MULTI_PAGE=1 VITE_SITE_URL=https://getcastkey.netlify.app npm run build` with the endpoint in `.env`, then drag `dist/` into Netlify → Deploys.

After editing `google-apps-script/Code.gs`, paste it into the Apps Script project, save, then Deploy → Manage deployments → Edit → New version → Deploy.

## Fast-track links

Short links that skip the intro and land on the right spot. Share them in bios, DMs and emails.

| Link | Opens |
|---|---|
| `/apply` (also `/join`, `/creators`) | The creator application, cursor in the first field |
| `/brands` (also `/demo`) | The brand demo request form |
| `/agencies` (also `/partners`) | The agency and partner form |
| `/refer`, `/earn`, `/how`, `/faq` | That section of the page |
| `/r/CODE` | A creator's referral link (tracked) |

They are rewrites in `public/_redirects` (Netlify and Cloudflare Pages) and `vercel.json` (Vercel), handled by `src/lib/fasttrack.ts`. Section links also work as `#apply`, `#refer` etc.
