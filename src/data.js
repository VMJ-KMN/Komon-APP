const t = (m, d) => new Date(2026, m - 1, d).toISOString()
export const initial = () => ({
  onboarded: false,
  sw: { pases: true, paq: true, fin: false },
  passes: [
    { id: 'p1', name: 'Técnico ClimaSur', kind: 'Técnico', when: '15:00 - 18:00', pin: '7743', rut: '12.345.678-9', created: 'Hoy, 12:10', valid: 'Hoy, 18:00', status: 'vigente' },
    { id: 'p2', name: 'Pedro Rojas', kind: 'Visita', when: '1 Día', pin: '7743', rut: '5.323.567-3', created: 'Hoy, 18:30', valid: 'Hoy, 23:59', status: 'vigente' },
    { id: 'p0', name: 'María Díaz', kind: 'Visita', when: '1 Día', pin: '2208', rut: '—', created: '14 nov, 17:05', valid: '14 nov, 23:59', status: 'usado' },
  ],
  pkgs: [
    { id: 'k1', from: 'Mercado Libre', info: 'Caja mediana - 1,8 kg - 29 oct', pin: '8421', status: 'porteria' },
    { id: 'k2', from: 'Falabella', info: 'Sobre - 0,3 kg - 30 oct', pin: '3306', status: 'porteria' },
    { id: 'k0', from: 'Amazon', info: 'Caja pequeña - 0,9 kg - 12 oct', pin: '5190', status: 'retirado' },
  ],
  bills: [
    { k: 'Gasto común ordinario', s: 'Noviembre 2026', v: 98000, i: 'building' },
    { k: 'Fondo de reserva', s: '10% del gasto común', v: 9800, i: 'shield' },
    { k: 'Agua', s: '12 m³ consumidos', v: 21350, i: 'drop' },
    { k: 'Gas', s: '6 m³ consumidos', v: 13200, i: 'flame' },
  ],
  paid: [
    { id: 'c1', concept: 'Octubre 2026', v: 138900, date: '8 nov 2026, 10:42', short: '8 nov', method: 'Tarjeta ····4821', ref: 'SRN-001377' },
    { id: 'c2', concept: 'Septiembre 2026', v: 131200, date: '7 oct 2026, 09:15', short: '7 oct', method: 'Transferencia', ref: 'SRN-001209' },
  ],
  reservas: [{ id: 'r0', space: 'Quincho', date: t(11, 21), block: 'Almuerzo', from: '13:00', to: '17:00', ref: 'RSV-0412' }],
  reqs: [{ id: 's0', cat: 'Mantención de áreas comunes', title: 'Luz quemada en pasillo', status: 1, created: '18 nov', ref: 'SOL-0087' }],
  notices: [
    { id: 'n1', eyebrow: 'AVISOS', t: 'Comunicado Oficial', s: 'Corte de agua programado mañana de 10:00 a 14:00 hrs por mantención de la red matriz.', pri: true },
    { id: 'n2', eyebrow: 'ASAMBLEA', t: 'Asamblea de copropietarios', s: 'Jueves 3 dic, 19:30 · Sala multiuso.' },
    { id: 'n3', eyebrow: 'MANTENCIÓN', t: 'Ascensores revisados', s: 'La mantención del 10 nov se completó sin novedades.' },
  ],
})
export const BLOCKS = [['Mañana', '09:00', '13:00'], ['Almuerzo', '13:00', '17:00'], ['Noche', '18:00', '23:00']]
export const STEPS = ['Recibida', 'En revisión', 'Asignada', 'Resuelta']
