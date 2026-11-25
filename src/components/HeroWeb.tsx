import { useEffect, useState } from 'react'

// Hero animation: a looping "web" of how a Castkey deal pays out.
// Brand → Castkey → creator, manager, referrer. Pulses travel along the lines every 4 seconds.
// Under reduced motion it shows the finished diagram with no moving parts.

const LOOP = '4s'
const INK = '#131209'
const CARD = '#1F1F1F'
const LINE = 'rgba(242,239,234,0.16)'
const PAPER = '#F2EFEA'
const SUB = '#A9A29B'
const CORAL = '#E8774F'
const ICE = '#B6D1EE'

type NodeProps = { x: number; y: number; w: number; h: number; k: string; amount?: string; sub?: string; tone?: 'coral' | 'ice' | 'plain' | 'hub' }

function Node({ x, y, w, h, k, amount, sub, tone = 'plain' }: NodeProps) {
  const stroke = tone === 'coral' ? CORAL : tone === 'ice' ? ICE : tone === 'hub' ? CORAL : LINE
  const fill = tone === 'hub' ? INK : CARD
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={18} fill={fill} stroke={stroke} strokeWidth={tone === 'plain' ? 1 : 1.5} />
      <text x={x + 18} y={y + 28} fill={tone === 'hub' ? CORAL : SUB} fontSize="14" fontWeight="600">{k}</text>
      {amount && <text x={x + 18} y={y + 62} fill={PAPER} fontSize="30" fontFamily="Newsreader, Georgia, serif">{amount}</text>}
      {sub && <text x={x + 18} y={y + (amount ? 86 : 52)} fill={SUB} fontSize="12.5">{sub}</text>}
    </g>
  )
}

/** A dot that travels a path once per loop, between two points of the loop (0–1). */
function Dot({ path, from, to, color }: { path: string; from: number; to: number; color: string }) {
  return (
    <circle r="5" fill={color} className="hw-dot" opacity="0">
      <animateMotion dur={LOOP} repeatCount="indefinite" path={path} keyPoints="0;0;1;1" keyTimes={`0;${from};${to};1`} calcMode="linear" />
      <animate attributeName="opacity" dur={LOOP} repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes={`0;${from};${from + 0.02};${to - 0.02};${to};1`} />
    </circle>
  )
}

/** A ring that flashes on a node when the money arrives. */
function Pulse({ x, y, w, h, at, color }: { x: number; y: number; w: number; h: number; at: number; color: string }) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={18} fill="none" stroke={color} strokeWidth="2.5" className="hw-dot" opacity="0">
      <animate attributeName="opacity" dur={LOOP} repeatCount="indefinite" values="0;0;1;0;0" keyTimes={`0;${at};${at + 0.04};${at + 0.2};1`} />
    </rect>
  )
}

const STEPS = ['Brand licenses a creator', 'Castkey checks and splits it', 'Everyone gets paid monthly']

export function HeroWeb() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStep(2); return }
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 1333)
    return () => clearInterval(t)
  }, [])

  // Desktop layout (1000 × 440)
  const brand = { x: 30, y: 160, w: 230, h: 120 }
  const hub = { x: 390, y: 175, w: 200, h: 90 }
  const outs = [
    { y: 20, k: 'Creator', amount: '$800', sub: '80%, paid every month', tone: 'coral' as const, color: CORAL },
    { y: 165, k: 'Manager (optional)', amount: 'Up to 20%', sub: 'of the creator’s share', tone: 'plain' as const, color: PAPER },
    { y: 310, k: 'Referrer', amount: '$50', sub: '5%, paid by Castkey', tone: 'ice' as const, color: ICE },
  ]
  const ox = 720, ow = 250, oh = 110
  const inPath = `M${brand.x + brand.w},${brand.y + brand.h / 2} L${hub.x},${hub.y + hub.h / 2}`
  const outPath = (y: number) => `M${hub.x + hub.w},${hub.y + hub.h / 2} C${hub.x + hub.w + 70},${hub.y + hub.h / 2} ${ox - 70},${y + oh / 2} ${ox},${y + oh / 2}`

  // Phone layout (360 × 560)
  const mb = { x: 20, y: 10, w: 320, h: 92 }
  const mh = { x: 80, y: 160, w: 200, h: 76 }
  const mo = [
    { x: 20, y: 300, w: 320, k: 'Creator', amount: '$800', sub: '80%, paid every month', tone: 'coral' as const, color: CORAL },
    { x: 20, y: 420, w: 154, k: 'Manager', amount: '≤ 20%', sub: 'optional', tone: 'plain' as const, color: PAPER },
    { x: 186, y: 420, w: 154, k: 'Referrer', amount: '$50', sub: 'paid by Castkey', tone: 'ice' as const, color: ICE },
  ]
  const mIn = `M180,${mb.y + mb.h} L180,${mh.y}`
  const mOut = (o: (typeof mo)[number]) => `M180,${mh.y + mh.h} C180,${mh.y + mh.h + 40} ${o.x + o.w / 2},${o.y - 40} ${o.x + o.w / 2},${o.y}`

  return (
    <figure className="relative px-4 py-6 sm:px-8 sm:py-8" aria-label="How a Castkey deal pays out: a brand pays $1,000 a month. Castkey checks the creator's rules and splits it: the creator keeps $800; an optional manager earns up to 20% of the creator's share; whoever referred the creator earns $50, paid by Castkey.">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-left">
        <div className="flex items-center gap-3" aria-live="off">
          <span className="flex gap-1" aria-hidden="true">
            {STEPS.map((_, i) => <span key={i} className={`h-1 w-6 rounded-full transition-colors duration-500 ${i <= step ? 'bg-coral' : 'bg-paper/15'}`} />)}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-sub">{STEPS[step]}</span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">Example · $1,000 / mo license</span>
      </div>

      {/* Desktop and tablet */}
      <svg viewBox="0 0 1000 440" className="hidden w-full md:block" aria-hidden="true" fontFamily="Geist, ui-sans-serif, system-ui, sans-serif">
        <defs>
          <filter id="hw-glow" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <path d={inPath} stroke={LINE} strokeWidth="1.5" fill="none" />
        {outs.map((o) => <path key={o.k} d={outPath(o.y)} stroke={LINE} strokeWidth="1.5" fill="none" />)}
        <path d={inPath} stroke={ICE} strokeOpacity="0.5" strokeWidth="1.5" fill="none" className="hw-flow" strokeLinecap="round" />
        {outs.map((o) => <path key={o.k} d={outPath(o.y)} stroke={o.color} strokeOpacity="0.45" strokeWidth="1.5" fill="none" className="hw-flow" strokeLinecap="round" />)}
        <rect x={hub.x - 10} y={hub.y - 10} width={hub.w + 20} height={hub.h + 20} rx={26} fill={CORAL} opacity="0.12" filter="url(#hw-glow)" />
        <Node {...brand} k="Brand pays" amount="$1,000/mo" sub="for one license" tone="ice" />
        <Node {...hub} k="Castkey" sub="Checks rules · splits it" tone="hub" />
        {outs.map((o) => <Node key={o.k} x={ox} y={o.y} w={ow} h={oh} k={o.k} amount={o.amount} sub={o.sub} tone={o.tone} />)}
        <Dot path={inPath} from={0.02} to={0.32} color={ICE} />
        <Pulse {...hub} at={0.32} color={CORAL} />
        {outs.map((o, i) => <Dot key={o.k} path={outPath(o.y)} from={0.38 + i * 0.04} to={0.7 + i * 0.04} color={o.color} />)}
        {outs.map((o, i) => <Pulse key={o.k} x={ox} y={o.y} w={ow} h={oh} at={0.7 + i * 0.04} color={o.color} />)}
      </svg>

      {/* Phone */}
      <svg viewBox="0 0 360 540" className="w-full md:hidden" aria-hidden="true" fontFamily="Geist, ui-sans-serif, system-ui, sans-serif">
        <path d={mIn} stroke={LINE} strokeWidth="1.5" fill="none" />
        {mo.map((o) => <path key={o.k} d={mOut(o)} stroke={LINE} strokeWidth="1.5" fill="none" />)}
        <path d={mIn} stroke={ICE} strokeOpacity="0.5" strokeWidth="1.5" fill="none" className="hw-flow" strokeLinecap="round" />
        {mo.map((o) => <path key={o.k} d={mOut(o)} stroke={o.color} strokeOpacity="0.45" strokeWidth="1.5" fill="none" className="hw-flow" strokeLinecap="round" />)}
        <Node {...mb} k="Brand pays" amount="$1,000/mo" tone="ice" />
        <Node {...mh} k="Castkey" sub="Checks rules · splits it" tone="hub" />
        {mo.map((o) => <Node key={o.k} x={o.x} y={o.y} w={o.w} h={100} k={o.k} amount={o.amount} sub={o.sub} tone={o.tone} />)}
        <Dot path={mIn} from={0.02} to={0.3} color={ICE} />
        <Pulse {...mh} at={0.3} color={CORAL} />
        {mo.map((o, i) => <Dot key={o.k} path={mOut(o)} from={0.36 + i * 0.04} to={0.68 + i * 0.04} color={o.color} />)}
        {mo.map((o, i) => <Pulse key={o.k} x={o.x} y={o.y} w={o.w} h={100} at={0.68 + i * 0.04} color={o.color} />)}
      </svg>
    </figure>
  )
}
