import React, { useState, useEffect } from 'react'
import { House, ScanQrCode, Package, Wallet, LayoutGrid, QrCode, Calendar as Cal, ClipboardList, Receipt, Bell, Utensils, Users, CircleAlert, ArrowUpRight, ArrowUpLeft, Clock, Building2, Shield, Droplet, Flame, Landmark, Lock, Camera, Wrench, MessageCircle, CircleHelp, CreditCard, Info, Plus, ChevronRight, Check, Wifi, Settings, Megaphone, TriangleAlert, CircleCheck, UserRound, ShieldCheck, LogOut, Accessibility, CircleX, Phone, Mail, FlaskConical, Image as ImageIcon, Trash2 } from 'lucide-react'
import { Header, TabHeader, Foot, Btn, Sheet, Switch, Tabs, Tile, Sum, KV, PinBox, Success, Qr, Calendar, Dot, TODAY, MESES, DIAS, key, cap, dShort, money, initials } from './ui.jsx'
import { initial, BLOCKS, STEPS, SHORT } from './data.js'

const LS = 'serenity-demo-v3'
const load = () => { try { const s = JSON.parse(localStorage.getItem(LS)); if (s) return s } catch (e) {} return initial() }
const dt = s => new Date(s)
const hhmm = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') }
const NAV = ['home', 'accesos', 'enc', 'fin', 'serv']
const CATICON = { 'Mantención de áreas comunes': Wrench, 'Problema en mi departamento': House, 'Convivencia o ruidos': MessageCircle, 'Consulta o sugerencia': CircleHelp }
const ICONS = { building: Building2, shield: Shield, drop: Droplet, flame: Flame }

export default function App() {
  const [st, setSt] = useState(load)
  const [stack, setStack] = useState([{ s: st.onboarded ? 'home' : 'onb' }])
  const [toast, setToast] = useState(null)
  useEffect(() => { try { localStorage.setItem(LS, JSON.stringify(st)) } catch (e) {} }, [st])
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2400); return () => clearTimeout(t) } }, [toast])
  const cur = stack[stack.length - 1]
  const A11 = { size: 'n', contrast: 'normal', motion: 'normal', theme: 'oscuro', ...(st.a11y || {}) }
  const [sysLight, setSysLight] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
  useEffect(() => {
    const m = window.matchMedia('(prefers-color-scheme: light)'), f = e => setSysLight(e.matches)
    m.addEventListener('change', f); return () => m.removeEventListener('change', f)
  }, [])
  const theme = A11.theme === 'auto' ? (sysLight ? 'claro' : 'oscuro') : A11.theme
  useEffect(() => {
    const r = document.documentElement
    r.dataset.size = A11.size; r.dataset.contrast = A11.contrast; r.dataset.motion = A11.motion; r.dataset.theme = theme
    const mt = document.querySelector('meta[name=theme-color]'); if (mt) mt.setAttribute('content', theme === 'claro' ? '#f6f6f4' : '#1b1d1b')
  }, [A11.size, A11.contrast, A11.motion, theme])
  const [live, setLive] = useState('')
  useEffect(() => {
    setToast(null)
    const t = setTimeout(() => {
      const h = document.querySelector('.phone h1')
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); setLive(h.textContent) }
    }, 60)
    return () => clearTimeout(t)
  }, [cur.s])

  // Botón/gesto "atrás" del teléfono: cada pantalla apilada es una entrada del historial
  const hd = React.useRef(0), skip = React.useRef(0)
  useEffect(() => {
    const need = stack.length - 1
    if (need > hd.current) { for (let i = hd.current; i < need; i++) history.pushState({ k: i + 1 }, ''); hd.current = need }
    else if (need < hd.current) { const d = hd.current - need; hd.current = need; skip.current += 1; history.go(-d) }
  }, [stack.length])
  useEffect(() => {
    const f = () => {
      if (skip.current > 0) { skip.current -= 1; return }
      if (hd.current > 0) { hd.current -= 1; dir.current = 'bck'; setStack(a => (a.length > 1 ? a.slice(0, -1) : a)) }
    }
    window.addEventListener('popstate', f); return () => window.removeEventListener('popstate', f)
  }, [])
  const up = f => setSt(s => ({ ...s, ...f(s) }))
  const dir = React.useRef('dfade')
  const go = (s, p = {}) => { dir.current = 'fwd'; setStack(a => [...a, { s, p }]) }
  const back = () => { dir.current = 'bck'; setStack(a => (a.length > 1 ? a.slice(0, -1) : [{ s: 'home' }])) }
  const tab = (s, p = {}) => { dir.current = 'dfade'; setStack([{ s, p }]) }
  const under = (base, s, p = {}) => { dir.current = 'fwd'; setStack([{ s: base[0], p: base[1] || {} }, { s, p }]) }
  const replace = (s, p = {}) => { dir.current = 'fwd'; setStack(a => [...a.slice(0, -1), { s, p }]) }
  const reset = () => { setSt(s => ({ ...initial(), sim: s.sim, a11y: s.a11y })); setStack([{ s: 'onb' }]) }
  const A = { st, up, go, back, tab, replace, toast: setToast, reset, under, p: cur.p || {}, deep: stack.length > 1 }

  const Screens = { onb: Onb, home: Home, accesos: Accesos, nuevoPase: NuevoPase, paseCreado: PaseCreado, pase: PaseDetalle, paseRev: PaseRevocado,
    enc: Encomiendas, fin: Finanzas, detalleCobro: DetalleCobro, historial: HistorialPagos, pagar: Pagar, confPago: ConfPago, proc: Procesando, pagoOk: PagoOk, comp: Comprobante,
    serv: Servicios, reservar: Reservar, confReserva: ConfReserva, reservaOk: ReservaOk,
    solCat: SolCat, solForm: SolForm, solOk: SolOk, sol: SolDetalle, avisos: Avisos, ajustes: Ajustes, perfil: Perfil, a11y: Accesib, datos: Datos, ayuda: Ayuda, pagoFail: PagoFallido, correo: Correo, correoOk: CorreoOk }
  const S = Screens[cur.s]
  const showNav = NAV.includes(cur.s) || cur.s === 'avisos'
  const act = cur.s === 'avisos' ? 'home' : cur.s
  const nPass = st.passes.filter(p => p.status === 'vigente').length
  const nPkg = st.pkgs.filter(p => p.status === 'porteria').length
  const items = [['home', House, 'Inicio'], ['accesos', ScanQrCode, 'Accesos', nPass], ['enc', Package, 'Encomiendas', nPkg], ['fin', Wallet, 'Finanzas', 'dot'], ['serv', LayoutGrid, 'Servicios']]

  return (
    <div className="stage"><div className={'phone' + (cur.s === 'home' ? ' home' : '')}>
      <div className="sbar" aria-hidden="true"><span>9:41</span><span className="ind"><span style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>{[4, 6, 8, 10].map(h => <i key={h} style={{ width: 3, height: h, borderRadius: 1, background: 'var(--content)' }} />)}</span><Wifi size={17} /><span style={{ position: 'relative', width: 27, height: 13 }}><i style={{ position: 'absolute', left: 0, top: 0, width: 24, height: 12, border: '1px solid var(--content-muted)', borderRadius: 4 }} /><i style={{ position: 'absolute', left: 2, top: 2, width: 20, height: 8, borderRadius: 2.5, background: 'var(--content)' }} /><i style={{ position: 'absolute', left: 25, top: 4, width: 2, height: 4, borderRadius: 1, background: 'var(--content-muted)' }} /></span></span></div>
      <div className={'scr ' + dir.current} key={cur.s + ':' + stack.length}><S {...A} /></div>
      <div className="hind" aria-hidden="true"><i /></div>
      {showNav && <>
        <div className="fade" />
        <nav className="nav" aria-label="Principal">
          {items.map(([k, I, l, b]) => (
            <button key={k} className={act === k ? 'on' : ''} onClick={() => tab(k)} aria-current={act === k ? 'page' : undefined} aria-label={l + (b === 'dot' ? (st.bills.length > 0 ? ', pago pendiente' : '') : b > 0 ? `, ${b} ${b === 1 ? 'pendiente' : 'pendientes'}` : '')}>
              {act === k ? <FilledIcon k={k} /> : <I size={20} strokeWidth={2} />}{l}
              {b === 'dot' ? st.bills.length > 0 && <i className="dot" aria-hidden="true" /> : b > 0 && <span className="bd" aria-hidden="true">{b}</span>}
            </button>))}
        </nav></>}
      {toast && <div className="toast" role="status"><CircleCheck size={18} aria-hidden="true" />{toast}</div>}
      <div className="sr" role="status" aria-live="polite">{live}</div>
    </div></div>
  )
}

/* ---------- Onboarding ---------- */
function Onb({ st, up, tab }) {
  const [n, setN] = useState(0)
  const [sw, setSw] = useState(st.sw)
  const pushed = React.useRef(0)
  const adv = to => { history.pushState({ ob: to }, ''); pushed.current += 1; setN(to) }
  const prev = () => { if (pushed.current > 0) history.back(); else setN(x => Math.max(0, x - 1)) }
  useEffect(() => {
    const f = () => { if (pushed.current > 0) { pushed.current -= 1; setN(x => Math.max(0, x - 1)) } }
    window.addEventListener('popstate', f); return () => window.removeEventListener('popstate', f)
  }, [])
  const finish = () => { const k = pushed.current; pushed.current = 0; up(() => ({ onboarded: true, sw })); tab('home'); if (k > 0) setTimeout(() => history.go(-k), 0) }
  const slides = [
    [House, 'Tu comunidad, en tu mano', 'Visitas, pagos, encomiendas y reservas del edificio en un solo lugar.'],
    [QrCode, 'Invita sin llamar a conserjería', 'Crea un pase con QR en segundos y revócalo cuando quieras.'],
    [Wallet, 'Todo al día, sin papeles', 'Paga tus gastos comunes y entérate apenas llega una encomienda.'],
    [Cal, 'Reserva y pide ayuda', 'Reserva el quincho gratis y haz solicitudes con seguimiento.'],
  ]
  const lab = ['Comenzar', 'Siguiente', 'Siguiente', 'Siguiente', 'Activar y continuar', 'Ir al Inicio']
  const rows = [['pases', 'Pases y visitas', 'Cuando llega o sale una visita'], ['paq', 'Encomiendas', 'Cuando llega un paquete'], ['fin', 'Gastos comunes', 'Vencimientos y comprobantes']]
  const I = n <= 3 ? slides[n][0] : null
  return (
    <>
      <div className="hdr" style={{ justifyContent: 'space-between', paddingTop: 'calc(env(safe-area-inset-top) + 20px)' }}>
        <div style={{ width: 72 }}>{n > 0 && <button className="back" aria-label="Atrás" onClick={prev} style={{ background: 'none', border: 0, height: 40, display: 'flex', alignItems: 'center' }}><ArrowUpLeft size={22} /></button>}</div>
        {n >= 1 && n <= 4 && <div className="row" style={{ gap: 8 }} aria-label={`Paso ${n} de 4`}>{[1, 2, 3, 4].map(i => <span key={i} style={{ width: i === n ? 24 : 8, height: 8, borderRadius: 4, background: i === n ? '#f3f3f3' : '#444544' }} />)}</div>}
        <div style={{ width: 72, textAlign: 'right' }}>{n >= 1 && n <= 4 && <button className="lnk" style={{ color: 'var(--content-muted)', height: 40 }} onClick={() => adv(5)}>Omitir</button>}</div>
      </div>
      <div key={n} className="scroll col center" style={{ justifyContent: "center", gap: 24 }}>
        {n === 0 && <><img className="logo-d" src="/logo-komon.svg" alt="Komón" width="150" height="139" />
          <img className="logo-l" src="/logo-komon-claro.svg" alt="Komón" width="150" height="139" />
          <div className="col" style={{ gap: 12 }}><h1 style={{ margin: 0, fontSize: '2rem', lineHeight: 1.2, fontWeight: 590 }}>Tu comunidad, en tu mano</h1><p className="mut" style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5rem' }}>{slides[0][2]}</p></div></>}
        {I && n > 0 && <><span className="tile" style={{ width: 120, height: 120, background: 'var(--muted)' }}><I size={52} strokeWidth={1.6} /></span>
          <div className="col" style={{ gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', lineHeight: 1.2, fontWeight: 590 }}>{slides[n][1]}</h1><p className="mut" style={{ margin: 0, fontSize: '1rem', lineHeight: '1.5rem' }}>{slides[n][2]}</p></div></>}
        {n === 4 && <div style={{ width: '100%' }}><h1 style={{ margin: '0 0 12px', fontSize: '1.75rem', fontWeight: 590 }}>Avisos que importan</h1><p className="mut" style={{ margin: '0 0 24px', fontSize: '1rem' }}>Elige de qué quieres enterarte. Puedes cambiarlo después en tu perfil.</p>
          <div className="card s" style={{ padding: '0 16px', textAlign: 'left' }}>{rows.map(([k, l, s], i) => <div key={k} className="row" style={{ minHeight: 68, gap: 12, borderTop: i ? '1px solid var(--border)' : 0 }}><div style={{ flex: 1 }}><div className="t-base">{l}</div><div className="t-sm mut">{s}</div></div><Switch label={l} on={sw[k]} onChange={() => setSw({ ...sw, [k]: !sw[k] })} /></div>)}</div></div>}
        {n === 5 && <><span className="tile" style={{ width: 120, height: 120, background: 'var(--success)' }}><Check size={56} strokeWidth={1.8} /></span><div><h1 style={{ margin: '0 0 12px', fontSize: '1.75rem', fontWeight: 590 }}>Todo listo, Residente</h1><p className="mut" style={{ margin: 0, fontSize: '1rem' }}>Tu Inicio te muestra primero lo que requiere tu atención.</p></div></>}
      </div>
      <Foot nb>
        <Btn onClick={() => (n === 5 ? finish() : adv(n + 1))}>{lab[n]}</Btn>
        {(n === 0 || n === 4) ? <Btn v="dark" onClick={() => (n === 0 ? finish() : adv(5))}>{n === 0 ? 'Ya tengo cuenta' : 'Ahora no'}</Btn> : <div style={{ height: 48 }} />}
      </Foot></>)
}

/* ---------- Inicio ---------- */
function Home({ st, go }) {
  const pk = st.pkgs.filter(x => x.status === 'porteria')
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  const act = st.passes.filter(p => p.status === 'vigente')
  const rsv = st.reservas.slice().sort((a, b) => dt(a.date) - dt(b.date))[0]
  const open = st.reqs.filter(r => r.status < 2)
  const nt = st.notices[0]
  const qa = [[QrCode, 'Nuevo pase', () => go('nuevoPase'), 1], [Cal, 'Reservar', () => go('reservar')], [ClipboardList, 'Solicitud', () => go('solCat')], [Receipt, 'Pagar', () => go('pagar')]]
  return (
    <>
      <div className="scroll nav-pad home" style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, gap: 0 }}>
        <div className="hero">
          <div className="hrow">
            <div className="col" style={{ flex: 1, gap: 2, minWidth: 0 }}><h1>Hola,<br />Residente</h1><span className="t-sm">Torre A · Depto 1204</span></div>
            <button className="tile hbtn" aria-label="Avisos" onClick={() => go('avisos')} style={{ width: 40, height: 40, border: 0, position: 'relative', marginTop: -2 }}><Bell size={20} /><i style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, background: '#e5484d' }} /></button>
            <button className="av hbtn" aria-label="Perfil" onClick={() => go('perfil')} style={{ width: 40, height: 40, background: 'none', overflow: 'hidden', padding: 0, marginTop: -2 }}>{st.photo ? <img src={st.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'RD'}</button>
          </div>
          <div className="glass row" style={{ gap: 4, alignItems: 'stretch' }}>
            {qa.map(([I, l, f, p]) => <button key={l} className="qa" onClick={f}><Tile icon={I} size={40} ico={20} pri={p} />{l}</button>)}
          </div>
        </div>
        <div className="sheet">
        {(total > 0 || pk.length > 0) && <div className="col" style={{ gap: 12 }}>
          <p className="sec">Requiere tu atención</p>
          {total > 0 && <Sum alert icon={Receipt} label="Saldo por pagar" value={money(total)} detail={(st.sim && st.sim.vencido) ? 'Vencido el 10 de noviembre' : 'Vence el 10 de diciembre'} onClick={() => go('fin')} />}
          {pk.length > 0 && <Sum icon={Package} label="Encomiendas" value={`${pk.length} por retirar`} detail={[...new Set(pk.map(p => p.from))].join(' · ')} onClick={() => go('enc')} />}
        </div>}
        {nt && <div className="col" style={{ gap: 12 }}><p className="sec">Aviso destacado</p><Notice n={{ ...nt, eyebrow: 'AVISOS', date: null }} action onClick={() => go('avisos')} /></div>}
        <div className="col" style={{ gap: 12 }}>
          <p className="sec">Tu actividad</p>
          <Sum icon={QrCode} label="Visitas vigentes" value={`${act.length} ${act.length === 1 ? 'pase activo' : 'pases activos'}`} detail={act[0] ? `${act[0].name} · ${act[0].when}` : 'Sin pases activos'} onClick={() => go('accesos')} />
          <Sum icon={Utensils} label="Próxima reserva" value={rsv ? `${rsv.space} · ${dShort(dt(rsv.date)).toLowerCase()}` : 'Sin reservas'} detail={rsv ? `${rsv.from} – ${rsv.to}` : 'Reserva un espacio'} onClick={() => go('serv')} />
          <Sum icon={ClipboardList} label="Mis solicitudes" value={`${open.length} en revisión`} detail={open[0] ? open[0].title : 'Todo al día'} onClick={() => go('serv', { tab: 'sol' })} />
        </div>
        </div>
      </div></>)
}

function Notice({ n, onClick, action }) {
  const pri = n.kind === 'urg'
  const Ic = pri ? CircleAlert : n.kind === 'com' ? Megaphone : Wrench
  return (
    <div role="button" onClick={onClick} className="col" style={{ gap: 8, padding: 20, borderRadius: 16, background: pri ? 'var(--primary)' : 'var(--muted)', color: pri ? '#fff' : undefined, cursor: 'pointer' }}>
      <div className="row" style={{ gap: 8, minHeight: 20 }}>
        <Ic size={20} /><span className="t-sm" style={{ flex: 1, fontWeight: 510 }}>{n.eyebrow}</span>
        {n.date && <span className="t-xs" style={{ color: pri ? 'rgba(255,255,255,.85)' : 'var(--content-muted)' }}>{n.date}</span>}
        {action && <span className="tile" style={{ width: 40, height: 40, background: pri ? '#f3f3f3' : 'var(--content)', color: pri ? '#1b1d1b' : 'var(--surface)' }}><ArrowUpRight size={20} /></span>}
      </div>
      <div className="t-lg">{n.t}</div>
      <div className="t-sm" style={{ opacity: .9 }}>{n.s}</div>
    </div>)
}

function ManCard({ n }) {
  return (
    <div className="card s col" style={{ gap: 12 }}>
      <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}><Wrench size={22} style={{ marginTop: 2 }} /><span className="t-base" style={{ flex: 1, fontWeight: 400 }}>{n.t}</span><span className="tag">{n.badge}</span></div>
      <div className="col" style={{ gap: 4 }}><span className="t-xs mut">{n.date}</span>{n.time && <span className="t-xs mut">{n.time}</span>}{n.s && <span className="t-xs" style={{ marginTop: 8 }}>{n.s}</span>}</div>
    </div>)
}

/* ---------- Accesos ---------- */
const STC = { usado: '#818181', revocado: '#dc2626', expirado: '#818181' }
function Accesos({ st, go }) {
  const [t, setT] = useState('v')
  const vig = st.passes.filter(p => p.status === 'vigente'), hist = st.passes.filter(p => p.status !== 'vigente')
  return (
    <>
      <TabHeader title="Accesos" />
      <div className="scroll nav-pad" style={{ paddingTop: 12 }}>
        <Tabs items={[['v', 'Vigentes', vig.length], ['h', 'Historial']]} value={t} onChange={setT} />
        {t === 'v' && vig.length === 0 && <div className="col center" style={{ gap: 12, paddingTop: 24 }}>
          <span className="tile" style={{ width: 96, height: 96 }}><QrCode size={40} strokeWidth={1.6} /></span>
          <span className="t-lg" style={{ marginTop: 8 }}>No tienes pases vigentes</span>
          <span className="t-sm mut" style={{ maxWidth: 260 }}>Crea un pase para que tus visitas entren sin llamar a conserjería.</span>
          <div style={{ height: 8 }} /><Btn onClick={() => go('nuevoPase')}>Crear pase</Btn></div>}
        {t === 'v' && vig.map(p => (
          <div key={p.id} className="card col" style={{ gap: 16 }}>
            <div className="row" style={{ gap: 12 }}>
              <span className="av" style={{ width: 48, height: 48 }}>{initials(p.name)}</span>
              <div className="col" style={{ gap: 4, minWidth: 0 }}><span className="t-base" style={{ fontWeight: 400 }}>{p.name}</span><span className="tag" style={{ alignSelf: 'flex-start' }}>{p.kind} • <Clock size={12} /> {p.when}</span></div>
            </div>
            <PinBox label="PIN de visita" pin={p.pin} />
            <div className="row" style={{ gap: 12 }}><Btn v="inv" onClick={() => go('pase', { id: p.id })}>Ver</Btn><Btn v="danger" onClick={() => go('pase', { id: p.id, ask: true })}>Revocar</Btn></div>
          </div>))}
        {t === 'h' && hist.map(p => (
          <button key={p.id} onClick={() => go('pase', { id: p.id })} className="row" style={{ gap: 12, background: 'var(--card-alt)', border: 0, borderRadius: 16, padding: 16, textAlign: 'left', width: '100%', alignItems: 'flex-start' }}>
            <span className="av" style={{ width: 40, height: 40 }}>{initials(p.name)}</span>
            <div className="col" style={{ flex: 1, gap: 6, minWidth: 0 }}><span className="t-base" style={{ fontWeight: 400 }}>{p.name}</span><span className="tag" style={{ alignSelf: 'flex-start' }}>{p.kind} • <Clock size={12} /> {p.when}</span></div>
            <Dot c={STC[p.status]} t={p.status} />
          </button>))}
      </div>
      {t === 'v' && vig.length > 0 && <button className="fab" onClick={() => go('nuevoPase')}><Plus size={20} /> Nuevo pase</button>}
    </>)
}

function NuevoPase({ up, back, replace }) {
  const [kind, setKind] = useState('Visita')
  const [name, setName] = useState('')
  const [rut, setRut] = useState('')
  const [dur, setDur] = useState('1 día')
  const [date, setDate] = useState(null)
  const [er, setEr] = useState({})
  const create = () => {
    const e = {}
    if (name.trim().length < 2) e.name = 'Escribe el nombre de la visita'
    if (rut.trim() && !/^\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]$/.test(rut.trim())) e.rut = 'Revisa el RUT. Ejemplo: 12.345.678-9'
    if (dur === 'Elegir fecha' && !date) e.date = 'Elige una fecha en el calendario'
    setEr(e)
    if (Object.keys(e).length) { setTimeout(() => document.querySelector('[aria-invalid="true"], .errtxt')?.scrollIntoView({ block: 'center' }), 30); setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 60); return }
    const id = 'p' + Date.now(), n = name.trim()
    const pin = String(1000 + Math.floor(Math.random() * 9000))
    const week = new Date(TODAY.getTime() + 7 * 864e5)
    const valid = dur === '1 día' ? 'Hoy, 23:59' : dur === '1 semana' ? `${week.getDate()} ${MESES[week.getMonth()].slice(0, 3)}, 23:59` : `${date.getDate()} ${MESES[date.getMonth()].slice(0, 3)}, 23:59`
    const long = dur === '1 día' ? 'hoy hasta las 23:59' : `hasta el ${valid.replace(', ', ' a las ')}`
    up(s => ({ passes: [{ id, name: n, kind, when: dur === 'Elegir fecha' ? dShort(date) : dur === '1 día' ? '1 Día' : '1 Semana', pin, rut: rut || '—', created: 'Hoy, ' + hhmm(), valid, long, status: 'vigente' }, ...s.passes] }))
    replace('paseCreado', { id })
  }
  return (
    <>
      <Header title="Nuevo pase" onBack={back} />
      <div className="scroll" style={{ gap: 20, paddingTop: 4 }}>
        <div><span className="lbl" style={{ marginBottom: 12 }}>Tipo de pase</span><div className="chips">{['Visita', 'Delivery', 'Proveedor'].map(k => <button key={k} className={'chip' + (kind === k ? ' on' : '')} onClick={() => setKind(k)}>{k}</button>)}</div></div>
        <div><label className="lbl" htmlFor="nm" style={{ marginBottom: 8 }}>Nombre de la visita</label><input id="nm" className={'field' + (er.name ? ' bad' : '')} aria-invalid={!!er.name} aria-describedby="nm-h" placeholder="Ej: Pedro Rojas" value={name} onChange={e => { setName(e.target.value); setEr(x => ({ ...x, name: null })) }} /><Hint id="nm-h" err={er.name}>Como aparecerá en el pase</Hint></div>
        <div><label className="lbl" htmlFor="rut" style={{ marginBottom: 8 }}>RUT (opcional)</label><input id="rut" className={'field' + (er.rut ? ' bad' : '')} aria-invalid={!!er.rut} aria-describedby="rut-h" placeholder="Ej: 12.345.678-9" inputMode="text" value={rut} onChange={e => { setRut(e.target.value); setEr(x => ({ ...x, rut: null })) }} /><Hint id="rut-h" err={er.rut}>Solo si conserjería lo necesita</Hint></div>
        <div><span className="lbl" style={{ marginBottom: 12 }}>Duración</span><div className="chips">{['1 día', '1 semana', 'Elegir fecha'].map(k => <button key={k} className={'chip' + (dur === k ? ' on' : '')} onClick={() => setDur(k)}>{k}</button>)}</div></div>
        {dur === 'Elegir fecha' && <><Calendar value={date} onChange={d => { setDate(d); setEr(x => ({ ...x, date: null })) }} />{er.date && <p className="errtxt" role="alert"><CircleAlert size={14} />{er.date}</p>}</>}
      </div>
      <Foot><Btn onClick={create}>Crear pase</Btn></Foot></>)
}

function PaseCreado({ st, p, tab, toast }) {
  const x = st.passes.find(q => q.id === p.id)
  if (!x) return null
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px)', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 590 }}>Pase creado</h1>
        <p className="t-sm mut" style={{ margin: 0 }}>{x.name} · {x.kind} · Válido {x.long || 'hoy hasta las 23:59'}</p>
        <Qr seed={x.id + x.name} size={160} />
        <div style={{ width: '100%' }}><PinBox label="PIN de visita" pin={x.pin} /></div>
      </div>
      <Foot nb><Btn v="inv" onClick={() => toast('Pase enviado a ' + x.name)}>Compartir pase</Btn><Btn v="dark" onClick={() => tab('accesos')}>Listo</Btn></Foot></>)
}

function PaseRevocado({ st, p, tab, under }) {
  const x = st.passes.find(q => q.id === p.id)
  if (!x) return null
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 48px)', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 590 }}>Pase revocado</h1>
        <p className="t-sm mut" style={{ margin: 0 }}>El acceso de {x.name} fue anulado y avisamos a conserjería.</p>
        <Qr seed={x.id + x.name} size={160} dim bad />
        <div className="card s" style={{ width: '100%', padding: '12px 24px' }}><KV k="Pase" v={`${x.name} · ${x.kind}`} /><KV k="Revocado" v={'Hoy, ' + (x.revokedAt || hhmm())} /></div>
      </div>
      <Foot nb><Btn v="dark" onClick={() => under(['accesos'], 'nuevoPase')}>Crear otro pase</Btn><Btn v="inv" onClick={() => tab('accesos')}>Volver a Accesos</Btn></Foot></>)
}

function PaseDetalle({ st, up, p, back, replace, toast }) {
  const [ask, setAsk] = useState(!!p.ask)
  const x = st.passes.find(q => q.id === p.id)
  if (!x) return null
  const act = x.status === 'vigente'
  const revoke = () => { up(s => ({ passes: s.passes.map(q => (q.id === x.id ? { ...q, status: 'revocado', revokedAt: hhmm() } : q)) })); replace('paseRev', { id: x.id }) }
  const stColor = act ? 'var(--primary)' : STC[x.status]
  return (
    <>
      <Header title="Pase de visita" onBack={back} />
      <div className="scroll" style={{ paddingTop: 4 }}>
        <div className="card col" style={{ gap: 16, alignItems: 'stretch' }}>
          <div className="row" style={{ gap: 12 }}><span className="av" style={{ width: 48, height: 48 }}>{initials(x.name)}</span>
            <div className="col"><span className="t-base">{x.name}</span><Dot c={stColor} t={x.status} /></div></div>
          <div style={{ alignSelf: 'center' }}><Qr seed={x.id + x.name} size={140} dim={!act} /></div>
          <PinBox label="PIN de visita" pin={x.pin} />
        </div>
        <div className="card"><KV k="RUT" v={x.rut} /><KV k="Tipo" v={x.kind} /><KV k="Creado" v={x.created} /><KV k="Vence" v={x.valid || '—'} /></div>
      </div>
      <Foot><Btn v="dark" onClick={() => toast('Pase compartido')}>Compartir</Btn>{act && <Btn v="danger" onClick={() => setAsk(true)}>Revocar pase</Btn>}</Foot>
      {ask && <Sheet onClose={() => setAsk(false)}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 510 }}>¿Revocar el pase de {x.name}?</h2>
        <p className="t-xs mut" style={{ margin: '0 0 8px' }}>El QR y el PIN dejarán de funcionar de inmediato. Esta acción no se puede deshacer.</p>
        <Btn v="danger" onClick={revoke}>Sí, revocar</Btn><Btn v="dark" onClick={() => setAsk(false)}>Cancelar</Btn></Sheet>}
    </>)
}

/* ---------- Encomiendas ---------- */
function Encomiendas({ st, up, back, deep, toast }) {
  const [t, setT] = useState('p')
  const lp = st.pkgs.filter(p => p.status === 'porteria'), lr = st.pkgs.filter(p => p.status === 'retirado')
  const list = t === 'p' ? lp : lr
  const [ask, setAsk] = useState(null)
  const confirm = id => { up(s => ({ pkgs: s.pkgs.map(q => (q.id === id ? { ...q, status: 'retirado' } : q)) })); setAsk(null); toast('Retiro confirmado') }
  const del = id => up(s => ({ pkgs: s.pkgs.filter(q => q.id !== id) }))
  return (
    <>
      {deep ? <Header title="Encomiendas" onBack={back} /> : <TabHeader title="Encomiendas" />}
      <div className="scroll nav-pad" style={{ paddingTop: 12 }}>
        <Tabs items={[['p', 'En portería', lp.length], ['r', 'Retirados', lr.length]]} value={t} onChange={setT} />
        {list.length === 0 && <div className="card center col" style={{ gap: 8 }}><span className="t-base">{t === 'p' ? 'No tienes encomiendas en portería' : 'No hay encomiendas retiradas'}</span></div>}
        {list.map(p => (
          <div key={p.id} className="card col" style={{ gap: 12 }}>
            <div className="col" style={{ gap: 4 }}><div className="row" style={{ gap: 12 }}><Package size={22} /><span className="t-base" style={{ fontWeight: 400 }}>{p.from}</span></div><span className="t-xs mut">{p.info}</span></div>
            <PinBox label="PIN de retiro" pin={p.pin} />
            {t === 'p' ? <Btn v="inv" onClick={() => setAsk(p)}>Confirmar Retiro</Btn> : <Btn v="dark" onClick={() => del(p.id)}>Borrar de la lista</Btn>}
          </div>))}
      </div>
      {ask && <Sheet onClose={() => setAsk(null)}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 510 }}>¿Ya retiraste la encomienda de {ask.from}?</h2>
        <p className="t-xs mut" style={{ margin: '0 0 8px' }}>Confirma solo si ya tienes el paquete en tus manos. Pasará a Retirados.</p>
        <Btn onClick={() => confirm(ask.id)}>Sí, la retiré</Btn><Btn v="dark" onClick={() => setAsk(null)}>Todavía no</Btn></Sheet>}</>)
}

/* ---------- Finanzas ---------- */
const PayRow = ({ c, onClick }) => (
  <button className="row" onClick={onClick} style={{ gap: 12, background: 'var(--card-alt)', border: 0, borderRadius: 16, padding: 16, textAlign: 'left', width: '100%' }}>
    <Tile icon={Receipt} /><div className="col" style={{ flex: 1 }}><span className="t-base" style={{ fontSize: '1rem', fontWeight: 400 }}>{c.concept}</span><span className="t-xs mut">Pagado {c.short} · {c.m}</span></div><span className="t-base">{money(c.v)}</span>
  </button>)

function Finanzas({ st, go }) {
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  return (
    <>
      <TabHeader title="Finanzas" />
      <div className="scroll nav-pad" style={{ paddingTop: 12 }}>
        {total > 0 ? <>
          <div className="card col" style={{ gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-sm mut">Saldo de noviembre</span>{(st.sim && st.sim.vencido) ? <Dot c="#dc2626" t="Vencido" /> : <Dot c="#f59e0b" t="Por vencer" />}</div>
            <div style={{ fontSize: '2.25rem', lineHeight: '2.75rem', fontWeight: 590 }}>{money(total)}</div>
            <div className="row t-sm mut" style={{ gap: 8 }}><Cal size={16} />{(st.sim && st.sim.vencido) ? 'Venció el 10 de noviembre de 2026' : 'Vence el 10 de diciembre de 2026'}</div>
            {(st.sim && st.sim.vencido) && <div className="row t-xs" style={{ gap: 8, color: 'var(--err)', alignItems: 'flex-start' }}><TriangleAlert size={16} style={{ flexShrink: 0 }} />Tu pago está atrasado. Págalo hoy para evitar intereses por mora.</div>}
            <Btn onClick={() => go('confPago', { method: 'Tarjeta ····4821' })}>Pagar con tarjeta ····4821</Btn>
            <button className="lnk" style={{ height: 28 }} onClick={() => go('pagar')}>Usar otro método</button>
          </div>
          <div className="card col" style={{ gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-base" style={{ fontSize: '1rem' }}>Detalle del cobro</span><button className="lnk" onClick={() => go('detalleCobro')}>Ver todo</button></div>
            {st.bills.map(b => { const I = ICONS[b.i]; return <div key={b.k} className="row" style={{ gap: 12 }}><Tile icon={I} size={40} ico={18} /><div className="col" style={{ flex: 1 }}><span className="t-sm" style={{ fontWeight: 510 }}>{b.k}</span><span className="t-xs mut">{b.s}</span></div><span className="t-base">{money(b.v)}</span></div> })}
            <div className="hr" /><div className="row" style={{ justifyContent: 'space-between' }}><span className="t-base">Total a pagar</span><span className="t-base">{money(total)}</span></div>
          </div></> :
          <div className="card col" style={{ gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-sm mut">Estás al día</span><Dot c="#16a34a" t="Al día" /></div>
            <div style={{ fontSize: '2.25rem', lineHeight: '2.75rem', fontWeight: 590 }}>$0</div>
            <div className="row t-sm mut" style={{ gap: 8 }}><Cal size={16} />Próximo cobro: 10 de diciembre de 2026</div>
          </div>}
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: -12 }}><span className="sec" style={{ color: 'var(--content)' }}>Pagos anteriores</span><button className="lnk" onClick={() => go('historial')}>Ver historial</button></div>
        {st.paid.slice(0, total > 0 ? 2 : 3).map(c => <PayRow key={c.id} c={c} onClick={() => go('comp', { id: c.id })} />)}
      </div></>)
}

function DetalleCobro({ st, back, go }) {
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  const G = (title, g) => <div className="card col" style={{ gap: 14 }}><span className="t-base" style={{ fontSize: '1rem' }}>{title}</span>{st.bills.filter(b => b.g === g).map(b => { const I = ICONS[b.i]; return <div key={b.k} className="row" style={{ gap: 12 }}><Tile icon={I} size={36} ico={16} /><div className="col" style={{ flex: 1 }}><span className="t-sm">{b.k}</span><span className="t-xs mut">{b.l}</span></div><span className="t-sm" style={{ fontWeight: 510 }}>{money(b.v)}</span></div> })}</div>
  return (
    <>
      <Header title="Detalle del cobro" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 16 }}>
        <span className="t-xs mut">Noviembre 2026 · Torre A, Depto 1204</span>
        {G('Gastos del edificio', 0)}{G('Consumos individuales', 1)}
        <div className="card col" style={{ gap: 14 }}><span className="t-base" style={{ fontSize: '1rem' }}>Multas e intereses</span><div className="row" style={{ gap: 12 }}><Tile icon={CircleCheck} size={36} ico={16} /><div className="col" style={{ flex: 1 }}><span className="t-sm">Sin cargos este mes</span><span className="t-xs mut">Pagaste a tiempo</span></div><span className="t-sm" style={{ fontWeight: 510 }}>$0</span></div></div>
        <div className="card row" style={{ justifyContent: 'space-between' }}><span className="t-base">Total a pagar</span><span className="t-base">{money(total)}</span></div>
      </div>
      {total > 0 && <Foot><Btn onClick={() => go('pagar')}>Pagar {money(total)}</Btn></Foot>}</>)
}

function HistorialPagos({ st, back, go }) {
  const [f, setF] = useState('t')
  const list = st.paid.filter(c => f === 't' || (f === 'p' && !c.mora) || (f === 'm' && c.mora))
  return (
    <>
      <Header title="Historial de pagos" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 16 }}>
        <div className="chips">{[['t', 'Todos'], ['p', 'Pagados'], ['m', 'Con mora']].map(([k, l]) => <button key={k} className={'chip' + (f === k ? ' on' : '')} onClick={() => setF(k)}>{l}</button>)}</div>
        <span className="t-sm mut" style={{ marginBottom: -8 }}>2026</span>
        {list.map(c => <PayRow key={c.id} c={c} onClick={() => go('comp', { id: c.id })} />)}
      </div></>)
}

function Pagar({ st, back, go }) {
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  const [m, setM] = useState('card')
  if (!total) return <><Header title="Pagar" onBack={back} /><div className="scroll"><p className="t-sm mut">No tienes pagos pendientes.</p></div></>
  const opts = [['card', CreditCard, 'Tarjeta de crédito o débito', 'Pago inmediato con Webpay'], ['bank', Landmark, 'Transferencia bancaria', 'Desde tu banco, confirmación en minutos']]
  return (
    <>
      <Header title="Pagar" onBack={back} />
      <div className="scroll" style={{ paddingTop: 4, gap: 20 }}>
        <div className="col" style={{ gap: 4 }}><span className="t-xs mut">Total a pagar</span><span style={{ fontSize: '2.25rem', lineHeight: '2.75rem', fontWeight: 590 }}>{money(total)}</span><span className="t-xs mut">Gastos comunes · Noviembre 2026</span></div>
        <span className="t-sm" style={{ marginBottom: -8 }}>Elige cómo pagar</span>
        <div className="col" style={{ gap: 12 }}>
          {opts.map(([k, I, t, s]) => <button key={k} className={'opt' + (m === k ? ' on' : '')} onClick={() => setM(k)}><Tile icon={I} size={44} ico={20} /><span className="col" style={{ flex: 1, gap: 2 }}><span className="t-base" style={{ fontWeight: 400 }}>{t}</span><span className="t-xs mut">{s}</span></span><span className={'radio' + (m === k ? ' on' : '')} /></button>)}
        </div>
        <div className="row t-xs mut" style={{ gap: 8 }}><Lock size={16} />Pago seguro. No guardamos los datos de tu tarjeta. Revisarás el resumen antes de pagar.</div>
      </div>
      <Foot><Btn onClick={() => go('confPago', { method: m === 'card' ? 'Tarjeta ····4821' : 'Transferencia' })}>Continuar</Btn></Foot></>)
}

function ConfPago({ st, p, back, replace }) {
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  const card = p.method.startsWith('Tarjeta')
  return (
    <>
      <Header title="Confirmar pago" onBack={back} />
      <div className="scroll" style={{ paddingTop: 4, gap: 16 }}>
        <div className="card col" style={{ gap: 4 }}><span className="t-base" style={{ fontSize: '1rem', fontWeight: 400, marginBottom: 8 }}>Resumen</span>
          <KV k="Gastos comunes noviembre" v={money(total)} /><KV k="Método de pago" v={p.method} /><KV k="Comisión" v="$0" /><div className="hr" /><div className="kv"><b>Total a pagar</b><b>{money(total)}</b></div></div>
        <div className="row t-xs mut" style={{ gap: 8 }}><Lock size={16} />{card ? 'El monto se cargará de inmediato a tu tarjeta.' : 'Recibirás los datos de la transferencia a continuación.'}</div>
      </div>
      <Foot><Btn v="dark" onClick={back}>Cambiar método</Btn><Btn onClick={() => replace('proc', { method: p.method })}>Pagar {money(total)}</Btn></Foot></>)
}

function Procesando({ st, up, p, replace }) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (st.sim && st.sim.fail) { up(s => ({ sim: { ...s.sim, fail: false } })); replace('pagoFail', { method: p.method }); return }
      const id = 'c' + Date.now(), total = st.bills.reduce((a, b) => a + b.v, 0), d = TODAY
      const mm = MESES[d.getMonth()].slice(0, 3)
      up(s => ({ bills: [], paid: [{ id, concept: 'Noviembre 2026', v: total, date: `${d.getDate()} ${mm} ${d.getFullYear()}, ${hhmm()}`, short: `${d.getDate()} ${mm}`, method: p.method, m: p.method.split(' ')[0], ref: 'SRN-001482' }, ...s.paid] }))
      replace('pagoOk', { id })
    }, 1800)
    return () => clearTimeout(t)
  }, [])
  return <div className="scroll center" role="status" aria-live="polite" style={{ justifyContent: 'center', gap: 16 }}><div className="spin" aria-hidden="true" style={{ width: 48, height: 48 }} /><div className="t-lg" style={{ marginTop: 8 }}>Procesando tu pago</div><div className="t-xs mut">No cierres la app. Esto toma unos segundos.</div></div>
}

function PagoOk({ st, p, tab, toast }) {
  const c = st.paid.find(x => x.id === p.id)
  if (!c) return null
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 48px)', gap: 12 }}>
        <Success /><h1 style={{ margin: '12px 0 0', fontSize: '1.375rem', fontWeight: 590 }}>Pago realizado</h1>
        <div style={{ fontSize: '2.25rem', lineHeight: '2.75rem', fontWeight: 590 }}>{money(c.v)}</div>
        <p className="t-xs mut" style={{ margin: 0 }}>Gastos comunes de noviembre 2026</p>
        <div className="card s" style={{ width: '100%', padding: '12px 24px', marginTop: 8 }}><KV k="N° de comprobante" v={c.ref} /><KV k="Fecha" v={c.date} /><KV k="Método" v={c.method} /></div>
      </div>
      <Foot nb><Btn v="inv" onClick={() => toast('Comprobante descargado')}>Descargar comprobante</Btn><Btn v="dark" onClick={() => tab('fin')}>Volver a Finanzas</Btn></Foot></>)
}

function Comprobante({ st, p, back, toast }) {
  const c = st.paid.find(x => x.id === p.id)
  if (!c) return null
  const g = Math.round(c.v * 0.7578 / 50) * 50
  return (
    <>
      <Header title="Comprobante" onBack={back} />
      <div className="scroll" style={{ paddingTop: 4, gap: 16 }}>
        <div className="card center col" style={{ gap: 8 }}><span className="tile" style={{ width: 40, height: 40, background: 'var(--success)' }}><Check size={22} /></span><span className="t-sm mut">Pago aprobado</span><span style={{ fontSize: '2.25rem', lineHeight: '2.75rem', fontWeight: 590 }}>{money(c.v)}</span></div>
        <div className="card"><KV k="N° de comprobante" v={c.ref} /><KV k="Fecha" v={c.date} /><KV k="Método" v={c.method} /><KV k="Departamento" v="Torre A · 1204" /></div>
        <div className="card"><KV k="Gasto común y fondo" v={money(g)} /><KV k="Agua y gas" v={money(c.v - g)} /><div className="hr" /><div className="kv" style={{ fontSize: '1rem' }}><b>Total pagado</b><b>{money(c.v)}</b></div></div>
      </div>
      <Foot><Btn v="dark" onClick={() => toast('Comprobante compartido')}>Compartir</Btn><Btn v="inv" onClick={() => toast('PDF descargado')}>Descargar PDF</Btn></Foot></>)
}

/* ---------- Servicios ---------- */
function Servicios({ st, go, p }) {
  const [t, setT] = useState(p.tab || 'res')
  const next = st.reservas.slice().sort((a, b) => dt(a.date) - dt(b.date))[0]
  const spaces = [[Utensils, 'Quincho', 'Hasta 20 personas · 09:00 a 23:00'], [Users, 'Sala multiuso', 'Hasta 30 personas · 09:00 a 22:00']]
  const SC = ['#f59e0b', 'var(--primary)', '#16a34a']
  return (
    <>
      <TabHeader title="Servicios" />
      <div className="scroll nav-pad" style={{ paddingTop: 12 }}>
        <Tabs items={[['res', 'Reservas'], ['sol', 'Solicitudes']]} value={t} onChange={setT} />
        {t === 'res' ? <>
          {next && <div className="col" style={{ gap: 12 }}><p className="sec">Mi próxima reserva</p>
            <div className="sum alert"><Tile icon={Cal} pri /><span className="b"><span className="t-xs mut">{next.space}</span><span className="t-base" style={{ fontSize: '1.125rem' }}>{dShort(dt(next.date))}</span><span className="t-xs mut">{next.from} – {next.to} · Gratis</span></span><ChevronRight size={16} color="var(--content-muted)" /></div></div>}
          <div className="col" style={{ gap: 12 }}><p className="sec">Reservar un espacio</p>
            {spaces.map(([I, n, s]) => (
              <button key={n} onClick={() => go('reservar')} style={{ background: 'var(--muted)', border: 0, borderRadius: 24, overflow: 'hidden', textAlign: 'left', padding: 0, width: '100%' }}>
                <div style={{ height: 112, background: 'var(--elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I size={44} strokeWidth={1.4} /></div>
                <div className="col" style={{ padding: 16, gap: 8 }}><div className="row" style={{ justifyContent: 'space-between' }}><span className="t-base" style={{ fontSize: '1rem', fontWeight: 400 }}>{n}</span><Dot c="#16a34a" t="Disponible" /></div><span className="t-xs mut">{s}</span></div>
              </button>))}
          </div></> :
          <div className="col" style={{ gap: 12 }}>
            <p className="sec">Mis solicitudes</p>
            {st.reqs.map(r => { const I = CATICON[r.cat] || Wrench; return (
              <button key={r.id} onClick={() => go('sol', { id: r.id })} className="card s col" style={{ gap: 12, border: 0, textAlign: 'left', width: '100%' }}>
                <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}><Tile icon={I} size={40} ico={18} /><div className="col" style={{ flex: 1 }}><span className="t-base" style={{ fontWeight: 400 }}>{r.title}</span><span className="t-xs mut">N° {r.ref} · {r.created}</span></div><Dot c={SC[r.status]} t={['Recibida', 'En revisión', 'Resuelta'][r.status]} /></div>
                <span className="t-xs mut">{r.desc}</span>
              </button>) })}
          </div>}
      </div>
      {t === 'sol' && <button className="fab" onClick={() => go('solCat')}><Plus size={20} /> Nueva solicitud</button>}
    </>)
}

function occ(date, name, st) {
  if (st.reservas.some(r => key(dt(r.date)) === key(date) && r.block === name)) return 'Reservado'
  const d = date.getDate()
  if (name === 'Noche' && (d % 3 === 0 || d === 21)) return 'Ocupado'
  if (name === 'Mañana' && d === 25) return 'Ocupado'
  return null
}
function Reservar({ st, back, go }) {
  const days = Array.from({ length: 28 }, (_, i) => new Date(TODAY.getTime() + i * 864e5))
  const [date, setDate] = useState(new Date(2026, 10, 22))
  const [block, setBlock] = useState(null)
  const strip = React.useRef(null)
  const [pg, setPg] = useState(0)
  const move = d => { const el = strip.current; if (el) el.scrollBy({ left: d * el.clientWidth + d * 8, behavior: 'smooth' }) }
  return (
    <>
      <Header title="Reservar quincho" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 16 }}>
        <div className="row t-xs mut" style={{ gap: 8 }}><Users size={16} />Hasta 20 personas · 09:00 a 23:00 · Gratis</div>
        <div className="row t-xs mut" style={{ gap: 8 }}><CircleHelp size={16} />Toca un día y luego un bloque libre. Podrás revisar antes de confirmar.</div>
        <div className="row" style={{ justifyContent: 'space-between' }}><span style={{ fontSize: '1rem', fontWeight: 510 }}>{cap(MESES[date.getMonth()])} {date.getFullYear()}</span>
          <span className="row" style={{ gap: 8 }}><button className="wk" aria-label="Semana anterior" disabled={pg === 0} onClick={() => move(-1)}><ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /></button><button className="wk" aria-label="Semana siguiente" disabled={pg >= 3} onClick={() => move(1)}><ChevronRight size={18} /></button></span></div>
        <div className="days" ref={strip} onScroll={e => setPg(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth + 8)))} role="listbox" aria-label="Elige un día">{days.map(d => <button key={key(d)} role="option" aria-selected={key(d) === key(date)} disabled={d < TODAY} className={'day' + (key(d) === key(date) ? ' on' : '')} onClick={() => { setDate(d); setBlock(null) }}><span>{cap(DIAS[d.getDay()].slice(0, 3))}</span><b>{d.getDate()}</b></button>)}</div>
        <span className="t-sm mut">Elige un bloque</span>
        <div className="col" style={{ gap: 12, marginTop: -4 }}>
          {BLOCKS.map(([n, a, b]) => { const o = occ(date, n, st); return (
            <button key={n} disabled={!!o} className={'opt' + (block === n ? ' on' : '')} onClick={() => setBlock(n)}>
              <span className="col" style={{ flex: 1, gap: 2 }}><span className="t-base" style={{ fontWeight: 400 }}>{n}</span><span className="t-xs mut">{a} – {b}</span></span>
              {o ? <span className="t-sm mut">{o}</span> : <span className={'radio' + (block === n ? ' on' : '')} />}
            </button>) })}
        </div>
      </div>
      <Foot><Btn disabled={!block} onClick={() => go('confReserva', { date: date.toISOString(), block })}>Continuar</Btn></Foot></>)
}

function ConfReserva({ p, up, back, replace }) {
  const d = dt(p.date), b = BLOCKS.find(x => x[0] === p.block)
  const confirm = () => {
    const id = 'r' + Date.now(), ref = 'RSV-' + String(Math.floor(Math.random() * 9000) + 1000)
    up(s => ({ reservas: [...s.reservas, { id, space: 'Quincho', date: p.date, block: p.block, from: b[1], to: b[2], ref }] }))
    replace('reservaOk', { id })
  }
  return (
    <>
      <Header title="Confirmar reserva" onBack={back} />
      <div className="scroll" style={{ paddingTop: 4, gap: 16 }}>
        <div className="card col" style={{ gap: 4 }}><span className="t-base" style={{ fontSize: '1.125rem', fontWeight: 400, marginBottom: 8 }}>Resumen</span>
          <KV k="Espacio" v="Quincho" /><KV k="Fecha" v={`${dShort(d)} ${d.getFullYear()}`} /><KV k="Horario" v={`${b[1]} – ${b[2]}`} /><KV k="Departamento" v="Torre A · 1204" /><KV k="Costo" v="Gratis" /></div>
        <div className="row t-xs mut" style={{ gap: 8 }}><Info size={16} />Puedes cancelar hasta 24 horas antes, sin costo.</div>
      </div>
      <Foot><Btn v="dark" onClick={back}>Cambiar horario</Btn><Btn onClick={confirm}>Confirmar reserva</Btn></Foot></>)
}

function ReservaOk({ st, p, tab }) {
  const r = st.reservas.find(x => x.id === p.id)
  if (!r) return null
  const d = dt(r.date), c = new Date(d.getTime() - 864e5)
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px)', gap: 16 }}>
        <Success /><h1 style={{ margin: '8px 0 0', fontSize: '1.375rem', fontWeight: 590 }}>Reserva confirmada</h1>
        <p className="t-sm mut" style={{ margin: 0 }}>Quincho · {dShort(d)} · {r.from} – {r.to}</p>
        <div className="card s" style={{ width: '100%', padding: '12px 24px' }}><KV k="N° de reserva" v={r.ref} /><KV k="Costo" v="Gratis" /><KV k="Cancelación" v={`Hasta el ${DIAS[c.getDay()].slice(0, 3)} ${c.getDate()} ${MESES[c.getMonth()].slice(0, 3)}, ${r.from}`} /></div>
      </div>
      <Foot nb><Btn v="inv" onClick={() => tab('serv')}>Ver mis reservas</Btn><Btn v="dark" onClick={() => tab('home')}>Volver al inicio</Btn></Foot></>)
}

/* ---------- Solicitudes ---------- */
const CATS = [[Wrench, 'Mantención de áreas comunes'], [House, 'Problema en mi departamento'], [MessageCircle, 'Convivencia o ruidos'], [CircleHelp, 'Consulta o sugerencia']]
function SolCat({ back, go }) {
  return (
    <>
      <Header title="Nueva solicitud" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 16 }}>
        <span className="t-base" style={{ fontSize: '1.125rem', fontWeight: 510 }}>¿Qué necesitas?</span>
        {CATS.map(([I, c]) => <button key={c} className="sum" style={{ padding: '16px', minHeight: 72 }} onClick={() => go('solForm', { cat: c })}><Tile icon={I} size={40} ico={20} /><span className="t-sm" style={{ flex: 1, fontSize: '1rem', lineHeight: '1.5rem' }}>{c}</span><ChevronRight size={16} color="var(--content-muted)" /></button>)}
      </div></>)
}
function SolForm({ p, up, back, replace }) {
  const [sub, setSub] = useState('')
  const [desc, setDesc] = useState('')
  const [foto, setFoto] = useState(false)
  const [er, setEr] = useState({})
  const send = () => {
    const e = {}
    if (sub.trim().length < 3) e.sub = 'Escribe un asunto de al menos 3 letras'
    if (desc.trim().length < 10) e.desc = 'Cuéntanos un poco más (mínimo 10 letras)'
    setEr(e)
    if (Object.keys(e).length) { setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 60); return }
    const id = 's' + Date.now()
    const ref = String(236 + (Date.now() % 1000) % 50).padStart(4, '0')
    up(s => ({ reqs: [{ id, cat: p.cat, title: sub.trim(), desc: desc.trim() || 'Sin descripción.', status: 0, created: 'Hoy', ref, log: ['Hoy, ' + hhmm()] }, ...s.reqs] }))
    replace('solOk', { id })
  }
  return (
    <>
      <Header title="Nueva solicitud" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 20 }}>
        <span className="chip on" style={{ alignSelf: 'flex-start' }}>{p.cat}</span>
        <div><label className="lbl" htmlFor="as" style={{ marginBottom: 8 }}>Asunto</label><input id="as" className={'field' + (er.sub ? ' bad' : '')} aria-invalid={!!er.sub} aria-describedby="as-h" placeholder="Ej: Luz quemada en pasillo piso 12" value={sub} onChange={e => { setSub(e.target.value); setEr(x => ({ ...x, sub: null })) }} /><Hint id="as-h" err={er.sub}>Resume el problema en una frase</Hint></div>
        <div><label className="lbl" htmlFor="ds" style={{ marginBottom: 8 }}>Descripción</label><textarea id="ds" className={'field' + (er.desc ? ' bad' : '')} aria-invalid={!!er.desc} aria-describedby="ds-h" rows={4} placeholder="¿Qué pasó y dónde?" value={desc} onChange={e => { setDesc(e.target.value); setEr(x => ({ ...x, desc: null })) }} style={{ resize: 'none' }} /><Hint id="ds-h" err={er.desc}>Cuéntanos qué pasó y dónde.</Hint></div>
        <button onClick={() => setFoto(!foto)} className="row" style={{ justifyContent: 'center', gap: 12, height: 88, border: '1px dashed var(--border-strong)', borderRadius: 16, background: 'none', fontSize: '0.875rem' }}><Camera size={20} />{foto ? 'Foto agregada ✓' : 'Agregar foto (opcional)'}</button>
      </div>
      <Foot><Btn onClick={send}>Enviar solicitud</Btn></Foot></>)
}
function SolOk({ st, p, tab, under }) {
  const r = st.reqs.find(x => x.id === p.id)
  if (!r) return null
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 48px)', gap: 12 }}>
        <Success /><h1 style={{ margin: '12px 0 0', fontSize: '1.375rem', fontWeight: 590 }}>Solicitud enviada</h1>
        <p className="t-xs mut" style={{ margin: 0 }}>Te avisaremos cuando cambie su estado.</p>
        <div className="card s" style={{ width: '100%', padding: '12px 24px', marginTop: 8 }}><KV k="N° de solicitud" v={r.ref} /><KV k="Categoría" v={SHORT[r.cat]} /><KV k="Estado" v="Recibida" /><KV k="Respuesta estimada" v="En 48 horas" /></div>
      </div>
      <Foot nb><Btn v="inv" onClick={() => under(['serv', { tab: 'sol' }], 'sol', { id: r.id, fresh: true })}>Ver mi solicitud</Btn><Btn v="dark" onClick={() => tab('serv', { tab: 'sol' })}>Volver a Servicios</Btn></Foot></>)
}
function SolDetalle({ st, up, p, back, tab, go }) {
  const r = st.reqs.find(x => x.id === p.id)
  if (!r) return null
  const I = CATICON[r.cat] || Wrench, SC = ['#f59e0b', 'var(--primary)', '#16a34a']
  const stepName = ['Recibida', 'En revisión', 'Resuelta']
  return (
    <>
      <Header title={`Solicitud ${r.ref}`} onBack={p.fresh ? () => tab('serv', { tab: 'sol' }) : back} />
      <div className="scroll" style={{ paddingTop: 4, gap: 16 }}>
        <div className="card s col" style={{ gap: 12 }}>
          <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}><Tile icon={I} size={40} ico={18} /><div className="col" style={{ flex: 1 }}><span className="t-base" style={{ fontWeight: 400 }}>{r.title}</span><span className="t-xs mut">N° {r.ref} · {r.created}</span></div><Dot c={SC[r.status]} t={stepName[r.status]} /></div>
          <span className="t-xs mut">{r.desc}</span></div>
        <div className="card"><span className="t-base" style={{ display: 'block', marginBottom: 16, fontWeight: 400 }}>Seguimiento</span>
          <div className="tl">{stepName.map((s, i) => <div key={s} className={'it ' + (i < r.status || (i === 2 && r.status === 2) ? 'done' : i === r.status ? 'cur' : '')}><b />
            <div className="t-sm" style={{ fontWeight: 510, color: i > r.status ? 'var(--content-muted)' : undefined }}>{s}</div>
            <div className="t-xs mut">{(r.log || [])[i] || 'Pendiente'}</div></div>)}</div></div>
        {r.status < 2 && <button className="lnk" style={{ color: 'var(--content-subtle)', fontWeight: 400 }} onClick={() => up(s => ({ reqs: s.reqs.map(q => (q.id === r.id ? { ...q, status: q.status + 1, log: [...(q.log || []), 'Hoy, ' + hhmm()] } : q)) }))}>Demo: avanzar estado (moderador)</button>}
      </div>
      <Foot><Btn v="dark" onClick={() => go('correo', { id: r.id })}><Mail size={18} />Contactar con administrador</Btn></Foot></>)
}

/* ---------- Avisos / Perfil ---------- */
function Avisos({ st, back, go }) {
  const [t, setT] = useState('t')
  const mans = st.notices.filter(n => n.kind === 'man'), avs = st.notices.filter(n => n.kind !== 'man')
  const urg = avs.find(n => n.kind === 'urg')
  return (
    <>
      <div className="hdr in"><button className="back" aria-label="Atrás" onClick={back}><ArrowUpLeft size={22} /></button><h1>Avisos</h1><button className="tile" aria-label="Ajustes de notificaciones" onClick={() => go('ajustes')} style={{ width: 40, height: 40, border: 0, background: 'var(--muted)' }}><Settings size={20} /></button></div>
      <div className="scroll nav-pad" style={{ paddingTop: 4, gap: 16 }}>
        <Tabs items={[['t', 'Todos', '03'], ['m', 'Mantención', '2']]} value={t} onChange={setT} />
        {t === 't' ? <>
          {avs.map(n => <Notice key={n.id} n={n} />)}
          <p className="sec" style={{ marginBottom: -4 }}>Mantenciones</p>
          {mans.map(n => <ManCard key={n.id} n={n} />)}</> : <>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: -4 }}><p className="sec">Mantenciones</p><span className="t-xs mut">29 De Octubre</span></div>
          {urg && <Notice n={{ ...urg, date: null }} />}
          {mans.filter(n => n.badge === 'Finalizada').map(n => <ManCard key={n.id} n={n} />)}</>}
      </div></>)
}
function Ajustes({ st, up, back }) {
  const rows = [['pases', 'Pases y visitas', 'Cuando llega o sale una visita'], ['paq', 'Encomiendas', 'Cuando llega un paquete'], ['fin', 'Gastos comunes', 'Vencimientos y comprobantes']]
  return (
    <>
      <Header title="Notificaciones" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0 }}>
        <div className="card s" style={{ padding: '0 16px' }}>{rows.map(([k, l, s], i) => <div key={k} className="row" style={{ minHeight: 68, gap: 12, borderTop: i ? '1px solid var(--border)' : 0 }}><div className="col" style={{ flex: 1 }}><span className="t-base" style={{ fontWeight: 400 }}>{l}</span><span className="t-xs mut">{s}</span></div><Switch label={l} on={st.sw[k]} onChange={() => up(s => ({ sw: { ...s.sw, [k]: !s.sw[k] } }))} /></div>)}</div>
      </div></>)
}
function Perfil({ st, up, back, go, reset, toast }) {
  const [taps, setTaps] = useState(0)
  const mod = taps >= 5
  const [ask, setAsk] = useState(false)
  const pick = e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ''
    if (!f) return
    const img = new Image(), url = URL.createObjectURL(f)
    img.onload = () => {
      const S = 256, c = document.createElement('canvas'); c.width = c.height = S
      const m = Math.min(img.width, img.height), sx = (img.width - m) / 2, sy = (img.height - m) / 2
      c.getContext('2d').drawImage(img, sx, sy, m, m, 0, 0, S, S)
      URL.revokeObjectURL(url)
      up(() => ({ photo: c.toDataURL('image/jpeg', 0.85) })); setAsk(false); toast('Foto actualizada')
    }
    img.src = url
  }
  const R = ({ icon, t, onClick, last }) => <button onClick={onClick} className="row" style={{ gap: 12, background: 'none', border: 0, borderTop: last === 0 ? 0 : '1px solid var(--border)', padding: '0 4px', minHeight: 60, width: '100%', textAlign: 'left' }}><Tile icon={icon} size={36} ico={18} /><span className="t-base" style={{ flex: 1, fontWeight: 400 }}>{t}</span><ChevronRight size={18} color="var(--content-muted)" /></button>
  const sim = k => () => up(s => ({ sim: { ...(s.sim || {}), [k]: !(s.sim && s.sim[k]) } }))
  return (
    <>
      <Header title="Perfil" onBack={back} />
      <div className="scroll" style={{ paddingTop: 8, gap: 24 }}>
        <div className="row" style={{ gap: 16, padding: '0 4px' }}>
          <button aria-label="Cambiar foto de perfil" onClick={() => setAsk(true)} style={{ position: 'relative', width: 72, height: 72, background: 'none', border: 0, flex: 'none' }}>
            <span className="av" style={{ width: 72, height: 72, overflow: 'hidden', fontSize: '1.125rem' }}>{st.photo ? <img src={st.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'RD'}</span>
            <span style={{ position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: 14, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)' }}><Camera size={14} /></span>
          </button>
          <div className="col" style={{ gap: 2 }}><span className="t-lg">Residente Demo</span><span className="t-sm mut">Torre A · Depto 1204</span><button className="lnk" style={{ alignSelf: 'flex-start', minHeight: 28, textAlign: 'left' }} onClick={() => setAsk(true)}>Editar foto</button></div>
        </div>
        <div className="card" style={{ padding: '0 12px' }}>
          <R last={0} icon={UserRound} t="Mis datos" onClick={() => go('datos')} />
          <R icon={Bell} t="Notificaciones" onClick={() => go('ajustes')} />
          <R icon={Accessibility} t="Apariencia y accesibilidad" onClick={() => go('a11y')} />
          <R icon={Info} t="Ayuda" onClick={() => go('ayuda')} />
        </div>
        <button className="lnk" style={{ alignSelf: 'center', color: 'var(--err)', minHeight: 44 }} onClick={reset}>Cerrar sesión</button>
        <button className="t-xs sub" style={{ background: 'none', border: 0, alignSelf: 'center', minHeight: 44 }} onClick={() => setTaps(t => t + 1)}>Komón APP · Prototipo v1.0</button>
        {mod && <div className="card col" style={{ gap: 4, padding: '12px 16px' }}>
          <span className="t-xs sub row" style={{ gap: 6 }}><FlaskConical size={14} />Modo moderador</span>
          <div className="row" style={{ minHeight: 52, gap: 12 }}><span className="t-sm" style={{ flex: 1 }}>El próximo pago falla</span><Switch label="El próximo pago falla" on={!!(st.sim && st.sim.fail)} onChange={sim('fail')} /></div>
          <div className="row" style={{ minHeight: 52, gap: 12, borderTop: '1px solid var(--border)' }}><span className="t-sm" style={{ flex: 1 }}>Gasto común vencido</span><Switch label="Gasto común vencido" on={!!(st.sim && st.sim.vencido)} onChange={sim('vencido')} /></div>
          <span className="t-xs sub">«Cerrar sesión» reinicia la demo para el siguiente participante.</span>
        </div>}
      </div>
      {ask && <Sheet onClose={() => setAsk(false)}>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 510 }}>Foto de perfil</h2>
        <input id="cam" type="file" accept="image/*" capture="user" hidden onChange={pick} />
        <input id="gal" type="file" accept="image/*" hidden onChange={pick} />
        <label htmlFor="cam" className="btn inv" role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && document.getElementById('cam').click()}><Camera size={18} />Tomar foto</label>
        <label htmlFor="gal" className="btn dark" role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && document.getElementById('gal').click()}><ImageIcon size={18} />Elegir de la galería</label>
        {st.photo && <Btn v="dark" onClick={() => { up(() => ({ photo: null })); setAsk(false); toast('Foto eliminada') }}><Trash2 size={18} />Quitar foto</Btn>}
        <button className="lnk" style={{ minHeight: 44 }} onClick={() => setAsk(false)}>Cancelar</button>
      </Sheet>}
    </>)
}

function Accesib({ st, up, back }) {
  const A = { size: 'n', contrast: 'normal', motion: 'normal', theme: 'oscuro', ...(st.a11y || {}) }
  const set = o => up(s => ({ a11y: { ...(s.a11y || {}), ...o } }))
  const sizes = [['n', 'Normal', 16], ['l', 'Grande', 18], ['xl', 'Muy grande', 20]]
  return (
    <>
      <Header title="Apariencia" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 20 }}>
        <div role="radiogroup" aria-label="Tema" className="col" style={{ gap: 12 }}>
          <span className="t-sm mut">Tema</span>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {[['oscuro', 'Oscuro'], ['claro', 'Claro'], ['auto', 'Automático']].map(([k, l]) => <button key={k} role="radio" aria-checked={A.theme === k} className={A.theme === k ? 'on' : ''} style={{ flex: 1 }} onClick={() => set({ theme: k })}>{l}</button>)}
          </div>
          <span className="t-xs mut">Automático sigue la configuración de tu teléfono.</span>
        </div>
        <div role="radiogroup" aria-label="Tamaño del texto" className="col" style={{ gap: 12 }}>
          <span className="t-sm mut">Tamaño del texto</span>
          {sizes.map(([k, l, px]) => (
            <button key={k} role="radio" aria-checked={A.size === k} className={'opt' + (A.size === k ? ' on' : '')} onClick={() => set({ size: k })}>
              <span style={{ fontSize: px / 16 + 'rem', width: 44, textAlign: 'center', fontWeight: 510 }}>Aa</span>
              <span className="t-base" style={{ flex: 1, fontWeight: 400 }}>{l}</span><span className={'radio' + (A.size === k ? ' on' : '')} />
            </button>))}
        </div>
        <div className="card s" style={{ padding: '0 16px' }}>
          <div className="row" style={{ minHeight: 68, gap: 12 }}><div className="col" style={{ flex: 1 }}><span className="t-base" style={{ fontWeight: 400 }}>Alto contraste</span><span className="t-xs mut">Textos y bordes más marcados</span></div><Switch label="Alto contraste" on={A.contrast === 'alto'} onChange={() => set({ contrast: A.contrast === 'alto' ? 'normal' : 'alto' })} /></div>
          <div className="row" style={{ minHeight: 68, gap: 12, borderTop: '1px solid var(--border)' }}><div className="col" style={{ flex: 1 }}><span className="t-base" style={{ fontWeight: 400 }}>Reducir movimiento</span><span className="t-xs mut">Menos animaciones</span></div><Switch label="Reducir movimiento" on={A.motion === 'reducir'} onChange={() => set({ motion: A.motion === 'reducir' ? 'normal' : 'reducir' })} /></div>
        </div>
        <p className="t-xs mut" style={{ margin: 0 }}>También respetamos la configuración de tu teléfono.</p>
      </div></>)
}

function FilledIcon({ k }) {
  const bg = 'var(--muted)'
  const P = {
    home: <><path d="M12 2.6 3.6 9.4a1.5 1.5 0 0 0-.6 1.2V20a1.5 1.5 0 0 0 1.5 1.5H9V15.5h6v6h4.5A1.5 1.5 0 0 0 21 20v-9.4a1.5 1.5 0 0 0-.6-1.2Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /></>,
    accesos: <><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /><rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor" /><rect x="13" y="7" width="4" height="4" rx="1" fill="currentColor" /><rect x="7" y="13" width="4" height="4" rx="1" fill="currentColor" /><rect x="13" y="13" width="4" height="4" rx="1" fill="currentColor" /></>,
    enc: <><path d="M12 2.4 3.9 6.7a1.5 1.5 0 0 0-.8 1.3v8.1a1.5 1.5 0 0 0 .8 1.3l8.1 4.4a1.5 1.5 0 0 0 1.4 0l7.8-4.3a1.5 1.5 0 0 0 .8-1.3V8a1.5 1.5 0 0 0-.8-1.3L13.4 2.4a1.5 1.5 0 0 0-1.4 0Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /><path d="M3.4 7.2 12 12l8.6-4.8M12 12v9.6" fill="none" stroke={bg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></>,
    fin: <><path d="M5.5 3.5H17a1.5 1.5 0 0 1 0 3H5.5a1 1 0 0 1 0-3Z" fill="currentColor" /><rect x="2.5" y="6" width="19" height="15" rx="3" fill="currentColor" /><circle cx="16.8" cy="13.5" r="1.6" fill={bg} /></>,
    serv: <><rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" /><rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" /><rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" /><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" /></>,
  }
  return <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">{P[k]}</svg>
}

function Hint({ id, err, children }) {
  return err ? <p id={id} className="errtxt" role="alert"><CircleAlert size={14} />{err}</p> : <p id={id} className="help">{children}</p>
}

function PagoFallido({ st, p, go, replace, tab, back }) {
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 48px)', gap: 12 }}>
        <div className="ok" style={{ width: 96, height: 96, background: 'var(--danger)' }}><CircleX size={48} strokeWidth={1.6} color="#fff" /></div>
        <h1 style={{ margin: '12px 0 0', fontSize: '1.375rem', fontWeight: 590 }}>No pudimos procesar tu pago</h1>
        <p className="t-sm mut" style={{ margin: 0, maxWidth: 300 }}>Tu banco rechazó la operación. No se hizo ningún cargo a tu {p.method.startsWith('Tarjeta') ? 'tarjeta' : 'cuenta'}.</p>
        <div className="card s" style={{ width: '100%', padding: '12px 24px', marginTop: 8 }}><KV k="Método" v={p.method} /><KV k="Motivo" v="Rechazado por el emisor" /></div>
      </div>
      <Foot nb><Btn onClick={() => replace('confPago', { method: p.method })}>Reintentar pago</Btn><Btn v="dark" onClick={back}>Usar otro método</Btn><button className="lnk" style={{ height: 28 }} onClick={() => tab('fin')}>Volver a Finanzas</button></Foot></>)
}

function Datos({ back }) {
  const rows = [['Nombre', 'Residente Demo'], ['RUT', '12.345.678-9'], ['Correo', 'residente@komon.cl'], ['Teléfono', '+56 9 1234 5678'], ['Edificio', 'Torre A'], ['Departamento', '1204'], ['Estacionamiento', 'E-45']]
  return (
    <>
      <Header title="Mis datos" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 16 }}>
        <div className="card">{rows.map(([k, v]) => <KV key={k} k={k} v={v} />)}</div>
        <p className="t-xs mut" style={{ margin: 0 }}>Para cambiar tus datos, contacta a la administración.</p>
      </div></>)
}

function Ayuda({ back, go }) {
  const C = ({ icon, t, s, onClick }) => <div className="card row" style={{ gap: 12, cursor: onClick ? 'pointer' : undefined }} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}><Tile icon={icon} size={40} ico={18} /><div className="col" style={{ flex: 1 }}><span className="t-sm" style={{ fontWeight: 510 }}>{t}</span><span className="t-xs mut">{s}</span></div></div>
  const F = [['¿Cómo creo un pase de visita?', 'En Accesos, toca "Nuevo pase", completa el nombre y elige la duración.'], ['¿Cómo pago los gastos comunes?', 'En Finanzas, toca "Pagar". Puedes usar tarjeta o transferencia.'], ['¿Cuándo llega mi encomienda?', 'Te avisamos en Encomiendas cuando llegue a portería, con tu PIN de retiro.']]
  return (
    <>
      <Header title="Ayuda" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 12 }}>
        <C icon={Phone} t="Conserjería" s="+56 2 2345 6789 · 24 horas" />
        <C icon={Mail} t="Escribir a administración" s="admin@komon.cl · Lun a Vie, 9:00 a 18:00" onClick={() => go('correo', {})} />
        <span className="sec" style={{ marginTop: 8 }}>Preguntas frecuentes</span>
        {F.map(([q, r]) => <div key={q} className="card col" style={{ gap: 4 }}><span className="t-sm" style={{ fontWeight: 510 }}>{q}</span><span className="t-xs mut">{r}</span></div>)}
      </div></>)
}

function Correo({ st, p, back, replace }) {
  const r = p.id && st.reqs.find(x => x.id === p.id)
  const [subj, setSubj] = useState(r ? `Solicitud N° ${r.ref}: ${r.title}` : '')
  const [msg, setMsg] = useState('')
  const [er, setEr] = useState({})
  const send = () => {
    const e = {}
    if (subj.trim().length < 3) e.subj = 'Escribe un asunto'
    if (msg.trim().length < 10) e.msg = 'Cuéntale a la administración qué necesitas (mínimo 10 letras)'
    setEr(e)
    if (Object.keys(e).length) { setTimeout(() => document.querySelector('[aria-invalid="true"]')?.focus(), 60); return }
    replace('correoOk', { id: p.id })
  }
  return (
    <>
      <Header title="Contactar con administrador" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 20 }}>
        <div><span className="lbl" style={{ marginBottom: 8 }}>Para</span>
          <div className="card row" style={{ gap: 12, padding: 12, borderRadius: 16 }}><Tile icon={Building2} size={36} ico={18} /><div className="col"><span className="t-sm" style={{ fontWeight: 510 }}>Administración</span><span className="t-xs mut">admin@komon.cl</span></div></div></div>
        <div><label className="lbl" htmlFor="cs" style={{ marginBottom: 8 }}>Asunto</label><input id="cs" className={'field' + (er.subj ? ' bad' : '')} aria-invalid={!!er.subj} aria-describedby="cs-h" placeholder="Ej: Consulta sobre mi solicitud" value={subj} onChange={e => { setSubj(e.target.value); setEr(x => ({ ...x, subj: null })) }} /><Hint id="cs-h" err={er.subj}>Resume el motivo de tu correo</Hint></div>
        <div><label className="lbl" htmlFor="cm" style={{ marginBottom: 8 }}>Mensaje</label><textarea id="cm" className={'field' + (er.msg ? ' bad' : '')} aria-invalid={!!er.msg} aria-describedby="cm-h" rows={6} placeholder="Escribe tu mensaje" value={msg} onChange={e => { setMsg(e.target.value); setEr(x => ({ ...x, msg: null })) }} style={{ resize: 'none' }} /><Hint id="cm-h" err={er.msg}>Responderán a tu correo registrado.</Hint></div>
      </div>
      <Foot><Btn onClick={send}>Enviar correo</Btn></Foot></>)
}

function CorreoOk({ st, p, tab, under }) {
  const r = p.id && st.reqs.find(x => x.id === p.id)
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 48px)', gap: 12 }}>
        <Success /><h1 style={{ margin: '12px 0 0', fontSize: '1.375rem', fontWeight: 590 }}>Correo enviado</h1>
        <p className="t-sm mut" style={{ margin: 0, maxWidth: 300 }}>La administración te responderá a residente@komon.cl en un plazo de 48 horas hábiles.</p>
      </div>
      <Foot nb>{r && <Btn v="inv" onClick={() => under(['serv', { tab: 'sol' }], 'sol', { id: r.id, fresh: true })}>Volver a mi solicitud</Btn>}<Btn v={r ? 'dark' : 'inv'} onClick={() => tab('home')}>Volver al inicio</Btn></Foot></>)
}
