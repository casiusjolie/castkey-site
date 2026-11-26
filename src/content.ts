// All page copy and example data lives here so it can be edited without touching components.
// Everything marked "illustrative" is fictional and must stay labeled as such on the page.

import casiusPhoto from './assets/casius.jpg'

export const nav = [
  { id: 'how', label: 'How it works' },
  { id: 'brands', label: 'For brands' },
  { id: 'calls', label: 'Open calls' },
  { id: 'earn', label: 'Earn' },
  { id: 'agencies', label: 'Agencies' },
  { id: 'faq', label: 'FAQ' },
]

export const hero = {
  eyebrow: 'Castkey for creators · Early access',
  title: 'Get paid for your face.',
  body: 'Brands are stuck using fake AI people. License them your face and voice instead, on your terms, and get paid every month.',
  small: 'Brands and agencies',
  card: {
    label: 'Illustrative product preview',
    name: 'Your listing',
    kind: 'Example creator profile',
    fields: [
      { k: 'You license', v: 'Likeness · Voice' },
      { k: 'Brands may', v: 'Product explainers, organic social, app onboarding' },
      { k: 'Never', v: 'Alcohol, politics, medical claims, competitor comparisons' },
      { k: 'Your price', v: 'Monthly, per brand · set by you' },
    ],
  },
}

// Pricing: one source of truth for every fee on the page. Brands pay no extra fee; Castkey's fee comes
// out of the license. Castkey's own net is never shown to creators (the referral is paid from it).
export const pricing = {
  referral: 5, // % of each deal paid to whoever referred the creator, from Castkey's share
  referralCap: '$10,000',
  managerCap: 20, // max % of the creator's share a manager can take
  fee: 20, // Castkey's fee, % of each license
  keep: 80, // the creator's share, % of each license (before any manager split)
  minLicense: 100, // lowest monthly license price, so fixed payment costs stay small
  adSpendShare: 5, // % of brand ad spend a creator earns when they switch it on (Castkey Standard)
} as const

// Why brands pay, in plain words. Keep the source link if the stat changes.
export const whyBrands = {
  title: 'Almost every brand is going AI. Don’t get left behind.',
  stat: { n: '9 in 10', k: 'advertisers are using or planning to use AI to make their video ads.', src: 'IAB, 2025', url: 'https://www.iab.com/news/nearly-90-of-advertisers-will-use-gen-ai-to-build-video-ads/' },
  lead: 'AI ads are quickly becoming normal. Castkey lets brands make them with real people their customers trust, instead of fake AI faces.',
  points: [
    { k: 'More ads, less money', v: 'Make and test dozens of ad versions without booking a new shoot every time.' },
    { k: 'Real people, real consent', v: 'Verified creators with real audiences, who agreed on camera.' },
    { k: 'Fully covered', v: 'Every license is signed by both sides and says where the ads run and when it ends.' },
  ],
  compare: { a: 'Filming 20 creator videos', av: 'about $3,000', b: 'One Castkey license', bv: 'from $100 a month', src: 'Collabstr 2026 report', url: 'https://collabstr.com/2026-influencer-marketing-report' },
  cta: 'Brands: request an intro',
}

export const how = {
  title: 'How it works.',
  steps: [
    { k: 'Brands find you', v: 'Set your monthly minimum. Brands that reach out must meet it. No manager? Our team brings you deals.' },
    { k: 'Or you find them', v: 'Browse open calls: brands post what they’ll pay. Apply to the ones you like, and go below your minimum if you want.' },
    { k: 'You decide', v: 'Accept, counter or decline. Set your rules, even the age you can be shown as. Both sides sign before anything goes live.' },
    { k: 'You get paid monthly', v: 'Brands subscribe to your license. Turn on ad spend share and earn 5% when your ads run.' },
  ],
}

export const earn = {
  title: 'How you get paid.',
  lead: 'A brand pays a monthly license. Castkey splits it automatically. Nobody invoices anybody.',
  extras: 'Earn more: turn on ad spend share to get 5% of what brands spend running ads with your likeness, or set a premium to be a brand’s only face in its category.',
}

// One rule everywhere: a referrer earns 5% of what each creator they refer earns, once that creator
// is approved and brands pay, up to $10,000 per referred creator. It is paid from Castkey's fee, never the creator's share.
export const referral = {
  headline: 'Refer creators and earn up to $10,000.',
  short: 'Earn 5% of every deal a creator you refer does, up to $10,000 each.',
  body: 'When someone you refer is approved and starts earning, you get 5% of every deal they do, up to $10,000 per creator. Castkey pays it, so their share is never touched.',
  rules: ['Paid monthly, once brands pay them.', 'Tell people you earn a reward. No referring yourself.'],
  note: 'Rewards start when payouts open. Final terms confirmed before anyone earns.',
}

export const agencies = {
  eyebrow: 'For agencies and managers',
  title: 'Bring your whole roster.',
  lead: 'Onboard every creator you manage at once and run their deals from one place.',
  points: [
    { k: 'Upload your roster', v: 'We onboard every creator together.' },
    { k: 'Manage with permission', v: 'Creators choose what you can do on their profile.' },
    { k: 'Get paid twice', v: 'Your split (up to 20%) is paid automatically, plus 5% on every creator you bring.' },
  ],
  cta: 'Talk to us about your roster',
  note: 'Roster tools are being built for launch.',
}

// The example listing. Swap these fields for a real creator ONLY with their written consent
// (photo, name, rules, any price shown). Until then it stays an example and says so.
export const exampleListing = {
  isExample: false, // real person, listed with his own consent (the founder)
  badge: 'Founding listing · draft, not yet available to license',
  intro: 'Casius Jones, Castkey’s founder, is the first creator on the platform. His listing shows exactly what brands will see.',
  name: 'Casius Jones',
  handle: '@cvsius',
  profileUrl: 'https://www.instagram.com/cvsius',
  initials: 'CJ',
  followers: '60K+', // stated by Casius (Instagram)
  links: [{ label: 'Instagram', sub: '@cvsius · 60K+ followers', href: 'https://www.instagram.com/cvsius' }],
  category: 'Founder of Castkey · Creative director and photographer',
  photo: casiusPhoto as string, // approved portrait supplied by Casius
  bio: 'I founded Castkey after years of making creator and brand campaigns as a creative director and photographer. I’m listing my own likeness first, on the same terms as every creator.',
  samples: [] as { src: string; alt: string }[], // add approved photos: { src: '/path-or-data-uri', alt: 'Description' }
  licenses: ['Likeness', 'Voice'],
  allowed: ['Fashion and lifestyle campaigns', 'Product demos and explainers', 'App and tech content', 'Paid social ads'],
  never: ['Politics', 'Gambling', 'Medical or health claims', 'Fake reviews or testimonials'],
  wardrobe: 'No visible third party logos. Styling approved per campaign.',
  age: 'Shown as 22–30 · ads aimed at 18+ only',
  voice: 'First person and natural. No profanity, no impersonating other people.',
  pack: 'Photos, talking videos and voice notes · reviewed by Castkey',
  packItems: ['Photos', 'Talking videos', 'Voice notes'],
  price: 'Set by Casius',
  adShare: 'On · 5% of ad spend',
  approval: 'On · Casius approves ads before they go live',
  term: 'Up to 12 months, renewable',
  exclusivity: 'Brand exclusivity available · premium set by Casius',
}

export const invite = {
  eyebrow: 'Apply',
  title: 'Apply to list your likeness.',
  body: 'Three questions, about two minutes. Every profile is verified before it goes live.',
  next: [
    { k: 'We review your application', v: 'By hand, in the order it arrives.' },
    { k: 'You get an invitation', v: 'To verify your identity in a secure onboarding step.' },
    { k: 'You set up your listing', v: 'Your training pack, your rules, your price.' },
  ],
  worth: {
    title: 'What’s your likeness worth?',
    body: 'Tell us where you post and what brands pay you today. We’ll send a suggested monthly price range with your invitation, based on your rates and what brands are licensing.',
    note: 'Optional. A suggestion, not a quote or a promise of earnings. You always set the final price.',
    platforms: ['Instagram', 'TikTok', 'YouTube', 'Other'],
    audiences: ['Under 10K', '10K–50K', '50K–250K', '250K–1M', 'Over 1M'],
    exclusivity: ['Yes', 'Maybe', 'No'],
  },
  boundaries: ['Alcohol', 'Politics', 'Gambling', 'Profanity', 'Swimwear', 'Medical claims', 'Competitor comparisons'],
}

export const faq = [
  { q: 'How do I get paid?', a: 'Brands subscribe monthly to your license. You keep 80% of every payment, and payouts are automatic every month. Licenses start at $100 a month. Turn on ad spend share and you also earn 5% of what brands spend running ads with your likeness.' },
  { q: 'Why do brands pay for this?', a: 'Almost every brand is starting to make ads with AI. They want real people their customers trust, not fake AI faces, and a license lets them make as many ad versions as they need without a new shoot each time.' },
  { q: 'What are open calls and minimums?', a: 'Brands post open calls with what they’ll pay. Your inbound minimum is the least a brand can offer when they reach out to you. When you apply to an open call yourself, you can accept less if the deal is right.' },
  { q: 'Do I approve every brand?', a: 'Yes. You accept, counter or decline every request, and you can message the brand in the app first.' },
  { q: 'Can I approve ads before they go live?', a: 'Yes. Switch on approvals and every ad needs your OK before it can run. Brands can still test drafts freely. Leave it off and brands can run ads within your rules.' },
  { q: 'What happens when a license ends?', a: 'Every license has an end date, up to 12 months, and can be renewed. When it ends without a renewal, the brand has 30 days to take its ads down.' },
  { q: 'How is consent handled?', a: 'Every creator is verified and records a short consent video before going live. Both the brand and the creator sign the same Castkey terms on every deal.' },
  { q: 'Who labels AI ads?', a: 'The brand. Every license requires following each platform’s AI labeling rules and the law wherever the ads run.' },
  { q: 'What do brands get?', a: 'Your training pack (photos, talking videos and voice recordings) plus a written license: where it runs, for how long, and your rules. Every profile needs a pack before it goes live.' },
  { q: 'Can my manager run my profile?', a: 'Yes, with the permissions you choose. Their split is paid automatically and can’t be more than 20% of your share.' },
  { q: 'How do referrals work?', a: 'Get your link and share it. When a creator you refer is approved and starts earning, you get 5% of every deal they do, up to $10,000 per creator, paid by Castkey.' },
  { q: 'Can I choose what age I’m shown as?', a: 'Yes. On any deal you can set the age range your AI likeness can be shown as, and the youngest audience the ads can be aimed at. No one is ever shown as under 18.' },
  { q: 'Is adult content allowed?', a: 'No, never. This applies to every creator and every brand, and no setting can change it. Alcohol, cannabis and betting brands only reach creators who opt in.' },
  { q: 'Is Castkey live?', a: 'We’re in early access, onboarding the first creators and brands now. Applying is free.' },
]

// The Castkey Standard: the rules every deal follows. Castkey sets these; creators can only add stricter rules.
export const standard = {
  title: 'The Castkey Standard.',
  lead: 'AI likeness is new, so we wrote the rules. Every deal on Castkey follows them, for every creator and every brand.',
  rules: [
    { k: 'Verified consent', v: 'Every likeness comes from the real person, verified on camera.' },
    { k: 'Signed every time', v: 'Brand and creator sign the same Castkey terms on every deal.' },
    { k: 'Everything expires', v: 'Licenses run up to 12 months and can be renewed. Never forever.' },
    { k: 'Creators set the price', v: 'Licenses start at $100 a month.' },
    { k: 'Earn when ads run', v: 'Creators can turn on a 5% share of ad spend.' },
    { k: 'Creators keep 80%', v: 'Paid out automatically every month.' },
    { k: 'Approval if you want it', v: 'Creators can require their OK before any ad goes live.' },
    { k: 'No adult content, ever', v: 'And no one is ever shown as under 18.' },
    { k: 'AI is labeled', v: 'Wherever a platform or the law requires it.' },
  ],
}

export const calls = {
  title: 'Brands post what they’ll pay. You pick.',
  lead: 'Open calls are a bulletin board of paid briefs. See the budget up front and apply in a tap.',
  board: [
    { brand: 'Skincare brand', need: 'Face + voice', use: 'Paid social ads', length: '3 months', pay: '$600–900', tag: 'Women 25–34', pin: 'coral' },
    { brand: 'Fitness app', need: 'Face', use: 'App store and ads', length: '6 months', pay: '$1,200', tag: 'Any fitness creator', pin: 'ice' },
    { brand: 'Coffee brand', need: 'Voice', use: 'Radio and podcast ads', length: '2 months', pay: '$400–550', tag: 'Warm, calm voice', pin: 'paper' },
    { brand: 'Fintech app', need: 'Face + voice', use: 'Explainer videos', length: '12 months', pay: '$2,000', tag: 'Founders and creators', pin: 'ice' },
    { brand: 'Sneaker label', need: 'Face', use: 'Product drops', length: '1 month', pay: '$750', tag: 'Streetwear', pin: 'coral' },
    { brand: 'Travel app', need: 'Face + voice', use: 'Destination guides', length: '4 months', pay: '$500–800', tag: 'Travel creators', pin: 'paper' },
  ],
  minimum: {
    k: 'Your inbound minimum',
    v: 'Brands that request you must offer at least this. Open calls are yours to judge: go lower when the deal is worth it.',
  },
  brandCta: 'Brands: post an open call',
}

export const closing = {
  title: 'Your face. Your terms.',
  creator: { k: 'For creators', v: 'Join the waitlist. Tell us what you would license and where your lines are.' },
  brand: { k: 'For brands and agencies', v: 'Request an intro. Tell us what you want to make and who you need.' },
}
