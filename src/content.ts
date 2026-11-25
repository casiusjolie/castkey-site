// All page copy and example data lives here so it can be edited without touching components.
// Everything marked "illustrative" is fictional and must stay labeled as such on the page.

import casiusPhoto from './assets/casius.jpg'

export const nav = [
  { id: 'why', label: 'Why Castkey' },
  { id: 'listing', label: 'Your listing' },
  { id: 'creator-pay', label: 'Pay' },
  { id: 'refer', label: 'Refer & earn' },
  { id: 'agencies', label: 'Agencies' },
  { id: 'faq', label: 'FAQ' },
]

export const hero = {
  eyebrow: 'Castkey for creators · Early access',
  title: 'Get paid for your face.',
  body: 'License your likeness and voice to brands for AI content. Set your price once, stack brands, and keep earning without another shoot.',
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

export const statement = {
  title: 'AI content moves fast. Your permission comes first.',
}

export const pillars = [
  { k: 'Recurring', v: 'Every brand that licenses you pays a monthly fee you set, for as long as the license runs. No new shoot each month.', tone: 'coral' },
  { k: 'Stackable', v: 'License to several brands at once. Each one is its own monthly payment, inside the same rules you wrote once.', tone: 'paper' },
  { k: 'Premium', v: 'Earn more on top: a share of ad spend when brands run you in paid ads, and a premium you set for exclusivity.', tone: 'ice' },
]
export const why = {
  title: 'Why Castkey.',
  lead: 'Brands come to you. You don’t have to pitch.',
  feature: {
    tag: 'A marketplace, with a team',
    k: 'Brands find you. Our team helps.',
    v: 'Castkey is a marketplace. Your listing is shown to vetted brands and advertisers as they search by category, look, voice and audience, so the right ones find you and send a request. No manager finding you AI deals? Our in-house team brings you opportunities and guides you through each request, from pricing to what to accept.',
  },
  reasons: [
    { k: 'Paid without another shoot', v: 'Your reviewed pack does the work. Each accepted request is a monthly payment, not a one-off job.' },
    { k: 'Protected by design', v: 'Verified profiles only, and your rules attached to every license.' },
    { k: 'No manager needed', v: 'Our team finds AI deals for you and walks you through every request. Already have a manager? Their split is built in.' },
    { k: 'Talk to brands in the app', v: 'Requests, counter-offers and questions all happen in Castkey’s inbox, so terms stay on record and your number stays private.' },
    { k: 'Priced by you', v: 'Set your monthly fee and charge a premium for exclusivity. You keep 80% of every payment.' },
  ],
}

export const pillarsTitle = 'Three ways your face earns.'

export const everyone = {
  title: 'Everyone gets paid.',
  body: 'Castkey only works if every side does well. Here’s how each one earns.',
  sides: [
    {
      who: 'Creators',
      line: 'Recurring income from your likeness.',
      points: ['A monthly fee from every brand that licenses you', 'An agreed share when you run in paid ads', 'A premium you set for exclusivity', 'You keep 80% of everything'],
      cta: 'Apply to list your likeness',
      action: 'creator',
    },
    {
      who: 'Brands',
      line: 'Real faces at AI production speed.',
      points: ['Licensed, verified people instead of synthetic strangers', 'Content made without booking a shoot', 'Clear rules and a record of what you licensed', 'One subscription per creator'],
      cta: 'Request a demo',
      action: 'brand',
    },
    {
      who: 'Partners',
      line: 'Earn for the talent you bring.',
      points: ['Anyone who refers a creator can earn', '5% of what each referred creator earns', 'Up to $10,000 per creator you refer', 'Paid by Castkey, never taken from the creator'],
      cta: 'Become a partner',
      action: 'partner',
    },
  ],
  note: 'Earnings depend on demand and the terms each side agrees. Nothing here is a guarantee of income.',
}

// One rule everywhere: a referrer earns 5% of what each creator they refer earns, once that creator
// is approved and brands pay, up to $10,000 per referred creator. It comes out of Castkey's 20%.
export const referral = {
  headline: 'Refer creators and earn up to $10,000.',
  short: 'Earn 5% of what every creator you refer makes, up to $10,000 each.',
  body: 'When someone you invite is approved and starts earning, you get 5% of their earnings, up to $10,000 per creator. It’s paid from Castkey’s share, so the creator still keeps their full 80%.',
  rules: [
    'Starts once the creator you invited is approved and a brand has paid them.',
    'Paid monthly, after brands pay. Capped at $10,000 per creator you refer.',
    'Comes from Castkey’s 20%. The creator’s 80% is never touched.',
    'Tell people you earn a reward when you share your link. No referring yourself.',
  ],
  note: 'Referral rewards start when payouts open. Terms may be updated before launch; we’ll confirm the final terms before anyone earns.',
}

export const ecosystem = {
  eyebrow: 'How the money moves',
  title: 'Three people get paid on every deal.',
  lead: 'Every license has a brand paying, a creator earning, and the person who brought that creator in collecting a share, for as long as the creator keeps earning (up to $10,000).',
  example: 1000,
  people: [
    { k: 'The brand', role: 'Pays', amount: 1000, v: 'Subscribes to license a verified creator’s face and voice for its AI content, inside the creator’s rules.', tone: 'ice' },
    { k: 'The creator', role: 'Keeps 80%', amount: 800, v: 'Approves the brand, sets the price, and is paid every month the license runs.', tone: 'coral' },
    { k: 'The referrer', role: 'Earns 5%', amount: 50, v: 'Whoever invited the creator: another creator, a manager or a friend. Paid from Castkey’s share, up to $10,000 per creator.', tone: 'paper' },
  ],
  castkey: { k: 'Castkey', amount: 150, v: 'Runs the marketplace, the team that finds deals, verification and payments. 15% when a referrer is paid, 20% when not.' },
  note: 'Have a manager or agency? Their split comes out of the creator’s 80% at the rate you agree, paid automatically. Example: one $1,000 monthly license; prices are set by each creator, and figures are illustrative, not an estimate of earnings.',
}

export const agencies = {
  eyebrow: 'For agencies and managers',
  title: 'Bring your whole roster.',
  lead: 'Agencies and managers onboard every creator they represent in one go, run their deals from one place, and get paid two ways.',
  points: [
    { k: 'Upload your roster', v: 'Send us your roster and we onboard every creator together, with verification and listings set up for you. Built for large rosters.' },
    { k: 'Manage it in one place', v: 'See every request across your creators, accept, counter or decline on their behalf with their permission, and track what each license earns.' },
    { k: 'Your split, built in', v: 'Set your management commission per creator. It’s paid to you automatically every month, before the creator’s share lands. No invoicing, no chasing.' },
    { k: 'Plus 5% for bringing them', v: 'Every creator you onboard also earns you the referral reward: 5% of what they make, up to $10,000 each, paid from Castkey’s share.' },
  ],
  example: 'Example: a brand pays $1,000. The creator’s 80% is $800; with a 20% management split, $160 goes to the agency and $640 to the creator. The agency’s $50 referral reward comes from Castkey’s share.',
  cta: 'Talk to us about your roster',
  note: 'Roster onboarding, the management dashboard and automatic splits are being built for launch. Tell us about your roster and we’ll set you up first.',
}

export const messaging = {
  k: 'Talk to brands in the app',
  v: 'Every request, counter-offer and question happens in Castkey’s inbox, with your manager or our team looped in if you want. Terms stay on record, and you never have to hand out your number or email.',
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
  exclusivity: 'Open to category exclusivity · premium set by Casius',
}

export const invite = {
  eyebrow: 'Apply',
  title: 'Apply to list your likeness.',
  body: 'Three quick questions, about two minutes. We review every application by hand, and every profile is verified before it goes live.',
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

export const problem = {
  title: 'AI production moves fast. Permission should be clear.',
  body: 'Brands can now produce video, voice and imagery in hours. When that content uses a real person, the brand needs a clear agreement that covers who said yes and to what. The person needs a say in how their likeness is used, and in how they are paid for it.',
  sides: [
    {
      who: 'For brands',
      line: 'Understand who has agreed, what is licensed, and which uses are allowed.',
      points: ['A named, verified person behind every listing', 'Licensed assets and permitted uses in writing', 'One record you can show your team'],
    },
    {
      who: 'For creators',
      line: 'Define boundaries, set license terms, and see reported use.',
      points: ['Choose likeness, voice, or both', 'Write what stays off limits, once', 'See where licensees report your likeness running'],
    },
  ],
}

export const steps = [
  { t: 'Verify and define.', d: 'Creators complete identity and liveness checks and set the boundaries for their likeness and voice.' },
  { t: 'Review the assets.', d: 'Castkey reviews the training pack against those guidelines before it can be licensed.' },
  { t: 'License within scope.', d: 'Vetted buyers agree to the license and receive the approved assets. Uses inside the agreement do not require a new negotiation each time.' },
  { t: 'Report use and pay.', d: 'Buyers report placements and relevant ad spend. The licensing model pairs monthly fees with an agreed ad spend share for paid ads.' },
]
export const stepsNote =
  'This is the workflow Castkey is building toward during early access. Parts of it will run by hand at first, and not every step is automated today.'

export const brands = {
  title: 'Brands: see it in a demo.',
  body: 'During early access, we’re walking consumer brands and agencies through the licensing workflow one demo at a time: finding the right creator, the rules attached to each license, and how usage is reported.',
  audiences: [
    { k: 'Tech', v: 'Product explainers and in app experiences.' },
    { k: 'Ecommerce and DTC', v: 'Product stories and creative variations.' },
    { k: 'CPG', v: 'Campaign content and product education.' },
  ],
  audiencesNote: 'Audience examples, not customers. Agencies working for these brands are welcome to apply.',
  benefits: [
    { k: 'Clear scope of use', v: 'Permitted uses and restrictions are written before you license, and attached to the agreement.' },
    { k: 'Reviewed asset packs', v: 'Each training pack is reviewed against the creator’s guidelines before it can be licensed.' },
    { k: 'A recorded license', v: 'Who, what, scope and term, kept as a record both sides can refer back to.' },
    { k: 'Clear reporting expectations', v: 'You report placements and paid ad spend each month, as a condition of the license.' },
  ],
}

export const creators = {
  title: 'Your likeness. Your boundaries. Your terms.',
  body: 'Choose what you license, set the permitted uses, and define what stays off limits. The model is designed around recurring license income, without negotiating every piece of content inside the agreed scope.',
  options: [
    { k: 'Likeness only', v: 'Your face and on camera presence, licensed from a reviewed pack of photos and speaking video.' },
    { k: 'Voice only', v: 'Your voice, licensed from licensed voice material, with no visual likeness included.' },
    { k: 'Likeness and voice', v: 'Both together, under one set of rules and one license.' },
  ],
  paid: 'When a buyer runs your licensed likeness in paid ads, the license can carry an additional agreed share of that ad spend, on top of the monthly fee. Income depends on demand and the terms you agree; nothing is guaranteed.',
  fee: 'Castkey takes a 20% platform commission. License prices and paid ad terms are agreed for each license.',
  feeNote: 'Taxes and any third party costs are separate and depend on your situation.',
}

export const creatorPay = {
  title: 'Get paid every month.',
  lede: 'Brands ask. You decide. Brands pay monthly for usage.',
  flow: [
    { k: 'A brand sends a usage request', v: 'What they want to make, where it will run, for how long, and whether they want exclusivity.' },
    { k: 'You review and reply', v: 'Accept, counter, or decline, and message the brand inside Castkey if you have questions. Only you (or your manager, with your permission) can say yes for your face.' },
    { k: 'The brand subscribes', v: 'The subscription includes your reviewed training pack: photos, talking videos and voice notes. You’re paid every month it’s active, minus Castkey’s 20%.' },
  ],
  adsNote: 'Running you in paid ads? You also earn an agreed share of that ad spend.',
  exclusivity: {
    title: 'Exclusivity, priced by you.',
    body: 'Brands can ask to keep your face off their competitors. You decide whether to offer it and what it costs on top of your monthly fee.',
    levels: [
      { k: 'Open', tag: 'Default', v: 'License to as many brands as you like, inside your rules.' },
      { k: 'Category exclusive', tag: 'Premium you set', v: 'One brand per category for the term. For example, only one skincare brand.' },
      { k: 'Fully exclusive', tag: 'Premium you set', v: 'One brand only for the term. No other licenses while it runs.' },
    ],
    note: 'Exclusivity runs for the term in the license and can’t overlap an existing license. Castkey blocks conflicting requests.',
  },
  streams: [
    {
      k: 'Monthly license fee',
      v: 'You set a monthly price for your likeness, voice, or both. Each brand that licenses you pays it every month the license is active.',
      when: 'Brands pay up front at the start of each license month.',
    },
    {
      k: 'Paid-ad share',
      v: 'When a brand runs your licensed likeness in paid ads, you also earn an agreed percentage of the ad spend behind it.',
      when: 'Invoiced after each month, from the spend the brand reports. You hold audit rights over those reports.',
    },
  ],
  steps: [
    { k: 'Apply', v: 'Three quick questions, about two minutes.' },
    { k: 'Get verified and set up', v: 'If you’re a fit, we verify your profile. Then you upload your training pack, write your rules and set your price.' },
    { k: 'Get reviewed', v: 'We check your pack against your rules before anyone can license it.' },
    { k: 'Accept requests, get paid', v: 'Brands send usage requests. You accept, adjust or decline. Accepted requests start a monthly subscription.' },
  ],
  stepsNote: 'Early access: verification, licensing and payouts open as onboarding opens.',
  control: [
    'Your price, per month',
    'What you license: likeness, voice, or both',
    'What your AI likeness can never say, wear or do',
    'Takedown requests for content that breaks your rules',
    'Stopping new licenses at any time',
  ],
  calcNote:
    'Example math with numbers you choose. Not an estimate of what you will earn and not Castkey pricing: you set your price, and ad share terms are agreed per license. Before taxes and any third party costs.',
}

export const trust = {
  title: 'Permission needs a record. Boundaries need a process.',
  items: [
    { k: 'Verified people only', v: 'Every creator passes identity and liveness checks, plus review, before listing.' },
    { k: 'Vetted brands only', v: 'Anyone can browse. Only vetted brands can license, and nothing ships before vetting.' },
    { k: 'Every pack reviewed', v: 'Your training pack is checked against your rules. Any change is reviewed again.' },
    { k: 'Reported, auditable use', v: 'Brands report placements and ad spend monthly, with audit rights for you. No automatic tracking yet.' },
  ],
  limit:
    'Ending a license creates contractual obligations around future use and deletion of licensed files. It is not a remote erase button for downloaded assets or trained models.',
  planned:
    'Planned, not live: a permission verification key that a platform could check before generating with a licensed likeness. There is no public API or platform integration today.',
}

export type Profile = {
  type: string
  hue: [string, string]
  assets: string
  permitted: string[]
  restricted: string[]
}
export const profiles: Profile[] = [
  {
    type: 'Product video creator',
    hue: ['#E8774F', '#5a2b1b'],
    assets: 'Likeness and voice',
    permitted: ['Product demos and explainers', 'Organic social content', 'App onboarding'],
    restricted: ['Alcohol', 'Political content', 'Competitor comparisons'],
  },
  {
    type: 'Fitness creator',
    hue: ['#B6D1EE', '#26384c'],
    assets: 'Likeness only',
    permitted: ['Workout app content', 'Apparel product stories', 'Campaign variations'],
    restricted: ['Supplement or medical claims', 'Before-and-after body claims', 'Gambling'],
  },
  {
    type: 'Voice artist',
    hue: ['#A9A29B', '#3a3632'],
    assets: 'Voice only',
    permitted: ['App narration', 'Product tutorials', 'Audio ads'],
    restricted: ['Impersonating other people', 'Political ads', 'Profanity'],
  },
]

export const faq = [
  {
    q: 'How do I get paid?',
    a: 'A brand sends you a usage request. You accept it, adjust the terms, or decline. Once you accept, the brand starts a monthly subscription and you keep 80% of every payment, every month it’s active. If someone referred you, their 5% comes out of Castkey’s share, not yours. Paid ads also earn you an agreed share of the ad spend.',
  },
  {
    q: 'Can I license only my voice or only my likeness?',
    a: 'Yes. Likeness only, voice only, or both. You choose what each license covers.',
  },
  {
    q: 'Do I approve every brand?',
    a: 'Yes. Every brand sends a usage request first, and you accept, adjust or decline it. Once you accept, the brand can use your licensed assets inside the agreed scope without asking again for each piece of content.',
  },
  {
    q: 'How does verification work?',
    a: 'Every profile on Castkey is verified before it goes live. If your application is accepted, we confirm your identity through a verification partner during setup. Castkey receives a pass or fail, never your ID images.',
  },
  {
    q: 'How is my usage tracked?',
    a: 'At launch, brands report where your licensed content ran and the ad spend behind it, every month, as a condition of the license. You hold audit rights over those reports. Direct ad account integrations are future work.',
  },
  {
    q: 'Can I end a license?',
    a: 'Yes, under the agreement’s terms. You can also stop new licenses at any time. Notice, existing content and deletion of licensed files are set by the agreement; it isn’t an instant worldwide removal.',
  },
  {
    q: 'What does a brand get with a subscription?',
    a: 'A license to use you inside your rules, plus your reviewed training pack: the photos, talking videos and voice notes you approved. Access lasts while the subscription is active, and deletion when it ends is set by the license.',
  },
  {
    q: 'How do referrals work?',
    a: 'Tap “Invite a creator” and choose text or email; the message is already written. After you apply, your invites carry your personal link. When someone you invited is approved and starts earning, you earn 5% of their earnings, up to $10,000 per creator. It’s paid from Castkey’s share, so they still keep their full 80%. Please mention that you earn a reward when you share.',
  },
  {
    q: 'Can a brand get exclusivity?',
    a: 'Yes, if you offer it. A brand can ask for category exclusivity (no competing brands in that category) or full exclusivity (no other brands at all) for the license term. You set the premium on top of your monthly fee, and you accept, adjust or decline the request like any other. Castkey blocks requests that would conflict with a license you already hold.',
  },
  {
    q: 'I’m a manager or agency. Can I bring my roster?',
    a: 'Yes. Agencies can upload their whole roster and manage it from one place, with their management split paid automatically. They also earn the referral reward on every creator they bring in: 5% of what each one earns, up to $10,000 per creator, paid from Castkey’s share. Tell us about your roster and we’ll set you up first.',
  },
  {
    q: 'Do brands message me directly?',
    a: 'Yes, inside Castkey. Requests, counter-offers and questions all happen in the in-app inbox, so you don’t have to share your number or email and every agreed term stays on record. Your manager or our team can be looped in.',
  },
  {
    q: 'I have a manager. How do they get paid?',
    a: 'Management splits are built in. Your manager sets their commission with you, and Castkey pays it to them automatically from your share each month, so nobody has to invoice anyone. Agencies can also upload and manage their whole roster.',
  },
  {
    q: 'I don’t have a manager. Who finds me deals?',
    a: 'Castkey is a marketplace, so brands can find and request you directly. On top of that, our in-house team looks for AI deals that fit you and guides you through each request: what to charge, what to accept and what to change.',
  },
  { q: 'Is adult content allowed?', a: 'Nudity and sexually explicit content are never allowed in anything licensed through Castkey. Vice brands such as alcohol, cannabis and betting can use Castkey, but they only reach creators who opt in to their category, and campaigns must follow the age and ad rules for that category.' },
  {
    q: 'Is Castkey live?',
    a: 'Not yet. We’re in early access. Creators can apply to list their likeness, and brands can request a demo. We’re not promising dates.',
  },
]

export const closing = {
  title: 'Your face. Your terms.',
  creator: { k: 'For creators', v: 'Join the waitlist. Tell us what you would license and where your lines are.' },
  brand: { k: 'For brands and agencies', v: 'Request a demo. Tell us what you want to make and who you need.' },
}
