// All page copy and example data lives here so it can be edited without touching components.
// Everything marked "illustrative" is fictional and must stay labeled as such on the page.

import casiusPhoto from './assets/casius.jpg'

export const nav = [
  { id: 'why', label: 'Why Castkey' },
  { id: 'listing', label: 'Your listing' },
  { id: 'creator-pay', label: 'Pay' },
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
    tag: 'At launch',
    k: 'Built-in discoverability',
    v: 'Your listing is presented to vetted brands and advertisers as they search by category, look, voice and audience. No cold DMs, no chasing deals: the right brands find you and send a request.',
  },
  reasons: [
    { k: 'Paid without another shoot', v: 'Your reviewed pack does the work. Each accepted request is a monthly payment, not a one-off job.' },
    { k: 'Protected by design', v: 'Verified profiles only, and your rules attached to every license.' },
    { k: 'Priced by you', v: 'Set your monthly fee and charge a premium for exclusivity. Castkey keeps 20%, you keep 80%.' },
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
      points: ['Managers, agencies and scouts can apply', '5% of each referred creator’s license revenue', 'For their first 12 months, paid monthly', 'Paid by Castkey, never taken from the creator'],
      cta: 'Become a partner',
      action: 'partner',
    },
  ],
  note: 'Earnings depend on demand and the terms each side agrees. Nothing here is a guarantee of income.',
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
    { k: 'You review and verify', v: 'Accept, adjust the terms, or decline. Only you can say yes for your face.' },
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
    a: 'A brand sends you a usage request. You accept it, adjust the terms, or decline. Once you accept, the brand starts a monthly subscription and you’re paid every month it’s active, minus Castkey’s 20% commission. Paid ads also earn you an agreed share of the ad spend.',
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
    q: 'How do invites work?',
    a: 'Tap “Invite a creator” and choose text or email. The message is already written, so you just pick who it goes to. After you apply, your invites carry your personal link, so we know who you brought in.',
  },
  {
    q: 'Can a brand get exclusivity?',
    a: 'Yes, if you offer it. A brand can ask for category exclusivity (no competing brands in that category) or full exclusivity (no other brands at all) for the license term. You set the premium on top of your monthly fee, and you accept, adjust or decline the request like any other. Castkey blocks requests that would conflict with a license you already hold.',
  },
  {
    q: 'How does the partner program work?',
    a: 'Approved managers, agencies and scouts earn 5% of each referred creator’s license revenue for that creator’s first 12 months, paid monthly after brands pay. It comes out of Castkey’s commission, never the creator’s share, and partners must disclose the relationship when they promote Castkey.',
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
