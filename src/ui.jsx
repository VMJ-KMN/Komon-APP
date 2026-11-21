import React from 'react'

const P = {
  home:'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
  qr:'M5 4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM15 4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM5 14h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM14 14h3v3M20 14v6M14 20h3',
  box:'M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5L12 12l8.5-4.5M12 12v9',
  card:'M5 6h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM3 10h18M7 15h3',
  cal:'M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 3v4M16 3v4M4 10h16',
  bell:'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0',
  user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0',
  back:'M15 6l-6 6 6 6',
  chev:'M9 6l6 6-6 6',
  plus:'M12 5v14M5 12h14',
  check:'M5 12.5l4.5 4.5L19 7.5',
  x:'M6 6l12 12M18 6L6 18',
  tool:'M14.5 6.5a4 4 0 0 0 5 5L10 21a2.1 2.1 0 0 1-3-3zM14 7l3-3',
  share:'M12 4v11M8 8l4-4 4 4M5 13v6h14v-6',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  fire:'M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z',
  people:'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6.5 6.5 0 0 1 3.5 6',
  bulb:'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.8c.6.5 1 1.2 1 2.2h5c0-1 .4-1.7 1-2.2A6 6 0 0 0 12 3z',
  drop:'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  lift:'M5 4h14v16H5zM9 9l3-3 3 3M9 15l3 3 3-3',
  car:'M5 16V11l2-5h10l2 5v5M3 16h18M7 19v-3M17 19v-3',
  doc:'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  out:'M10 4H5v16h5M15 8l4 4-4 4M19 12H9',
  lock:'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  mail:'M4 6h16v12H4zM4 7l8 6 8-6',
}
export const Icon = ({ n, s = 22, c = 'currentColor', w = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
)

export const Top = ({ title, onBack, right }) => (
  <div className="top">
    {onBack && <button className="iconbtn" aria-label="Atrás" onClick={onBack}><Icon n="back" /></button>}
    <h1>{title}</h1>{right}
  </div>
)

export const Foot = ({ children }) => <div className="foot">{children}</div>

export const Sheet = ({ children, onClose }) => (
  <div className="sheet-bg" onClick={onClose}><div className="sheet" onClick={e => e.stopPropagation()}>{children}</div></div>
)

export const Switch = ({ on, onChange, label }) => (
  <button role="switch" aria-checked={on} aria-label={label} className={'sw' + (on ? ' on' : '')} onClick={onChange}><i /></button>
)

export const Item = ({ icon, title, sub, right, onClick, tint }) => (
  <button onClick={onClick} className="row" style={{ width: '100%', background: 'none', border: 0, padding: '14px 0', textAlign: 'left', minHeight: 72 }}>
    <span className="sq" style={tint ? { background: tint } : null}><Icon n={icon} /></span>
    <span className="grow"><div className="t1">{title}</div>{sub && <div className="t2">{sub}</div>}</span>
    {right}{onClick && !right && <Icon n="chev" c="#8A8C8A" />}
  </button>
)

// QR de demostración determinista
export function Qr({ seed = 'x', size = 200 }) {
  const N = 25
  let h = 2166136261
  for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) }
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967295 }
  const cells = []
  const finder = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7)
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let on
    if (finder(x, y)) {
      const fx = x % (N - 7 < x ? 1 : 1), lx = x >= N - 7 ? x - (N - 7) : x, ly = y >= N - 7 ? y - (N - 7) : y
      on = lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4)
    } else on = rnd() > 0.52
    if (on) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1.02" height="1.02" />)
  }
  return <div className="qr"><svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} fill="#1B1D1B" shapeRendering="crispEdges">{cells}</svg></div>
}

export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
export const TODAY = new Date(2026, 10, 21)
export const key = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
export const fmtDate = d => `${DIAS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`
export const money = n => '$' + n.toLocaleString('es-CL')

export function Calendar({ value, onChange, busy = [], maxDays = 90 }) {
  const [off, setOff] = React.useState(0)
  const first = new Date(TODAY.getFullYear(), TODAY.getMonth() + off, 1)
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const lead = (first.getDay() + 6) % 7
  const cells = []
  for (let i = 0; i < lead; i++) cells.push(<i key={'e' + i} />)
  for (let d = 1; d <= days; d++) {
    const date = new Date(first.getFullYear(), first.getMonth(), d)
    const past = date < TODAY, far = (date - TODAY) / 864e5 > maxDays
    const isBusy = busy.includes(key(date))
    const sel = value && key(value) === key(date)
    cells.push(
      <button key={d} disabled={past || far || isBusy} onClick={() => onChange(date)} aria-label={`${d} de ${MESES[date.getMonth()]}`}
        className={(sel ? 'on ' : '') + (key(date) === key(TODAY) ? 'td ' : '') + (isBusy ? 'busy' : '')}>{d}</button>
    )
  }
  return (
    <div className="card" style={{ padding: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <button className="iconbtn" style={{ background: 'var(--line)', opacity: off === 0 ? .35 : 1 }} disabled={off === 0} aria-label="Mes anterior" onClick={() => setOff(off - 1)}><Icon n="back" /></button>
        <div className="t1" style={{ fontWeight: 600, textTransform: 'capitalize' }}>{MESES[first.getMonth()]} {first.getFullYear()}</div>
        <button className="iconbtn" style={{ background: 'var(--line)' }} aria-label="Mes siguiente" onClick={() => setOff(off + 1)}><Icon n="chev" /></button>
      </div>
      <div className="cal">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i}>{d}</span>)}{cells}</div>
    </div>
  )
}
