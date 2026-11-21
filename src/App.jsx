import React, { useState, useEffect } from 'react'
import { Icon, Top, Foot, Sheet, Switch, Item, Qr, Calendar, fmtDate, money, key, TODAY, MESES, DIAS } from './ui.jsx'
import { initial, SLOTS, STEPS } from './data.js'

const LS = 'serenity-demo-v1'
const load = () => { try { const s = JSON.parse(localStorage.getItem(LS)); if (s) return s } catch (e) {} return initial() }
const dt = s => new Date(s)

export default function App() {
  const [st, setSt] = useState(load)
  const [stack, setStack] = useState([{ s: st.onboarded ? 'home' : 'onb' }])
  const [toast, setToast] = useState(null)
  useEffect(() => { try { localStorage.setItem(LS, JSON.stringify(st)) } catch (e) {} }, [st])
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t) } }, [toast])

  const cur = stack[stack.length - 1]
  useEffect(() => { setToast(null) }, [stack.length, cur.s])
  const up = f => setSt(s => ({ ...s, ...f(s) }))
  const go = (s, p = {}) => setStack(a => [...a, { s, p }])
  const back = () => setStack(a => (a.length > 1 ? a.slice(0, -1) : a))
  const tab = s => setStack([{ s }])
  const replace = (s, p = {}) => setStack(a => [...a.slice(0, -1), { s, p }])
  const reset = () => { const i = initial(); setSt(i); setStack([{ s: 'onb' }]) }
  const A = { st, up, go, back, tab, replace, toast: setToast, reset, p: cur.p || {} }

  const Screens = { onb: Onb, home: Home, accesos: Accesos, nuevoPase: NuevoPase, paseCreado: PaseCreado, pase: PaseDetalle,
    enc: Encomiendas, retiro: Retiro, fin: Finanzas, pagar: Pagar, pagoOk: PagoOk, serv: Servicios, reservar: Reservar, reservaOk: ReservaOk,
    solicitud: Solicitud, solOk: SolOk, sol: SolDetalle, avisos: Avisos, perfil: Perfil }
  const S = Screens[cur.s]
  const nav = ['home', 'accesos', 'enc', 'fin', 'serv']
  const root = stack.length === 1 && nav.includes(cur.s)
  const active = nav.includes(stack[0].s) ? stack[0].s : 'home'
  const items = [['home', 'home', 'Inicio'], ['accesos', 'qr', 'Accesos'], ['enc', 'box', 'Paquetes'], ['fin', 'card', 'Pagos'], ['serv', 'cal', 'Servicios']]
  const pending = st.pkgs.filter(x => x.status === 'listo').length

  return (
    <div className="stage"><div className="phone">
      <S {...A} />
      {cur.s !== 'onb' && root && (
        <nav className="nav" aria-label="Principal">
          {items.map(([k, i, l]) => (
            <button key={k} className={active === k ? 'on' : ''} onClick={() => tab(k)} aria-current={active === k ? 'page' : undefined}>
              <span style={{ position: 'relative' }}><Icon n={i} />{k === 'enc' && pending > 0 && <span className="dot" style={{ top: -2, right: -4, borderColor: '#232523' }} />}</span>{l}
            </button>))}
        </nav>)}
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
    ['home', 'Tu comunidad, en tu mano', 'Visitas, pagos, encomiendas y reservas del edificio en un solo lugar.', true],
    ['qr', 'Invita sin llamar a conserjería', 'Crea un pase con QR en segundos y revócalo cuando quieras.'],
    ['card', 'Todo al día, sin papeles', 'Paga tus gastos comunes y entérate apenas llega una encomienda.'],
    ['cal', 'Reserva y pide ayuda', 'Reserva el quincho gratis y haz solicitudes con seguimiento.'],
  ]
  const lab = ['Comenzar', 'Siguiente', 'Siguiente', 'Siguiente', 'Activar y continuar', 'Ir al Inicio']
  const sl = slides[n]
  const rows = [['pases', 'Pases y visitas', 'Cuando llega o sale una visita'], ['paq', 'Encomiendas', 'Cuando llega un paquete'], ['fin', 'Gastos comunes', 'Vencimientos y comprobantes']]
  return (
    <>
      <div className="top" style={{ justifyContent: 'space-between' }}>
        <div style={{ width: 72 }}>{n > 0 && n < 5 && <button className="iconbtn" aria-label="Atrás" onClick={() => setN(n - 1)}><Icon n="back" /></button>}</div>
        {n >= 1 && n <= 4 && <div className="row" style={{ gap: 8 }} aria-label={`Paso ${n} de 4`}>{[1, 2, 3, 4].map(i => <span key={i} style={{ width: i === n ? 24 : 8, height: 8, borderRadius: 4, background: i === n ? '#F3F3F3' : '#444544' }} />)}</div>}
        <div style={{ width: 72, textAlign: 'right' }}>{n >= 1 && n <= 4 && <button onClick={() => setN(5)} style={{ background: 'none', border: 0, color: 'var(--sec)', fontSize: 17, height: 44 }}>Omitir</button>}</div>
      </div>
      <div className="scroll center" style={{ justifyContent: 'center', gap: 24 }}>
        {n <= 3 && <><div className="big" style={{ width: 120, height: 120, borderRadius: 32, background: n === 0 ? 'var(--pri)' : 'var(--card)' }}><Icon n={sl[0]} s={56} w={1.6} c="#fff" /></div>
          <div>{n === 0 && <div className="t2" style={{ letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>Serenity</div>}
            <h1 style={{ margin: '0 0 12px', fontSize: n === 0 ? 32 : 28, lineHeight: 1.2, fontWeight: 600 }}>{sl[1]}</h1><p className="t1" style={{ margin: 0, color: 'var(--sec)' }}>{sl[2]}</p></div></>}
        {n === 4 && <div style={{ width: '100%' }}><h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 600 }}>Avisos que importan</h1><p className="t1" style={{ color: 'var(--sec)', margin: '0 0 24px' }}>Elige de qué quieres enterarte. Puedes cambiarlo después en tu perfil.</p>
          <div className="card" style={{ padding: '0 20px', textAlign: 'left' }}>{rows.map(([k, l, s], i) => <div key={k} className={'row' + (i ? ' sep' : '')} style={{ minHeight: 68 }}><div className="grow"><div className="t1">{l}</div><div className="t2">{s}</div></div><Switch label={l} on={sw[k]} onChange={() => setSw({ ...sw, [k]: !sw[k] })} /></div>)}</div></div>}
        {n === 5 && <><div className="big" style={{ width: 120, height: 120, borderRadius: 32 }}><Icon n="check" s={56} w={1.8} /></div><div><h1 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 600 }}>Todo listo, Residente</h1><p className="t1" style={{ margin: 0, color: 'var(--sec)' }}>Tu Inicio te muestra primero lo que requiere tu atención.</p></div></>}
      </div>
      <Foot>
        <button className="btn" onClick={() => (n === 5 ? finish() : setN(n + 1))}>{lab[n]}</button>
        {(n === 0 || n === 4) ? <button className="btn ghost" onClick={() => (n === 0 ? finish() : setN(5))}>{n === 0 ? 'Ya tengo cuenta' : 'Ahora no'}</button> : <div style={{ height: 52 }} />}
      </Foot>
    </>)
}

/* ---------- Inicio ---------- */
function Home({ st, go }) {
  const pk = st.pkgs.filter(x => x.status === 'listo')
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  const unread = st.notices.filter(n => n.new).length
  const nextRes = st.reservas[0]
  const acts = [['qr', 'Crear pase', () => go('nuevoPase')], ['card', 'Pagar', () => go('pagar')], ['cal', 'Reservar', () => go('reservar')], ['tool', 'Solicitud', () => go('solicitud')]]
  return (
    <>
      <div className="top"><div className="grow"><div className="t2">Torre Alameda · Depto 1204</div><h1 style={{ margin: 0, fontSize: 26 }}>Hola, Residente</h1></div>
        <button className="iconbtn" aria-label="Avisos" onClick={() => go('avisos')}><Icon n="bell" />{unread > 0 && <span className="dot" />}</button>
        <button className="iconbtn" aria-label="Perfil" onClick={() => go('perfil')}><Icon n="user" /></button></div>
      <div className="scroll">
        <div className="h2" style={{ marginTop: 12 }}>Requiere tu atención</div>
        <div className="card" style={{ padding: '4px 16px' }}>
          {pk.length > 0 && <Item icon="box" title={`${pk.length} ${pk.length > 1 ? 'encomiendas' : 'encomienda'} para retirar`} sub={`${pk[0].from} · ${pk[0].when}`} onClick={() => go('enc')} />}
          {total > 0 && <><div className="sep" /><Item icon="card" title="Gastos comunes" sub={<span style={{ color: 'var(--amber)' }}>Vence 30 nov · {money(total)}</span>} onClick={() => go('fin')} /></>}
          {pk.length === 0 && total === 0 && <div className="t2" style={{ padding: '20px 0' }}>Estás al día. Nada pendiente.</div>}
        </div>
        <div className="h2">Acciones rápidas</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {acts.map(([i, l, f]) => <button key={l} onClick={f} style={{ background: 'none', border: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--sec)' }}><span className="sq" style={{ width: 60, height: 60, borderRadius: 20, background: l === 'Crear pase' ? 'var(--pri)' : 'var(--card)' }}><Icon n={i} s={26} c={l === 'Crear pase' ? '#fff' : undefined} /></span>{l}</button>)}
        </div>
        <div className="h2">Próximo</div>
        {nextRes ? <div className="card"><Item icon="fire" title={`${nextRes.space} · ${fmtDate(dt(nextRes.date))}`} sub={`${nextRes.from} – ${nextRes.to}`} right={<span className="pill ok">Confirmada</span>} /></div> : <div className="card t2">Sin reservas próximas</div>}
        <div className="card" style={{ marginTop: 12 }}><Item icon="people" title={`${st.passes.filter(p => p.status === 'activo').length} pases activos`} sub="Visitas autorizadas" onClick={() => go('accesos')} /></div>
      </div>
    </>)
}

/* ---------- Accesos ---------- */
function Accesos({ st, go }) {
  const act = st.passes.filter(p => p.status === 'activo'), hist = st.passes.filter(p => p.status !== 'activo')
  const row = p => <button key={p.id} onClick={() => go('pase', { id: p.id })} className="row" style={{ width: '100%', background: 'none', border: 0, padding: '14px 0', textAlign: 'left', minHeight: 72 }}>
    <span className="sq"><Icon n={p.kind === 'Delivery' ? 'box' : p.kind === 'Servicio' ? 'tool' : 'user'} /></span>
    <span className="grow"><div className="t1">{p.name}</div><div className="t2">{fmtDate(dt(p.date))} · {p.from}–{p.to}</div></span>
    <span className={'pill ' + (p.status === 'activo' ? 'ok' : p.status === 'revocado' ? 'rd' : '')}>{p.status === 'activo' ? 'Activo' : p.status === 'revocado' ? 'Revocado' : 'Usado'}</span></button>
  return (
    <><Top title="Accesos" />
      <div className="scroll">
        <div className="h2" style={{ marginTop: 8 }}>Pases activos</div>
        {act.length ? <div className="card" style={{ padding: '0 16px' }}>{act.map((p, i) => <div key={p.id} className={i ? 'sep' : ''}>{row(p)}</div>)}</div> : <div className="card t2" style={{ textAlign: 'center', padding: 28 }}>No tienes pases activos.<br />Crea uno para tu próxima visita.</div>}
        {hist.length > 0 && <><div className="h2">Historial</div><div className="card" style={{ padding: '0 16px' }}>{hist.map((p, i) => <div key={p.id} className={i ? 'sep' : ''}>{row(p)}</div>)}</div></>}
      </div>
      <Foot><button className="btn" onClick={() => go('nuevoPase')}><Icon n="plus" /> Nuevo pase</button></Foot></>)
}

function NuevoPase({ st, up, back, replace }) {
  const [name, setName] = useState('')
  const [kind, setKind] = useState('Visita')
  const [date, setDate] = useState(null)
  const [from, setFrom] = useState('16:00')
  const [dur, setDur] = useState(4)
  const times = ['09:00', '12:00', '16:00', '19:00', '21:00']
  const to = `${String(Math.min(23, parseInt(from) + dur)).padStart(2, '0')}:00`
  const ok = name.trim() && date
  const create = () => {
    const id = 'p' + Date.now()
    up(s => ({ passes: [{ id, name: name.trim(), kind, date: date.toISOString(), from, to, status: 'activo' }, ...s.passes] }))
    replace('paseCreado', { id })
  }
  return (
    <><Top title="Nuevo pase" onBack={back} />
      <div className="scroll">
        <label className="lbl" htmlFor="nm" style={{ marginTop: 8 }}>¿Quién te visita?</label>
        <input id="nm" className="field" placeholder="Nombre de la visita" value={name} onChange={e => setName(e.target.value)} />
        <span className="lbl">Tipo</span>
        <div className="chips">{['Visita', 'Delivery', 'Servicio'].map(k => <button key={k} className={'chip' + (kind === k ? ' on' : '')} onClick={() => setKind(k)}>{k}</button>)}</div>
        <span className="lbl">Fecha</span>
        <Calendar value={date} onChange={setDate} />
        <span className="lbl">Hora de llegada</span>
        <div className="chips">{times.map(t => <button key={t} className={'chip' + (from === t ? ' on' : '')} onClick={() => setFrom(t)}>{t}</button>)}</div>
        <span className="lbl">Duración del pase</span>
        <div className="chips">{[2, 4, 8].map(h => <button key={h} className={'chip' + (dur === h ? ' on' : '')} onClick={() => setDur(h)}>{h} horas</button>)}</div>
        <div className="t3" style={{ marginTop: 12 }}>Válido {date ? fmtDate(date) : 'el día elegido'}, {from} a {to}</div>
      </div>
      <Foot><button className="btn" disabled={!ok} onClick={create}>Crear pase</button></Foot></>)
}

function PaseCreado({ st, p, tab, go, toast }) {
  const x = st.passes.find(q => q.id === p.id)
  if (!x) return null
  return (
    <><div className="top" style={{ justifyContent: 'flex-end' }}><button className="iconbtn" aria-label="Cerrar" onClick={() => tab('accesos')}><Icon n="x" /></button></div>
      <div className="scroll center" style={{ gap: 18 }}>
        <div className="big" style={{ background: 'rgba(92,185,121,.16)' }}><Icon n="check" s={48} c="var(--ok)" /></div>
        <h1 style={{ margin: 0, fontSize: 26 }}>Pase creado</h1>
        <div className="t2">{x.name} · {fmtDate(dt(x.date))}, {x.from}–{x.to}</div>
        <Qr seed={x.id + x.name} size={190} />
        <div className="t3">Muestra este código en conserjería</div>
      </div>
      <Foot>
        <button className="btn" onClick={() => toast('Pase enviado a ' + x.name)}><Icon n="share" /> Compartir pase</button>
        <button className="btn ghost" onClick={() => tab('accesos')}>Listo</button></Foot></>)
}

function PaseDetalle({ st, up, p, back, toast }) {
  const [ask, setAsk] = useState(false)
  const x = st.passes.find(q => q.id === p.id)
  if (!x) return null
  const act = x.status === 'activo'
  const revoke = () => { up(s => ({ passes: s.passes.map(q => (q.id === x.id ? { ...q, status: 'revocado' } : q)) })); setAsk(false); toast('Pase revocado. Ya no permite el acceso.') }
  return (
    <><Top title="Detalle del pase" onBack={back} />
      <div className="scroll center" style={{ gap: 14, paddingTop: 12 }}>
        <div style={{ opacity: act ? 1 : .25, filter: act ? 'none' : 'grayscale(1)' }}><Qr seed={x.id + x.name} size={190} /></div>
        <span className={'pill ' + (act ? 'ok' : 'rd')}>{act ? 'Activo' : x.status === 'revocado' ? 'Revocado' : 'Usado'}</span>
        <div className="card" style={{ width: '100%', textAlign: 'left', marginTop: 8 }}>
          {[['Visita', x.name], ['Tipo', x.kind], ['Fecha', fmtDate(dt(x.date))], ['Horario', `${x.from} – ${x.to}`]].map(([k, v], i) => <div key={k} className={'row' + (i ? ' sep' : '')} style={{ justifyContent: 'space-between', minHeight: 48 }}><span className="t2">{k}</span><span className="t1">{v}</span></div>)}
        </div>
      </div>
      {act && <Foot><button className="btn danger" onClick={() => setAsk(true)}>Revocar pase</button></Foot>}
      {ask && <Sheet onClose={() => setAsk(false)}><h2 style={{ margin: '0 0 8px', fontSize: 22 }}>¿Revocar este pase?</h2><p className="t2" style={{ margin: '0 0 20px' }}>{x.name} ya no podrá ingresar al edificio con este código.</p>
        <button className="btn" style={{ background: '#C0392B' }} onClick={revoke}>Sí, revocar</button><button className="btn ghost" onClick={() => setAsk(false)}>Cancelar</button></Sheet>}
    </>)
}

/* ---------- Encomiendas ---------- */
function Encomiendas({ st, go }) {
  const l = st.pkgs.filter(p => p.status === 'listo'), r = st.pkgs.filter(p => p.status !== 'listo')
  const row = p => <button key={p.id} className="row" onClick={() => p.status === 'listo' && go('retiro', { id: p.id })} style={{ width: '100%', background: 'none', border: 0, padding: '14px 0', textAlign: 'left', minHeight: 72 }}>
    <span className="sq"><Icon n="box" /></span><span className="grow"><div className="t1">{p.from}</div><div className="t2">{p.size} · {p.when}</div></span>
    {p.status === 'listo' ? <span className="pill am">Para retirar</span> : <span className="pill">Retirada</span>}</button>
  return (
    <><Top title="Encomiendas" />
      <div className="scroll">
        <div className="h2" style={{ marginTop: 8 }}>Para retirar</div>
        {l.length ? <div className="card" style={{ padding: '0 16px' }}>{l.map((p, i) => <div key={p.id} className={i ? 'sep' : ''}>{row(p)}</div>)}</div> : <div className="card t2" style={{ textAlign: 'center', padding: 28 }}>No tienes encomiendas pendientes.</div>}
        {r.length > 0 && <><div className="h2">Retiradas</div><div className="card" style={{ padding: '0 16px' }}>{r.map((p, i) => <div key={p.id} className={i ? 'sep' : ''}>{row(p)}</div>)}</div></>}
      </div></>)
}

function Retiro({ st, up, p, back, tab, toast }) {
  const x = st.pkgs.find(q => q.id === p.id)
  const [done, setDone] = useState(false)
  if (!x) return null
  const confirm = () => { up(s => ({ pkgs: s.pkgs.map(q => (q.id === x.id ? { ...q, status: 'retirado' } : q)) })); setDone(true) }
  if (done) return (
    <><div className="scroll center" style={{ justifyContent: 'center', gap: 16 }}>
      <div className="big" style={{ background: 'rgba(92,185,121,.16)' }}><Icon n="check" s={48} c="var(--ok)" /></div>
      <h1 style={{ margin: 0, fontSize: 26 }}>Encomienda retirada</h1><div className="t2">{x.from} · registrada en tu historial</div></div>
      <Foot><button className="btn" onClick={() => tab('enc')}>Volver a Encomiendas</button></Foot></>)
  return (
    <><Top title="Retirar encomienda" onBack={back} />
      <div className="scroll center" style={{ gap: 14, paddingTop: 12 }}>
        <div className="card" style={{ width: '100%', textAlign: 'left' }}><Item icon="box" title={x.from} sub={`${x.size} · llegó ${x.when}`} /></div>
        <div className="t2" style={{ marginTop: 8 }}>Muestra este código en conserjería</div>
        <Qr seed={'pkg' + x.id} size={170} />
        <div className="card center" style={{ width: '100%' }}><div className="t3">Código de retiro</div><div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 10 }}>{x.code}</div></div>
        <div className="t3">Retiro en conserjería · abierto 24 h</div>
      </div>
      <Foot><button className="btn" onClick={confirm}>Ya la retiré</button></Foot></>)
}

/* ---------- Finanzas ---------- */
function Finanzas({ st, go }) {
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  return (
    <><Top title="Pagos" />
      <div className="scroll">
        {total > 0 ? <div className="card" style={{ marginTop: 8 }}>
          <div className="t2">Total a pagar</div><div style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1, margin: '4px 0' }}>{money(total)}</div>
          <span className="pill am">Vence el 30 nov</span>
          <div style={{ marginTop: 14 }}>{st.bills.map(b => <div key={b.k} className="row sep" style={{ justifyContent: 'space-between', minHeight: 46 }}><span className="t2">{b.k}</span><span className="t1">{money(b.v)}</span></div>)}</div>
        </div> : <div className="card center" style={{ marginTop: 8, padding: 28, gap: 8 }}><Icon n="check" s={36} c="var(--ok)" /><div className="t1">Estás al día</div><div className="t2">No tienes pagos pendientes.</div></div>}
        <div className="h2">Pagos realizados</div>
        <div className="card" style={{ padding: '0 16px' }}>{st.paid.map((c, i) => <div key={c.id} className={i ? 'sep' : ''}><Item icon="doc" title={c.concept} sub={`${c.date} · ${c.method}`} right={<span className="t1">{money(c.v)}</span>} onClick={() => go('pagoOk', { id: c.id, view: true })} /></div>)}</div>
      </div>
      {total > 0 && <Foot><button className="btn" onClick={() => go('pagar')}>Pagar {money(total)}</button></Foot>}</>)
}

function Pagar({ st, up, back, replace }) {
  const total = st.bills.reduce((a, b) => a + b.v, 0)
  const [m, setM] = useState('Tarjeta')
  const [busy, setBusy] = useState(false)
  const opts = [['Tarjeta', 'card', 'Débito/Crédito •••• 4417'], ['Webpay', 'lock', 'Webpay Plus'], ['Transferencia', 'out', 'Banco a elección']]
  const pay = () => {
    setBusy(true)
    setTimeout(() => {
      const id = 'c' + Date.now()
      up(s => ({ paid: [{ id, concept: 'Gastos comunes noviembre', v: total, date: '21 nov 2026', method: m }, ...s.paid], bills: [] }))
      replace('pagoOk', { id })
    }, 1600)
  }
  if (busy) return <div className="scroll center" style={{ justifyContent: 'center', gap: 20 }}><div className="spin" /><div className="t1">Procesando tu pago…</div></div>
  if (!total) return <><Top title="Pagar" onBack={back} /><div className="scroll t2">No tienes pagos pendientes.</div></>
  return (
    <><Top title="Pagar" onBack={back} />
      <div className="scroll">
        <div className="card" style={{ marginTop: 8 }}><div className="t2">Gastos comunes noviembre</div><div style={{ fontSize: 36, fontWeight: 600 }}>{money(total)}</div></div>
        <div className="h2">Medio de pago</div>
        <div className="card" style={{ padding: '0 16px' }}>{opts.map(([k, i, s], idx) => <div key={k} className={idx ? 'sep' : ''}><Item icon={i} title={k} sub={s} onClick={() => setM(k)} right={<span style={{ width: 24, height: 24, borderRadius: 12, border: '2px solid ' + (m === k ? 'var(--pri)' : 'var(--line)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m === k && <span style={{ width: 12, height: 12, borderRadius: 6, background: 'var(--pri)' }} />}</span>} /></div>)}</div>
      </div>
      <Foot><button className="btn" onClick={pay}>Confirmar pago · {money(total)}</button></Foot></>)
}

function PagoOk({ st, p, tab, back, toast }) {
  const c = st.paid.find(x => x.id === p.id)
  if (!c) return null
  return (
    <><div className="top">{p.view && <button className="iconbtn" aria-label="Atrás" onClick={back}><Icon n="back" /></button>}</div>
      <div className="scroll center" style={{ gap: 14, paddingTop: 12 }}>
        <div className="big" style={{ background: 'rgba(92,185,121,.16)' }}><Icon n="check" s={48} c="var(--ok)" /></div>
        <h1 style={{ margin: 0, fontSize: 26 }}>{p.view ? 'Comprobante' : 'Pago realizado'}</h1>
        <div className="t2">{money(c.v)}</div>
        <div className="card" style={{ width: '100%', textAlign: 'left', marginTop: 8 }}>
          {[['Concepto', c.concept], ['Fecha', c.date], ['Medio', c.method], ['N° operación', '#' + String(c.id).replace(/\D/g, '').slice(-8).padStart(8, '0')]].map(([k, v], i) => <div key={k} className={'row' + (i ? ' sep' : '')} style={{ justifyContent: 'space-between', minHeight: 48 }}><span className="t2">{k}</span><span className="t1">{v}</span></div>)}
        </div>
      </div>
      <Foot><button className="btn sec" onClick={() => toast('Comprobante descargado')}>Descargar comprobante</button>{!p.view && <button className="btn ghost" onClick={() => tab('home')}>Volver al inicio</button>}</Foot></>)
}

/* ---------- Servicios ---------- */
function Servicios({ st, go }) {
  return (
    <><Top title="Servicios" />
      <div className="scroll">
        <div className="h2" style={{ marginTop: 8 }}>Reservar espacios</div>
        <div className="card" style={{ padding: '0 16px' }}>
          <Item icon="fire" title="Quincho" sub="Gratis · hasta 12 personas" onClick={() => go('reservar')} />
          <div className="sep" /><Item icon="people" title="Sala de eventos" sub="Próximamente" right={<span className="pill">Pronto</span>} />
        </div>
        <div className="h2">Solicitudes</div>
        <div className="card" style={{ padding: '0 16px' }}>
          <Item icon="tool" title="Nueva solicitud" sub="Reparaciones, reclamos y consultas" onClick={() => go('solicitud')} />
          {st.reqs.map(r => <div key={r.id}><div className="sep" /><Item icon="doc" title={r.title} sub={`${r.cat} · ${r.created}`} right={<span className={'pill ' + (r.status === 3 ? 'ok' : 'am')}>{r.status === 3 ? 'Resuelta' : STEPS[r.status]}</span>} onClick={() => go('sol', { id: r.id })} /></div>)}
        </div>
        {st.reservas.length > 0 && <><div className="h2">Mis reservas</div><div className="card" style={{ padding: '0 16px' }}>{st.reservas.map(r => <Item key={r.id} icon="cal" title={`${r.space} · ${fmtDate(dt(r.date))}`} sub={`${r.from} – ${r.to}`} right={<span className="pill ok">Confirmada</span>} />)}</div></>}
      </div></>)
}

function Reservar({ st, up, back, replace }) {
  const [date, setDate] = useState(null)
  const [slot, setSlot] = useState(null)
  const taken = date && st.reservas.some(r => key(dt(r.date)) === key(date)) ? st.reservas.filter(r => key(dt(r.date)) === key(date)).map(r => r.from) : []
  const confirm = () => {
    const id = 'r' + Date.now()
    up(s => ({ reservas: [...s.reservas, { id, space: 'Quincho', date: date.toISOString(), from: slot[0], to: slot[1] }] }))
    replace('reservaOk', { id })
  }
  return (
    <><Top title="Reservar quincho" onBack={back} />
      <div className="scroll">
        <div className="t2" style={{ margin: '4px 0 12px' }}>Gratis · hasta 12 personas · los días tachados no están disponibles</div>
        <Calendar value={date} onChange={d => { setDate(d); setSlot(null) }} busy={st.busyQuincho.map(k => { const [y, m, d] = k.split('-'); return `${y}-${+m}-${+d}` })} maxDays={60} />
        {date && <><span className="lbl">Horario · {fmtDate(date)}</span>
          <div style={{ display: 'grid', gap: 10 }}>{SLOTS.map(s => <button key={s[0]} disabled={taken.includes(s[0])} className={'slot' + (slot && slot[0] === s[0] ? ' on' : '')} onClick={() => setSlot(s)}>{s[0]} – {s[1]}</button>)}</div></>}
      </div>
      <Foot><button className="btn" disabled={!date || !slot} onClick={confirm}>Confirmar reserva</button></Foot></>)
}

function ReservaOk({ st, p, tab }) {
  const r = st.reservas.find(x => x.id === p.id)
  if (!r) return null
  return (
    <><div className="scroll center" style={{ justifyContent: 'center', gap: 14 }}>
      <div className="big" style={{ background: 'rgba(92,185,121,.16)' }}><Icon n="check" s={48} c="var(--ok)" /></div>
      <h1 style={{ margin: 0, fontSize: 26 }}>Reserva confirmada</h1>
      <div className="card" style={{ width: '100%', textAlign: 'left' }}><Item icon="fire" title={`Quincho · ${fmtDate(dt(r.date))}`} sub={`${r.from} – ${r.to}`} /></div>
      <div className="t3">Te avisaremos el día antes</div></div>
      <Foot><button className="btn" onClick={() => tab('home')}>Ir al inicio</button><button className="btn ghost" onClick={() => tab('serv')}>Ver mis reservas</button></Foot></>)
}

const CATS = [['Iluminación', 'bulb'], ['Ascensor', 'lift'], ['Agua', 'drop'], ['Estacionamiento', 'car'], ['Ruidos', 'people'], ['Otro', 'tool']]
function Solicitud({ up, back, replace }) {
  const [cat, setCat] = useState(null)
  const [txt, setTxt] = useState('')
  const send = () => {
    const id = 's' + Date.now()
    up(s => ({ reqs: [{ id, cat, title: txt.trim().slice(0, 40), status: 0, created: 'Hoy' }, ...s.reqs] }))
    replace('solOk', { id })
  }
  return (
    <><Top title="Nueva solicitud" onBack={back} />
      <div className="scroll">
        <span className="lbl" style={{ marginTop: 8 }}>¿Sobre qué es?</span>
        <div className="chips">{CATS.map(([c, i]) => <button key={c} className={'chip' + (cat === c ? ' on' : '')} onClick={() => setCat(c)}><Icon n={i} s={18} />{c}</button>)}</div>
        <label className="lbl" htmlFor="d">Cuéntanos qué pasa</label>
        <textarea id="d" className="field" rows={5} placeholder="Ej: La luz del pasillo del piso 12 no enciende" value={txt} onChange={e => setTxt(e.target.value)} />
      </div>
      <Foot><button className="btn" disabled={!cat || txt.trim().length < 5} onClick={send}>Enviar solicitud</button></Foot></>)
}

function SolOk({ st, p, tab, replace, go }) {
  const r = st.reqs.find(x => x.id === p.id)
  if (!r) return null
  return (
    <><div className="scroll center" style={{ justifyContent: 'center', gap: 14 }}>
      <div className="big" style={{ background: 'rgba(92,185,121,.16)' }}><Icon n="check" s={48} c="var(--ok)" /></div>
      <h1 style={{ margin: 0, fontSize: 26 }}>Solicitud enviada</h1>
      <div className="t2">Te avisaremos cada vez que cambie su estado.</div>
      <div className="card" style={{ width: '100%', textAlign: 'left' }}><Item icon="tool" title={r.title} sub={`${r.cat} · Recibida`} /></div></div>
      <Foot><button className="btn" onClick={() => replace('sol', { id: r.id })}>Ver estado</button><button className="btn ghost" onClick={() => tab('home')}>Ir al inicio</button></Foot></>)
}

function SolDetalle({ st, up, p, back }) {
  const r = st.reqs.find(x => x.id === p.id)
  if (!r) return null
  return (
    <><Top title="Estado de solicitud" onBack={back} />
      <div className="scroll">
        <div className="card" style={{ marginTop: 8 }}><div className="t3">{r.cat} · {r.created}</div><div className="t1" style={{ marginTop: 4 }}>{r.title}</div></div>
        <div className="h2">Seguimiento</div>
        <div className="tl">{STEPS.map((s, i) => <div key={s} className={'it ' + (i < r.status ? 'done' : i === r.status ? 'cur' : '')}><b /><div className="t1" style={{ color: i > r.status ? 'var(--dim)' : undefined }}>{s}</div>{i === r.status && r.status < 3 && <div className="t2">Estado actual</div>}</div>)}</div>
        {r.status < 3 && <button className="btn ghost" style={{ marginTop: 8, fontSize: 13, height: 40 }} onClick={() => up(s => ({ reqs: s.reqs.map(q => (q.id === r.id ? { ...q, status: q.status + 1 } : q)) }))}>Demo: avanzar estado (solo para el moderador)</button>}
      </div></>)
}

/* ---------- Avisos y Perfil ---------- */
function Avisos({ st, up, back }) {
  useEffect(() => { up(s => ({ notices: s.notices.map(n => ({ ...n, new: false })) })) }, [])
  return (
    <><Top title="Avisos" onBack={back} />
      <div className="scroll"><div className="card" style={{ padding: '0 16px', marginTop: 8 }}>{st.notices.map((n, i) => <div key={n.id} className={i ? 'sep' : ''}><Item icon="bell" title={n.t} sub={n.s} /></div>)}</div></div></>)
}

function Perfil({ st, up, back, reset }) {
  const rows = [['pases', 'Pases y visitas'], ['paq', 'Encomiendas'], ['fin', 'Gastos comunes']]
  return (
    <><Top title="Perfil" onBack={back} />
      <div className="scroll">
        <div className="card row" style={{ marginTop: 8 }}><span className="sq" style={{ width: 56, height: 56, borderRadius: 28 }}><Icon n="user" s={28} /></span><div><div className="t1">Residente</div><div className="t2">Torre Alameda · Depto 1204</div></div></div>
        <div className="h2">Notificaciones</div>
        <div className="card" style={{ padding: '0 16px' }}>{rows.map(([k, l], i) => <div key={k} className={'row' + (i ? ' sep' : '')} style={{ minHeight: 60 }}><span className="grow t1">{l}</span><Switch label={l} on={st.sw[k]} onChange={() => up(s => ({ sw: { ...s.sw, [k]: !s.sw[k] } }))} /></div>)}</div>
        <div className="h2">Prototipo</div>
        <button className="btn sec" onClick={reset}>Restablecer demo (volver al inicio)</button>
      </div></>)
}
