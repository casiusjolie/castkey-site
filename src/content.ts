// All page copy and example data lives here so it can be edited without touching components.
// Everything marked "illustrative" is fictional and must stay labeled as such on the page.

import casiusPhoto from './assets/casius.jpg'

export const nav = [
  { id: 'how', label: 'How it works' },
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

// Pricing: one source of truth for every fee on the page.
export const pricing = {
  brandFee: 10, // % brands pay on top of the creator's price
  referral: 5, // % of each deal paid to whoever referred the creator, from Castkey's share
  referralCap: '$10,000',
  managerCap: 20, // max % of the creator's share a manager can take
  plans: [
    { id: 'standard', k: 'Standard', fee: 20, keep: 80, v: 'List on Castkey and anywhere else.' },
    { id: 'exclusive', k: 'Castkey Exclusive', fee: 10, keep: 90, v: 'License your AI likeness only through Castkey for 12 months. Get top placement, a deals contact, and a spot in Castkey’s own ads (you approve each one).' },
  ],
} as const

export const how = {
  title: 'How it works.',
  steps: [
    { k: 'Brands find you', v: 'Your profile shows up when brands search. No manager? Our team brings you deals.' },
    { k: 'You decide', v: 'Accept, counter or decline every request, and talk to brands in the app.' },
    { k: 'You get paid monthly', v: 'Brands subscribe to your license. Payouts are automatic.' },
  ],
}

export const earn = {
  title: 'How you get paid.',
  lead: 'A brand pays a monthly license. Castkey splits it automatically. Nobody invoices anybody.',
  extras: 'Earn more with paid ads (a share of the ad spend) and brand exclusivity (a premium you set to stay off a brand’s competitors).',
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
  voice: 'First person and natural. No profanity, no impersonating other people.',
  pack: 'Photos, talking videos and voice notes · reviewed by Castkey',
  packItems: ['Photos', 'Talking videos', 'Voice notes'],
  price: 'Set by Casius',
  adShare: 'Agreed per license when used in paid ads',
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
  { q: 'How do I get paid?', a: 'Brands subscribe monthly to your license. You keep 80%, or 90% with Castkey Exclusive. Brands pay Castkey’s 10% brand fee on top, so it never comes out of your share.' },
  { q: 'What is Castkey Exclusive?', a: 'Commit your AI likeness to Castkey for 12 months and our fee drops from 20% to 10%. You get top placement, a deals contact, and Castkey can feature you in its own ads, with your approval on each. Your normal sponsored posts aren’t affected.' },
  { q: 'Do I approve every brand?', a: 'Yes. You accept, counter or decline every request, and you can message the brand in the app first.' },
  { q: 'What do brands get?', a: 'Your training pack (photos, talking videos and voice recordings) plus a written license: where it runs, for how long, and your rules. Every profile needs a pack before it goes live.' },
  { q: 'Can my manager run my profile?', a: 'Yes, with the permissions you choose. Their split is paid automatically and can’t be more than 20% of your share.' },
  { q: 'How do referrals work?', a: 'Get your link and share it. When a creator you refer is approved and starts earning, you get 5% of every deal they do, up to $10,000 per creator, paid by Castkey.' },
  { q: 'Is adult content allowed?', a: 'No. Adult content using our creators is prohibited in all licensing deals. Alcohol, cannabis and betting brands only reach creators who opt in.' },
  { q: 'Is Castkey live?', a: 'We’re in early access, onboarding the first creators and brands now. Applying is free.' },
]

export const closing = {
  title: 'Your face. Your terms.',
  creator: { k: 'For creators', v: 'Join the waitlist. Tell us what you would license and where your lines are.' },
  brand: { k: 'For brands and agencies', v: 'Request a demo. Tell us what you want to make and who you need.' },
}
