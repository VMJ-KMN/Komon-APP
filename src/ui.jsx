import React from 'react'
import { ArrowUpLeft, ChevronRight, ChevronLeft, Check, X } from 'lucide-react'

export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
export const TODAY = new Date(2026, 10, 21)
export const key = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
export const cap = s => s.charAt(0).toUpperCase() + s.slice(1)
export const dShort = d => `${cap(DIAS[d.getDay()].slice(0, 3))} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`
export const money = n => '$' + n.toLocaleString('es-CL')
export const initials = n => n.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
export const pinText = p => p.split('').join(' ')

export const Header = ({ title, onBack }) => (
  <div className="hdr in">
    {onBack && <button className="back" aria-label="Atrás" onClick={onBack}><ArrowUpLeft size={22} strokeWidth={2} /></button>}
    <h1>{title}</h1>
  </div>
)
export const TabHeader = ({ title, right }) => <div className="hdr"><h1>{title}</h1>{right}</div>
export const Foot = ({ children, nb }) => <div className={'foot' + (nb ? ' nb' : '')}>{children}</div>
export const Btn = ({ v = '', children, ...p }) => <button className={'btn ' + v} {...p}>{children}</button>

export const Sheet = ({ children, onClose }) => (
  <div className="sheet-bg" onClick={onClose}><div className="sheet" onClick={e => e.stopPropagation()}><i style={{ width: 36, height: 4, borderRadius: 2, background: '#6b6d6b', alignSelf: 'center', marginTop: -12 }} />{children}</div></div>
)
export const Switch = ({ on, onChange, label }) => (
  <button role="switch" aria-checked={on} aria-label={label} className={'sw' + (on ? ' on' : '')} onClick={onChange}><i /></button>
)
export const Tabs = ({ items, value, onChange }) => (
  <div className="tabs" role="tablist">{items.map(([k, l, n]) => (
    <button key={k} role="tab" aria-selected={value === k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>{l}{n != null && <span className="cnt">{String(n).padStart(2, '0')}</span>}</button>))}</div>
)
export const Tile = ({ icon: I, size = 44, pri, ico = 22 }) => <span className={'tile' + (pri ? ' pri' : '')} style={{ width: size, height: size }}><I size={ico} strokeWidth={2} /></span>
export const Sum = ({ icon, label, value, detail, onClick, alert }) => (
  <button className={'sum' + (alert ? ' alert' : '')} onClick={onClick}>
    <Tile icon={icon} pri={alert} />
    <span className="b"><span className="t-xs mut">{label}</span><span className="t-base">{value}</span><span className="t-xs mut">{detail}</span></span>
    <ChevronRight size={16} color="#c5c5c5" />
  </button>
)
export const KV = ({ k, v }) => <div className="kv"><span>{k}</span><b>{v}</b></div>
export const PinBox = ({ label, pin }) => <div className="dash"><span className="upper">{label}</span><span className="pin">{pinText(pin)}</span></div>
export const Success = ({ size = 96 }) => <div className="ok" style={{ width: size, height: size }}><Check size={size * .5} strokeWidth={1.6} color="#fff" /></div>

export function Qr({ seed = 'x', size = 160, dim, bad }) {
  const N = 25
  let h = 2166136261
  for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) }
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967295 }
  const cells = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const f = (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7)
    let on
    if (f) { const lx = x >= N - 7 ? x - (N - 7) : x, ly = y >= N - 7 ? y - (N - 7) : y; on = lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4) } else on = rnd() > .5
    if (on) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1.02" height="1.02" />)
  }
  return (
    <div className="qr" style={{ padding: 20 }}>
      <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} fill={dim ? '#c9c9c9' : '#1b1d1b'} shapeRendering="crispEdges">{cells}</svg>
      {bad && <span className="tile" style={{ position: 'absolute', inset: 0, margin: 'auto', width: 72, height: 72, background: '#dc2626' }}><X size={36} color="#fff" strokeWidth={2} /></span>}
    </div>
  )
}

export function Calendar({ value, onChange }) {
  const [off, setOff] = React.useState(0)
  const first = new Date(TODAY.getFullYear(), TODAY.getMonth() + off, 1)
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const lead = (first.getDay() + 6) % 7
  const cells = []
  for (let i = 0; i < lead; i++) cells.push(<i key={'e' + i} />)
  for (let d = 1; d <= days; d++) {
    const date = new Date(first.getFullYear(), first.getMonth(), d)
    const sel = value && key(value) === key(date)
    cells.push(<button key={d} disabled={date < TODAY} onClick={() => onChange(date)} aria-label={`${d} de ${MESES[date.getMonth()]}`} className={(sel ? 'on ' : '') + (key(date) === key(TODAY) ? 'td' : '')}>{d}</button>)
  }
  return (
    <div className="card s" style={{ padding: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <button className="tile" style={{ width: 40, height: 40, border: 0, opacity: off === 0 ? .35 : 1 }} disabled={off === 0} aria-label="Mes anterior" onClick={() => setOff(off - 1)}><ChevronLeft size={20} /></button>
        <div className="t-base">{cap(MESES[first.getMonth()])} {first.getFullYear()}</div>
        <button className="tile" style={{ width: 40, height: 40, border: 0 }} aria-label="Mes siguiente" onClick={() => setOff(off + 1)}><ChevronRight size={20} /></button>
      </div>
      <div className="cal">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i}>{d}</span>)}{cells}</div>
    </div>
  )
}

export const Dot = ({ c, t }) => <span className="t-xs upper row" style={{ gap: 6, whiteSpace: 'nowrap' }}><i style={{ width: 8, height: 8, borderRadius: 4, background: c }} />{t}</span>
