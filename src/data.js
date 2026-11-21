const T = '#c5c5c5'
export const initial = () => ({
  onboarded: false,
  sw: { pases: true, paq: true, fin: false, face: false },
  passes: [
    { id: 'p1', name: 'Técnico ClimaSur', kind: 'Técnico', when: '15:00 - 18:00', pin: '7743', rut: '12.345.678-9', created: 'Hoy, 12:10', valid: 'Hoy, 18:00', status: 'vigente' },
    { id: 'p2', name: 'Pedro Rojas', kind: 'Visita', when: '1 Día', pin: '7743', rut: '5.323.567-3', created: 'Hoy, 18:30', valid: 'Hoy, 23:59', status: 'vigente' },
    { id: 'h1', name: 'Técnico ClimaSur', kind: 'Técnico', when: '15:00 - 18:00', pin: '4410', rut: '12.345.678-9', created: '12 nov, 14:20', valid: '12 nov, 18:00', status: 'usado' },
    { id: 'h2', name: 'Pedro Rojas', kind: 'Visita', when: '1 Día', pin: '6620', rut: '5.323.567-3', created: '10 nov, 11:02', valid: '10 nov, 23:59', status: 'revocado' },
    { id: 'h3', name: 'Delivery Pedidos', kind: 'Delivery', when: '20:10', pin: '9031', rut: '—', created: '8 nov, 20:05', valid: '8 nov, 21:00', status: 'usado' },
    { id: 'h4', name: 'Marta Soto', kind: 'Visita', when: '3 Días', pin: '1275', rut: '—', created: '1 nov, 10:00', valid: '4 nov, 23:59', status: 'expirado' },
  ],
  pkgs: [
    { id: 'k1', from: 'Mercado Libre', info: 'Caja mediana - 1,8 kg - 29 oct', pin: '8421', status: 'porteria' },
    { id: 'k2', from: 'Mercado Libre', info: 'Caja mediana - 1,8 kg - 29 oct', pin: '3951', status: 'porteria' },
    { id: 'k0', from: 'Falabella', info: 'Bolsa - 0,6 kg - 24 oct', pin: '3373', status: 'retirado' },
  ],
  bills: [
    { k: 'Gasto común ordinario', s: 'Noviembre 2026', l: 'Según prorrateo del depto', v: 98000, i: 'building', g: 0 },
    { k: 'Fondo de reserva', s: '10% del gasto común', l: '10% del gasto común', v: 9800, i: 'shield', g: 0 },
    { k: 'Agua', s: '12 m³ consumidos', l: 'Lectura 1.284 → 1.296 m³', v: 21350, i: 'drop', g: 1 },
    { k: 'Gas', s: '6 m³ consumidos', l: 'Lectura 540 → 546 m³', v: 13200, i: 'flame', g: 1 },
  ],
  paid: [
    { id: 'c1', concept: 'Octubre 2026', v: 138900, date: '8 nov 2026, 10:42', short: '8 nov', method: 'Tarjeta ····4821', m: 'Tarjeta', ref: 'SRN-001377' },
    { id: 'c2', concept: 'Septiembre 2026', v: 131200, date: '7 oct 2026, 09:15', short: '7 oct', method: 'Transferencia', m: 'Transferencia', ref: 'SRN-001209' },
    { id: 'c3', concept: 'Agosto 2026', v: 129750, date: '9 sep 2026, 18:30', short: '9 sep', method: 'Tarjeta ····4821', m: 'Tarjeta', ref: 'SRN-001051' },
    { id: 'c4', concept: 'Julio 2026', v: 135400, date: '12 ago 2026, 12:05', short: '12 ago', method: 'Tarjeta ····4821', m: 'Con mora', ref: 'SRN-000932', mora: true },
    { id: 'c5', concept: 'Junio 2026', v: 127300, date: '6 jul 2026, 09:50', short: '6 jul', method: 'Tarjeta ····4821', m: 'Tarjeta', ref: 'SRN-000811' },
    { id: 'c6', concept: 'Mayo 2026', v: 126800, date: '8 jun 2026, 10:10', short: '8 jun', method: 'Tarjeta ····4821', m: 'Tarjeta', ref: 'SRN-000703' },
  ],
  reservas: [{ id: 'r0', space: 'Quincho', date: new Date(2026, 10, 21).toISOString(), block: 'Almuerzo', from: '13:00', to: '17:00', ref: 'RSV-0412' }],
  reqs: [
    { id: 's1', cat: 'Mantención de áreas comunes', title: 'Luz quemada en pasillo', desc: 'La luz del pasillo del piso 12 lleva 3 días apagada.', status: 1, created: '12 nov', ref: '0231', log: ['12 nov, 10:42', '13 nov, 09:15 · Administración'] },
    { id: 's2', cat: 'Problema en mi departamento', title: 'Filtración en baño', desc: 'Gotera en el cielo del baño principal desde ayer.', status: 0, created: '14 nov', ref: '0235', log: ['14 nov, 08:30'] },
    { id: 's3', cat: 'Convivencia o ruidos', title: 'Ruido en horario nocturno', desc: 'Música alta pasadas las 00:00 en el piso superior.', status: 2, created: '3 nov', ref: '0218', log: ['3 nov, 00:40', '3 nov, 09:00 · Administración', '4 nov, 12:15'] },
  ],
  notices: [
    { id: 'n1', kind: 'urg', eyebrow: 'URGENTE', date: '29 De Octubre', t: 'Comunicado Oficial', s: 'Corte de agua programado mañana de 10:00 a 14:00 hrs por mantención de la red matriz.' },
    { id: 'n2', kind: 'com', eyebrow: 'Comunicado', date: '22 De Octubre', t: 'Asamblea de copropietarios', s: 'Se cita a asamblea el jueves 5 de noviembre a las 19:30 hrs en el salón común para revisar el presupuesto 2027, conforme a la Ley 21.442.' },
    { id: 'n3', kind: 'man', t: 'Reparación de luminarias en hall', badge: 'Programada', date: 'miércoles, 4 de noviembre', time: '', s: '' },
    { id: 'n4', kind: 'man', t: 'Reparación de luminarias en hall', badge: 'Finalizada', date: 'jueves, 22 de octubre', time: '10:00 - 13:00', s: 'Recambio de luminarias LED en hall de acceso.' },
  ],
})
export const BLOCKS = [['Mañana', '09:00', '13:00'], ['Almuerzo', '13:00', '17:00'], ['Noche', '18:00', '23:00']]
export const STEPS = ['Recibida', 'En revisión', 'Resuelta']
export const SHORT = { 'Mantención de áreas comunes': 'Áreas comunes', 'Problema en mi departamento': 'Mi departamento', 'Convivencia o ruidos': 'Convivencia', 'Consulta o sugerencia': 'Consulta' }
