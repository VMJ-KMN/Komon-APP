import React, { useState, useEffect } from 'react'
import { House, ScanQrCode, Package, Wallet, LayoutGrid, QrCode, Calendar as Cal, ClipboardList, Receipt, Bell, Utensils, Users, CircleAlert, ArrowUpRight, ArrowUpLeft, Clock, Building2, Shield, Droplet, Flame, Landmark, Lock, Camera, Wrench, MessageCircle, CircleHelp, CreditCard, Info, Plus, ChevronRight, Check, Wifi } from 'lucide-react'
import { Header, TabHeader, Foot, Btn, Sheet, Switch, Tabs, Tile, Sum, KV, PinBox, Success, Qr, Calendar, TODAY, MESES, DIAS, key, cap, dShort, money, initials } from './ui.jsx'
import { initial, BLOCKS, STEPS } from './data.js'

const LS = 'serenity-demo-v2'
const load = () => { try { const s = JSON.parse(localStorage.getItem(LS)); if (s) return s } catch (e) {} return initial() }
const dt = s => new Date(s)
const hhmm = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') }
const NAV = ['home', 'accesos', 'enc', 'fin', 'serv']

export default function App() {
  const [st, setSt] = useState(load)
  const [stack, setStack] = useState([{ s: st.onboarded ? 'home' : 'onb' }])
  const [toast, setToast] = useState(null)
  useEffect(() => { try { localStorage.setItem(LS, JSON.stringify(st)) } catch (e) {} }, [st])
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2400); return () => clearTimeout(t) } }, [toast])
  const cur = stack[stack.length - 1]
  useEffect(() => { setToast(null) }, [cur.s])

  const up = f => setSt(s => ({ ...s, ...f(s) }))
  const go = (s, p = {}) => setStack(a => [...a, { s, p }])
  const back = () => setStack(a => (a.length > 1 ? a.slice(0, -1) : a))
  const tab = (s, p = {}) => setStack([{ s, p }])
  const replace = (s, p = {}) => setStack(a => [...a.slice(0, -1), { s, p }])
  const reset = () => { setSt(initial()); setStack([{ s: 'onb' }]) }
  const A = { st, up, go, back, tab, replace, toast: setToast, reset, p: cur.p || {}, deep: stack.length > 1 }

  const Screens = { onb: Onb, home: Home, accesos: Accesos, nuevoPase: NuevoPase, paseCreado: PaseCreado, pase: PaseDetalle, paseRev: PaseRevocado,
    enc: Encomiendas, fin: Finanzas, pagar: Pagar, proc: Procesando, comp: Comprobante, serv: Servicios, reservar: Reservar, confReserva: ConfReserva, reservaOk: ReservaOk,
    solCat: SolCat, solForm: SolForm, solOk: SolOk, sol: SolDetalle, avisos: Avisos, perfil: Perfil }
  const S = Screens[cur.s]
  const showNav = NAV.includes(cur.s)
  const nPass = st.passes.filter(p => p.status === 'vigente').length
  const nPkg = st.pkgs.filter(p => p.status === 'porteria').length
  const items = [['home', House, 'Inicio'], ['accesos', ScanQrCode, 'Accesos', nPass], ['enc', Package, 'Encomiendas', nPkg], ['fin', Wallet, 'Finanzas', 'dot'], ['serv', LayoutGrid, 'Servicios']]

  return (
    <div className="stage"><div className="phone">
      <S {...A} />
      {showNav && <>
        <div className="fade" />
        <nav className="nav" aria-label="Principal">
          {items.map(([k, I, l, b]) => (
            <button key={k} className={cur.s === k ? 'on' : ''} onClick={() => tab(k)} aria-current={cur.s === k ? 'page' : undefined}>
              <I size={20} strokeWidth={2} />{l}
              {b === 'dot' ? st.bills.length > 0 && <i className="dot" /> : b > 0 && <span className="bd">{b}</span>}
            </button>))}
        </nav></>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div></div>
  )
}

/* ---------- Onboarding ---------- */
function Onb({ st, up, tab }) {
  const [n, setN] = useState(0)
  const [sw, setSw] = useState(st.sw)
  const finish = () => { up(() => ({ onboarded: true, sw })); tab('home') }
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
        <div style={{ width: 72 }}>{n > 0 && n < 5 && <button className="back" aria-label="Atrás" onClick={() => setN(n - 1)} style={{ background: 'none', border: 0, height: 40, display: 'flex', alignItems: 'center' }}><ArrowUpLeft size={22} /></button>}</div>
        {n >= 1 && n <= 4 && <div className="row" style={{ gap: 8 }} aria-label={`Paso ${n} de 4`}>{[1, 2, 3, 4].map(i => <span key={i} style={{ width: i === n ? 24 : 8, height: 8, borderRadius: 4, background: i === n ? '#f3f3f3' : '#444544' }} />)}</div>}
        <div style={{ width: 72, textAlign: 'right' }}>{n >= 1 && n <= 4 && <button className="lnk" style={{ color: '#c5c5c5', height: 40 }} onClick={() => setN(5)}>Omitir</button>}</div>
      </div>
      <div className="scroll col center" style={{ justifyContent: 'center', gap: 24 }}>
        {I && <><span className="tile" style={{ width: 120, height: 120, background: n === 0 ? 'var(--primary)' : 'var(--muted)' }}><I size={52} strokeWidth={1.6} /></span>
          <div className="col" style={{ gap: 12 }}>{n === 0 && <span className="t-sm mut upper" style={{ letterSpacing: '.12em' }}>Serenity</span>}
            <h1 style={{ margin: 0, fontSize: n === 0 ? 32 : 28, lineHeight: 1.2, fontWeight: 590 }}>{slides[n][1]}</h1><p className="mut" style={{ margin: 0, fontSize: 16, lineHeight: '24px' }}>{slides[n][2]}</p></div></>}
        {n === 4 && <div style={{ width: '100%' }}><h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 590 }}>Avisos que importan</h1><p className="mut" style={{ margin: '0 0 24px', fontSize: 16 }}>Elige de qué quieres enterarte. Puedes cambiarlo después en tu perfil.</p>
          <div className="card s" style={{ padding: '0 16px', textAlign: 'left' }}>{rows.map(([k, l, s], i) => <div key={k} className="row" style={{ minHeight: 68, gap: 12, borderTop: i ? '1px solid var(--border)' : 0 }}><div style={{ flex: 1 }}><div className="t-base">{l}</div><div className="t-sm mut">{s}</div></div><Switch label={l} on={sw[k]} onChange={() => setSw({ ...sw, [k]: !sw[k] })} /></div>)}</div></div>}
        {n === 5 && <><span className="tile" style={{ width: 120, height: 120, background: 'var(--success)' }}><Check size={56} strokeWidth={1.8} /></span><div><h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 590 }}>Todo listo, Residente</h1><p className="mut" style={{ margin: 0, fontSize: 16 }}>Tu Inicio te muestra primero lo que requiere tu atención.</p></div></>}
      </div>
      <Foot nb>
        <Btn onClick={() => (n === 5 ? finish() : setN(n + 1))}>{lab[n]}</Btn>
        {(n === 0 || n === 4) ? <Btn v="dark" onClick={() => (n === 0 ? finish() : setN(5))}>{n === 0 ? 'Ya tengo cuenta' : 'Ahora no'}</Btn> : <div style={{ height: 48 }} />}
      </Foot></>)
}

/* ---------- Inicio ---------- */
function Home({ st, go, tab }) {
  const pk = st.pkgs.filter(x => x.status === 'porteria')
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  const act = st.passes.filter(p => p.status === 'vigente')
  const rsv = st.reservas.slice().sort((a, b) => dt(a.date) - dt(b.date))[0]
  const open = st.reqs.filter(r => r.status < 3)
  const nt = st.notices[0]
  const qa = [[QrCode, 'Nuevo pase', () => go('nuevoPase'), 1], [Cal, 'Reservar', () => go('reservar')], [ClipboardList, 'Solicitud', () => go('solCat')], [Receipt, 'Pagar', () => go('pagar')]]
  return (
    <>
      <div className="hdr" style={{ paddingBottom: 0 }}>
        <div className="col" style={{ flex: 1, gap: 2, minWidth: 0 }}><span style={{ fontSize: 30, lineHeight: '36px', whiteSpace: 'nowrap' }}>Hola, Residente</span><span className="t-sm mut">Torre A · Depto 1204</span></div>
        <button className="tile" aria-label="Avisos" onClick={() => go('avisos')} style={{ width: 40, height: 40, border: 0, background: 'var(--muted)', position: 'relative' }}><Bell size={20} /><i style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, background: '#e5484d' }} /></button>
        <button className="av" aria-label="Perfil" onClick={() => go('perfil')} style={{ width: 40, height: 40, background: 'none' }}>RD</button>
      </div>
      <div className="scroll nav-pad" style={{ paddingTop: 12 }}>
        <div className="row" style={{ gap: 8, alignItems: 'stretch' }}>
          {qa.map(([I, l, f, p]) => <button key={l} className="qa" onClick={f}><Tile icon={I} size={40} ico={20} pri={p} />{l}</button>)}
        </div>
        {(total > 0 || pk.length > 0) && <div className="col" style={{ gap: 12 }}>
          <p className="sec">Requiere tu atención</p>
          {total > 0 && <Sum alert icon={Receipt} label="Saldo por pagar" value={money(total)} detail="Vence el 10 de diciembre" onClick={() => go('fin')} />}
          {pk.length > 0 && <Sum icon={Package} label="Encomiendas" value={`${pk.length} por retirar`} detail={pk.map(p => p.from).join(' · ')} onClick={() => go('enc')} />}
        </div>}
        {nt && <div className="col" style={{ gap: 12 }}><p className="sec">Aviso destacado</p><Notice n={nt} onClick={() => go('avisos')} /></div>}
        <div className="col" style={{ gap: 12 }}>
          <p className="sec">Tu actividad</p>
          <Sum icon={QrCode} label="Visitas vigentes" value={`${act.length} ${act.length === 1 ? 'pase activo' : 'pases activos'}`} detail={act[0] ? `${act[0].name} · ${act[0].when}` : 'Sin pases activos'} onClick={() => go('accesos')} />
          <Sum icon={Utensils} label="Próxima reserva" value={rsv ? `${rsv.space} · ${dShort(dt(rsv.date)).toLowerCase()}` : 'Sin reservas'} detail={rsv ? `${rsv.from} – ${rsv.to}` : 'Reserva un espacio'} onClick={() => go('serv', {})} />
          <Sum icon={ClipboardList} label="Mis solicitudes" value={`${open.length} en revisión`} detail={open[0] ? open[0].title : 'Todo al día'} onClick={() => go('serv', { tab: 'sol' })} />
        </div>
      </div></>)
}

function Notice({ n, onClick }) {
  const pri = n.pri
  return (
    <div role="button" onClick={onClick} className="col" style={{ gap: 8, padding: 20, borderRadius: 16, background: pri ? 'var(--primary)' : 'var(--muted)', cursor: 'pointer' }}>
      <div className="row" style={{ gap: 8 }}>
        <CircleAlert size={20} color={pri ? '#fff' : '#f59e0b'} /><span className="t-sm" style={{ flex: 1, fontWeight: 510 }}>{n.eyebrow}</span>
        {pri && <span className="tile" style={{ width: 40, height: 40, background: 'var(--content)', color: 'var(--surface)' }}><ArrowUpRight size={20} /></span>}
      </div>
      <div className="t-lg">{n.t}</div>
      <div className="t-sm" style={{ opacity: .9 }}>{n.s}</div>
    </div>)
}

/* ---------- Accesos ---------- */
function Accesos({ st, go }) {
  const [t, setT] = useState('v')
  const list = st.passes.filter(p => (t === 'v' ? p.status === 'vigente' : p.status !== 'vigente'))
  const nv = st.passes.filter(p => p.status === 'vigente').length
  return (
    <>
      <TabHeader title="Accesos" />
      <div className="scroll nav-pad" style={{ paddingTop: 12 }}>
        <Tabs items={[['v', 'Vigentes', nv], ['h', 'Historial']]} value={t} onChange={setT} />
        {list.length === 0 && <div className="card center col" style={{ gap: 8 }}><span className="t-base">{t === 'v' ? 'No tienes pases vigentes' : 'Aún no hay historial'}</span><span className="t-sm mut">{t === 'v' ? 'Crea uno para tu próxima visita.' : 'Tus pases usados o revocados aparecerán aquí.'}</span></div>}
        {list.map(p => (
          <div key={p.id} className="card col" style={{ gap: 16, opacity: t === 'h' ? .85 : 1 }}>
            <div className="row" style={{ gap: 12 }}>
              <span className="av" style={{ width: 48, height: 48 }}>{initials(p.name)}</span>
              <div className="col" style={{ gap: 4, minWidth: 0 }}>
                <span className="t-lg" style={{ fontWeight: 400 }}>{p.name}</span>
                <span className="tag" style={{ alignSelf: 'flex-start' }}>{p.kind} • <Clock size={12} /> {p.when}</span>
              </div>
            </div>
            {t === 'v' ? <>
              <PinBox label="PIN de visita" pin={p.pin} />
              <div className="row" style={{ gap: 12 }}><Btn v="inv" onClick={() => go('pase', { id: p.id })}>Ver</Btn><Btn v="danger" onClick={() => go('pase', { id: p.id, ask: true })}>Revocar</Btn></div></>
              : <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-sm mut">{p.created}</span><span className={'tag'} style={{ color: p.status === 'revocado' ? '#f08a87' : undefined }}>{p.status === 'revocado' ? 'Revocado' : 'Usado'}</span></div>}
          </div>))}
      </div>
      {t === 'v' && <button className="fab" onClick={() => go('nuevoPase')}><Plus size={22} /> Nuevo pase</button>}
    </>)
}

function NuevoPase({ up, back, replace }) {
  const [kind, setKind] = useState('Visita')
  const [name, setName] = useState('')
  const [rut, setRut] = useState('')
  const [dur, setDur] = useState('1 día')
  const [date, setDate] = useState(null)
  const ok = name.trim().length > 1 && (dur !== 'Elegir fecha' || date)
  const create = () => {
    const id = 'p' + Date.now(), n = name.trim()
    const pin = String(1000 + Math.floor(Math.random() * 9000))
    const week = new Date(TODAY.getTime() + 7 * 864e5)
    const valid = dur === '1 día' ? 'Hoy, 23:59' : dur === '1 semana' ? `${week.getDate()} ${MESES[week.getMonth()].slice(0, 3)}, 23:59` : `${date.getDate()} ${MESES[date.getMonth()].slice(0, 3)}, 23:59`
    const long = dur === '1 día' ? 'hoy hasta las 23:59' : `hasta el ${valid.replace(', ', ' a las ')}`
    up(s => ({ passes: [{ id, name: n, kind, when: dur === 'Elegir fecha' ? dShort(date) : cap(dur).replace('Día', 'Día'), pin, rut: rut || '—', created: 'Hoy, ' + hhmm(), valid, long, status: 'vigente' }, ...s.passes] }))
    replace('paseCreado', { id })
  }
  return (
    <>
      <Header title="Nuevo pase" onBack={back} />
      <div className="scroll" style={{ gap: 20, paddingTop: 4 }}>
        <div><span className="lbl" style={{ marginBottom: 12 }}>Tipo de pase</span><div className="chips">{['Visita', 'Delivery', 'Proveedor'].map(k => <button key={k} className={'chip' + (kind === k ? ' on' : '')} onClick={() => setKind(k)}>{k}</button>)}</div></div>
        <div><label className="lbl" htmlFor="nm" style={{ marginBottom: 8 }}>Nombre de la visita</label><input id="nm" className="field" placeholder="Ej: Pedro Rojas" value={name} onChange={e => setName(e.target.value)} /><p className="help">Como aparecerá en el pase</p></div>
        <div><label className="lbl" htmlFor="rut" style={{ marginBottom: 8 }}>RUT (opcional)</label><input id="rut" className="field" placeholder="Ej: 12.345.678-9" inputMode="text" value={rut} onChange={e => setRut(e.target.value)} /><p className="help">Solo si conserjería lo necesita</p></div>
        <div><span className="lbl" style={{ marginBottom: 12 }}>Duración</span><div className="chips">{['1 día', '1 semana', 'Elegir fecha'].map(k => <button key={k} className={'chip' + (dur === k ? ' on' : '')} onClick={() => setDur(k)}>{k}</button>)}</div></div>
        {dur === 'Elegir fecha' && <Calendar value={date} onChange={setDate} />}
      </div>
      <Foot><Btn disabled={!ok} onClick={create}>Crear pase</Btn></Foot></>)
}

function PaseCreado({ st, p, tab, toast }) {
  const x = st.passes.find(q => q.id === p.id)
  if (!x) return null
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px)', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 590 }}>Pase creado</h1>
        <p className="t-sm mut" style={{ margin: 0 }}>{x.name} · {x.kind} · Válido {x.long || 'hoy hasta las 23:59'}</p>
        <Qr seed={x.id + x.name} size={160} />
        <div style={{ width: '100%' }}><PinBox label="PIN de visita" pin={x.pin} /></div>
      </div>
      <Foot nb><Btn v="inv" onClick={() => toast('Pase enviado a ' + x.name)}>Compartir pase</Btn><Btn v="dark" onClick={() => tab('accesos')}>Listo</Btn></Foot></>)
}

function PaseDetalle({ st, up, p, back, replace, toast }) {
  const [ask, setAsk] = useState(!!p.ask)
  const x = st.passes.find(q => q.id === p.id)
  if (!x) return null
  const act = x.status === 'vigente'
  const revoke = () => { up(s => ({ passes: s.passes.map(q => (q.id === x.id ? { ...q, status: 'revocado', revokedAt: hhmm() } : q)) })); replace('paseRev', { id: x.id }) }
  const stColor = act ? 'var(--primary)' : x.status === 'revocado' ? 'var(--danger)' : 'var(--content-subtle)'
  return (
    <>
      <Header title="Pase de visita" onBack={back} />
      <div className="scroll" style={{ paddingTop: 4 }}>
        <div className="card col center" style={{ gap: 16, alignItems: 'stretch' }}>
          <div className="row" style={{ gap: 12 }}><span className="av" style={{ width: 48, height: 48 }}>{initials(x.name)}</span>
            <div className="col"><span className="t-base">{x.name}</span><span className="t-xs upper row" style={{ gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 4, background: stColor }} />{x.status}</span></div></div>
          <div style={{ alignSelf: 'center' }}><Qr seed={x.id + x.name} size={160} dim={!act} /></div>
          <PinBox label="PIN de visita" pin={x.pin} />
        </div>
        <div className="card"><KV k="RUT" v={x.rut} /><KV k="Tipo" v={x.kind} /><KV k="Creado" v={x.created} /><KV k="Vence" v={x.valid || '—'} /></div>
      </div>
      <Foot><Btn v="dark" onClick={() => toast('Pase compartido')}>Compartir</Btn>{act && <Btn v="danger" onClick={() => setAsk(true)}>Revocar pase</Btn>}</Foot>
      {ask && <Sheet onClose={() => setAsk(false)}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 590 }}>¿Revocar este pase?</h2>
        <p className="t-sm mut" style={{ margin: '0 0 8px' }}>{x.name} ya no podrá ingresar con este código y avisaremos a conserjería.</p>
        <Btn v="danger" onClick={revoke}>Sí, revocar</Btn><Btn v="dark" onClick={() => setAsk(false)}>Cancelar</Btn></Sheet>}
    </>)
}

function PaseRevocado({ st, p, tab, go }) {
  const x = st.passes.find(q => q.id === p.id)
  if (!x) return null
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 48px)', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 590 }}>Pase revocado</h1>
        <p className="t-sm mut" style={{ margin: 0 }}>El acceso de {x.name} fue anulado y avisamos a conserjería.</p>
        <Qr seed={x.id + x.name} size={160} dim bad />
        <div className="card s" style={{ width: '100%', padding: '12px 24px' }}><KV k="Pase" v={`${x.name} · ${x.kind}`} /><KV k="Revocado" v={'Hoy, ' + (x.revokedAt || hhmm())} /></div>
      </div>
      <Foot nb><Btn v="dark" onClick={() => tab('nuevoPase')}>Crear otro pase</Btn><Btn v="inv" onClick={() => tab('accesos')}>Volver a Accesos</Btn></Foot></>)
}

/* ---------- Encomiendas ---------- */
function Encomiendas({ st, up, back, deep, toast }) {
  const [t, setT] = useState('p')
  const lp = st.pkgs.filter(p => p.status === 'porteria'), lr = st.pkgs.filter(p => p.status === 'retirado')
  const list = t === 'p' ? lp : lr
  const confirm = id => { up(s => ({ pkgs: s.pkgs.map(q => (q.id === id ? { ...q, status: 'retirado' } : q)) })); toast('Retiro confirmado') }
  return (
    <>
      {deep ? <Header title="Encomiendas" onBack={back} /> : <TabHeader title="Encomiendas" />}
      <div className="scroll nav-pad" style={{ paddingTop: 12 }}>
        <Tabs items={[['p', 'En portería', lp.length], ['r', 'Retirados', lr.length]]} value={t} onChange={setT} />
        {list.length === 0 && <div className="card center col" style={{ gap: 8 }}><span className="t-base">{t === 'p' ? 'No tienes encomiendas en portería' : 'Aún no has retirado encomiendas'}</span></div>}
        {list.map(p => (
          <div key={p.id} className="card col" style={{ gap: 12 }}>
            <div className="col" style={{ gap: 4 }}><div className="row" style={{ gap: 12 }}><Package size={22} /><span className="t-lg" style={{ fontWeight: 400 }}>{p.from}</span></div><span className="t-xs mut">{p.info}</span></div>
            {t === 'p' ? <><PinBox label="PIN de retiro" pin={p.pin} /><Btn v="inv" onClick={() => confirm(p.id)}>Confirmar Retiro</Btn></> : <span className="tag" style={{ alignSelf: 'flex-start' }}>Retirado</span>}
          </div>))}
      </div></>)
}

/* ---------- Finanzas ---------- */
const ICONS = { building: Building2, shield: Shield, drop: Droplet, flame: Flame }
function Finanzas({ st, go }) {
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  return (
    <>
      <TabHeader title="Finanzas" />
      <div className="scroll nav-pad" style={{ paddingTop: 12 }}>
        {total > 0 ? <>
          <div className="card col" style={{ gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-sm mut">Saldo de noviembre</span><span className="t-xs upper row" style={{ gap: 8 }}><i style={{ width: 8, height: 8, borderRadius: 4, background: '#f59e0b' }} />Por vencer</span></div>
            <div style={{ fontSize: 36, lineHeight: '44px', fontWeight: 590 }}>{money(total)}</div>
            <div className="row t-sm mut" style={{ gap: 8 }}><Cal size={16} />Vence el 10 de diciembre de 2026</div>
            <div style={{ height: 4 }} /><Btn onClick={() => go('proc', { method: 'Tarjeta ····4821' })}>Pagar con tarjeta ····4821</Btn>
            <button className="lnk" style={{ height: 32 }} onClick={() => go('pagar')}>Usar otro método</button>
          </div>
          <div className="card col" style={{ gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="t-base" style={{ fontSize: 18 }}>Detalle del cobro</span><span className="lnk">Ver todo</span></div>
            {st.bills.map(b => { const I = ICONS[b.i]; return <div key={b.k} className="row" style={{ gap: 12 }}><Tile icon={I} size={40} ico={18} /><div className="col" style={{ flex: 1 }}><span className="t-sm" style={{ fontWeight: 510, fontSize: 15 }}>{b.k}</span><span className="t-xs mut">{b.s}</span></div><span className="t-base">{money(b.v)}</span></div> })}
            <div className="hr" /><div className="row" style={{ justifyContent: 'space-between' }}><span className="t-lg" style={{ fontWeight: 510 }}>Total a pagar</span><span className="t-lg" style={{ fontWeight: 510 }}>{money(total)}</span></div>
          </div></> :
          <div className="card center col" style={{ gap: 12 }}><Success size={64} /><span className="t-lg">Estás al día</span><span className="t-sm mut">No tienes pagos pendientes.</span></div>}
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: -12 }}><span className="sec" style={{ color: 'var(--content)' }}>Pagos anteriores</span><span className="lnk">Ver historial</span></div>
        {st.paid.map(c => (
          <button key={c.id} className="row" onClick={() => go('comp', { id: c.id, view: true })} style={{ gap: 12, background: '#3a3c3a', border: 0, borderRadius: 16, padding: 16, textAlign: 'left', width: '100%' }}>
            <Tile icon={Receipt} pri={false} /><div className="col" style={{ flex: 1 }}><span className="t-base" style={{ fontSize: 18, fontWeight: 400 }}>{c.concept}</span><span className="t-xs mut">Pagado {c.short} · {c.method.split(' ')[0]}</span></div><span className="t-base">{money(c.v)}</span>
          </button>))}
      </div></>)
}

function Pagar({ st, back, go, replace }) {
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  const [m, setM] = useState('card')
  if (!total) return <><Header title="Pagar" onBack={back} /><div className="scroll"><p className="t-sm mut">No tienes pagos pendientes.</p></div></>
  const opts = [['card', CreditCard, 'Tarjeta de crédito o débito', 'Pago inmediato con Webpay'], ['bank', Landmark, 'Transferencia bancaria', 'Desde tu banco, confirmación en minutos']]
  return (
    <>
      <Header title="Pagar" onBack={back} />
      <div className="scroll" style={{ paddingTop: 4, gap: 20 }}>
        <div className="col" style={{ gap: 4 }}><span className="t-sm mut">Total a pagar</span><span style={{ fontSize: 36, lineHeight: '44px', fontWeight: 590 }}>{money(total)}</span><span className="t-sm mut">Gastos comunes · Noviembre 2026</span></div>
        <span className="lbl" style={{ margin: 0, color: 'var(--content)' }}>Elige cómo pagar</span>
        <div className="col" style={{ gap: 12, marginTop: -4 }}>
          {opts.map(([k, I, t, s]) => <button key={k} className={'opt' + (m === k ? ' on' : '')} onClick={() => setM(k)}><Tile icon={I} size={44} ico={20} /><span className="col" style={{ flex: 1, gap: 2 }}><span className="t-base" style={{ fontWeight: 400 }}>{t}</span><span className="t-xs mut">{s}</span></span><span className={'radio' + (m === k ? ' on' : '')} /></button>)}
        </div>
        <div className="row t-xs mut" style={{ gap: 8 }}><Lock size={16} />Pago seguro. No guardamos los datos de tu tarjeta.</div>
      </div>
      <Foot><Btn onClick={() => replace('proc', { method: m === 'card' ? 'Tarjeta ····4821' : 'Transferencia' })}>Continuar</Btn></Foot></>)
}

function Procesando({ st, up, p, replace }) {
  useEffect(() => {
    const t = setTimeout(() => {
      const id = 'c' + Date.now(), total = st.bills.reduce((a, b) => a + b.v, 0)
      const d = TODAY
      up(s => ({ bills: [], paid: [{ id, concept: 'Noviembre 2026', v: total, date: `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}, ${hhmm()}`, short: `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`, method: p.method, ref: 'SRN-001482' }, ...s.paid] }))
      replace('comp', { id })
    }, 1700)
    return () => clearTimeout(t)
  }, [])
  return <div className="scroll center" style={{ justifyContent: 'center', gap: 20 }}><div className="spin" /><div className="t-base">Procesando tu pago…</div><div className="t-sm mut">No cierres la aplicación</div></div>
}

function Comprobante({ st, p, tab, back, toast }) {
  const c = st.paid.find(x => x.id === p.id)
  if (!c) return null
  const g = Math.round(c.v * 0.7578 / 50) * 50
  return (
    <>
      <Header title="Comprobante" onBack={() => (p.view ? back() : tab('fin'))} />
      <div className="scroll" style={{ paddingTop: 4, gap: 16 }}>
        <div className="card center col" style={{ gap: 8 }}><Success size={48} /><span className="t-sm mut" style={{ marginTop: 4 }}>Pago aprobado</span><span style={{ fontSize: 36, lineHeight: '44px', fontWeight: 590 }}>{money(c.v)}</span></div>
        <div className="card"><KV k="N° de comprobante" v={c.ref} /><KV k="Fecha" v={c.date} /><KV k="Método" v={c.method} /><KV k="Departamento" v="Torre A · 1204" /></div>
        <div className="card"><KV k="Gasto común y fondo" v={money(g)} /><KV k="Agua y gas" v={money(c.v - g)} /><div className="hr" /><div className="kv" style={{ fontSize: 16 }}><b>Total pagado</b><b>{money(c.v)}</b></div></div>
      </div>
      <Foot><Btn v="dark" onClick={() => toast('Comprobante compartido')}>Compartir</Btn><Btn v="inv" onClick={() => toast('PDF descargado')}>Descargar PDF</Btn></Foot></>)
}

/* ---------- Servicios ---------- */
function Servicios({ st, go, p }) {
  const [t, setT] = useState(p.tab || 'res')
  const next = st.reservas.slice().sort((a, b) => dt(a.date) - dt(b.date))[0]
  const spaces = [[Utensils, 'Quincho', 'Hasta 20 personas · 09:00 a 23:00', true], [Users, 'Sala multiuso', 'Hasta 30 personas · 09:00 a 22:00', false]]
  return (
    <>
      <TabHeader title="Servicios" />
      <div className="scroll nav-pad" style={{ paddingTop: 12 }}>
        <Tabs items={[['res', 'Reservas'], ['sol', 'Solicitudes']]} value={t} onChange={setT} />
        {t === 'res' ? <>
          {next && <div className="col" style={{ gap: 12 }}><p className="sec">Mi próxima reserva</p>
            <button className="sum alert" onClick={() => toast0()} style={{ cursor: 'default' }}><Tile icon={Cal} pri /><span className="b"><span className="t-xs mut">{next.space}</span><span className="t-base" style={{ fontSize: 18 }}>{dShort(dt(next.date))}</span><span className="t-xs mut">{next.from} – {next.to} · Gratis</span></span><ChevronRight size={16} color="#c5c5c5" /></button></div>}
          <div className="col" style={{ gap: 12 }}><p className="sec">Reservar un espacio</p>
            {spaces.map(([I, n, s, ok]) => (
              <button key={n} onClick={() => go('reservar')} style={{ background: 'var(--muted)', border: 0, borderRadius: 24, overflow: 'hidden', textAlign: 'left', padding: 0, width: '100%' }}>
                <div style={{ height: 112, background: 'var(--elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I size={44} strokeWidth={1.4} /></div>
                <div className="col" style={{ padding: '16px 16px 16px', gap: 8 }}><div className="row" style={{ justifyContent: 'space-between' }}><span className="t-base" style={{ fontSize: 18, fontWeight: 400 }}>{n}</span><span className="t-xs upper row" style={{ gap: 8 }}><i style={{ width: 8, height: 8, borderRadius: 4, background: '#16a34a' }} />Disponible</span></div><span className="t-xs mut">{s}</span></div>
              </button>))}
          </div></> :
          <div className="col" style={{ gap: 12 }}>
            {st.reqs.length === 0 && <div className="card center col"><span className="t-base">Sin solicitudes</span></div>}
            {st.reqs.map(r => <Sum key={r.id} icon={ClipboardList} label={r.cat} value={r.title} detail={`${r.status === 3 ? 'Resuelta' : STEPS[r.status]} · ${r.created}`} onClick={() => go('sol', { id: r.id })} />)}
          </div>}
      </div>
      {t === 'sol' && <button className="fab" onClick={() => go('solCat')}><Plus size={22} /> Nueva solicitud</button>}
    </>)
}
const toast0 = () => {}

function occ(date, name, st) {
  if (st.reservas.some(r => key(dt(r.date)) === key(date) && r.block === name)) return 'Reservado'
  const d = date.getDate()
  if (name === 'Noche' && (d % 3 === 0 || d === 21)) return 'Ocupado'
  if (name === 'Mañana' && d === 25) return 'Ocupado'
  return null
}
function Reservar({ st, back, go }) {
  const start = new Date(2026, 10, 16)
  const days = Array.from({ length: 28 }, (_, i) => new Date(start.getTime() + i * 864e5))
  const [date, setDate] = useState(new Date(2026, 10, 22))
  const [block, setBlock] = useState(null)
  return (
    <>
      <Header title="Reservar quincho" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 16 }}>
        <div className="row t-xs mut" style={{ gap: 8 }}><Users size={16} />Hasta 20 personas · 09:00 a 23:00 · Gratis</div>
        <div style={{ fontSize: 18, fontWeight: 510 }}>{cap(MESES[date.getMonth()])} {date.getFullYear()}</div>
        <div className="days" role="listbox" aria-label="Elige un día">{days.map(d => <button key={key(d)} role="option" aria-selected={key(d) === key(date)} disabled={d < TODAY} className={'day' + (key(d) === key(date) ? ' on' : '')} onClick={() => { setDate(d); setBlock(null) }}><span>{cap(DIAS[d.getDay()].slice(0, 3))}</span><b>{d.getDate()}</b></button>)}</div>
        <span className="sec">Elige un bloque</span>
        <div className="col" style={{ gap: 12, marginTop: -4 }}>
          {BLOCKS.map(([n, a, b]) => { const o = occ(date, n, st); return (
            <button key={n} disabled={!!o} className={'opt' + (block === n ? ' on' : '')} onClick={() => setBlock(n)}>
              <span className="col" style={{ flex: 1, gap: 2 }}><span className="t-base" style={{ fontWeight: 400, fontSize: 18 }}>{n}</span><span className="t-xs mut">{a} – {b}</span></span>
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
        <div className="card col" style={{ gap: 4 }}><span className="t-base" style={{ fontSize: 18, fontWeight: 400, marginBottom: 8 }}>Resumen</span>
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
        <Success /><h1 style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 590 }}>Reserva confirmada</h1>
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
        <span className="t-base" style={{ fontSize: 18, fontWeight: 510 }}>¿Qué necesitas?</span>
        {CATS.map(([I, c]) => <button key={c} className="sum" style={{ padding: '16px', minHeight: 72 }} onClick={() => go('solForm', { cat: c })}><Tile icon={I} size={40} ico={20} /><span className="t-sm" style={{ flex: 1, fontSize: 16, lineHeight: '24px' }}>{c}</span><ChevronRight size={16} color="#c5c5c5" /></button>)}
      </div></>)
}
function SolForm({ p, up, back, replace }) {
  const [sub, setSub] = useState('')
  const [desc, setDesc] = useState('')
  const [foto, setFoto] = useState(false)
  const send = () => {
    const id = 's' + Date.now(), ref = 'SOL-' + String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')
    up(s => ({ reqs: [{ id, cat: p.cat, title: sub.trim(), status: 0, created: 'Hoy', ref }, ...s.reqs] }))
    replace('solOk', { id })
  }
  return (
    <>
      <Header title="Nueva solicitud" onBack={back} />
      <div className="scroll" style={{ paddingTop: 0, gap: 20 }}>
        <span className="chip on" style={{ alignSelf: 'flex-start' }}>{p.cat}</span>
        <div><label className="lbl" htmlFor="as" style={{ marginBottom: 8 }}>Asunto</label><input id="as" className="field" placeholder="Ej: Luz quemada en pasillo piso 12" value={sub} onChange={e => setSub(e.target.value)} /><p className="help">Resume el problema en una frase</p></div>
        <div><label className="lbl" htmlFor="ds" style={{ marginBottom: 8 }}>Descripción</label><textarea id="ds" className="field" rows={4} placeholder="¿Qué pasó y dónde?" value={desc} onChange={e => setDesc(e.target.value)} style={{ resize: 'none' }} /><p className="help">Cuéntanos qué pasó y dónde.</p></div>
        <button onClick={() => setFoto(!foto)} className="row" style={{ justifyContent: 'center', gap: 12, height: 88, border: '1px dashed var(--border-strong)', borderRadius: 16, background: 'none', fontSize: 14 }}><Camera size={20} />{foto ? 'Foto agregada ✓' : 'Agregar foto (opcional)'}</button>
      </div>
      <Foot><Btn disabled={sub.trim().length < 3} onClick={send}>Enviar solicitud</Btn></Foot></>)
}
function SolOk({ st, p, tab, replace }) {
  const r = st.reqs.find(x => x.id === p.id)
  if (!r) return null
  return (
    <>
      <div className="scroll center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px)', gap: 16 }}>
        <Success /><h1 style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 590 }}>Solicitud enviada</h1>
        <p className="t-sm mut" style={{ margin: 0 }}>{r.cat}</p>
        <div className="card s" style={{ width: '100%', padding: '12px 24px' }}><KV k="N° de solicitud" v={r.ref} /><KV k="Asunto" v={r.title} /><KV k="Estado" v="Recibida" /><KV k="Respuesta estimada" v="Hasta 48 horas" /></div>
      </div>
      <Foot nb><Btn v="inv" onClick={() => replace('sol', { id: r.id, fresh: true })}>Ver estado</Btn><Btn v="dark" onClick={() => tab('home')}>Volver al inicio</Btn></Foot></>)
}
function SolDetalle({ st, up, p, back, tab }) {
  const r = st.reqs.find(x => x.id === p.id)
  if (!r) return null
  return (
    <>
      <Header title="Estado de solicitud" onBack={p.fresh ? () => tab('serv', { tab: 'sol' }) : back} />
      <div className="scroll" style={{ paddingTop: 4 }}>
        <div className="card col" style={{ gap: 4 }}><span className="t-xs mut">{r.cat} · {r.created} · {r.ref}</span><span className="t-lg">{r.title}</span></div>
        <div className="card"><span className="t-base" style={{ display: 'block', marginBottom: 16 }}>Seguimiento</span>
          <div className="tl">{STEPS.map((s, i) => <div key={s} className={'it ' + (i < r.status ? 'done' : i === r.status ? 'cur' : '')}><b /><div className="t-base" style={{ fontWeight: 400, color: i > r.status ? 'var(--content-subtle)' : undefined }}>{s}</div>{i === r.status && r.status < 3 && <div className="t-xs mut">Estado actual</div>}</div>)}</div></div>
        {r.status < 3 && <button className="lnk" style={{ color: 'var(--content-subtle)' }} onClick={() => up(s => ({ reqs: s.reqs.map(q => (q.id === r.id ? { ...q, status: q.status + 1 } : q)) }))}>Demo: avanzar estado (moderador)</button>}
      </div></>)
}

/* ---------- Avisos / Perfil ---------- */
function Avisos({ st, back }) {
  return (
    <><Header title="Avisos" onBack={back} /><div className="scroll" style={{ paddingTop: 4, gap: 12 }}>{st.notices.map(n => <Notice key={n.id} n={n} onClick={() => {}} />)}</div></>)
}
function Perfil({ st, up, back, reset }) {
  const rows = [['pases', 'Pases y visitas'], ['paq', 'Encomiendas'], ['fin', 'Gastos comunes']]
  return (
    <>
      <Header title="Perfil" onBack={back} />
      <div className="scroll" style={{ paddingTop: 4 }}>
        <div className="card s row" style={{ gap: 16 }}><span className="av" style={{ width: 56, height: 56 }}>RD</span><div className="col"><span className="t-base">Residente</span><span className="t-sm mut">Torre A · Depto 1204</span></div></div>
        <p className="sec" style={{ marginBottom: -12 }}>Notificaciones</p>
        <div className="card s" style={{ padding: '0 16px' }}>{rows.map(([k, l], i) => <div key={k} className="row" style={{ minHeight: 60, gap: 12, borderTop: i ? '1px solid var(--border)' : 0 }}><span className="t-base" style={{ flex: 1, fontWeight: 400 }}>{l}</span><Switch label={l} on={st.sw[k]} onChange={() => up(s => ({ sw: { ...s.sw, [k]: !s.sw[k] } }))} /></div>)}</div>
        <p className="sec" style={{ marginBottom: -12 }}>Prototipo</p>
        <Btn v="dark" onClick={reset}>Restablecer demo</Btn>
      </div></>)
}
