const d = (m, day) => new Date(2026, m - 1, day).toISOString()
export const initial = () => ({
  onboarded: false,
  sw: { pases: true, paq: true, fin: false },
  passes: [
    { id: 'p1', name: 'Pedro Rojas', kind: 'Visita', date: d(11, 22), from: '16:00', to: '20:00', status: 'activo' },
    { id: 'p2', name: 'María Díaz', kind: 'Servicio', date: d(11, 24), from: '09:00', to: '13:00', status: 'activo' },
    { id: 'p0', name: 'Rappi · pedido', kind: 'Delivery', date: d(11, 18), from: '21:10', to: '21:40', status: 'usado' },
  ],
  pkgs: [
    { id: 'k1', from: 'Mercado Libre', when: 'Hoy 10:42', code: '4827', status: 'listo', size: 'Caja mediana' },
    { id: 'k2', from: 'Amazon', when: 'Ayer 18:15', code: '9153', status: 'listo', size: 'Sobre' },
    { id: 'k0', from: 'Falabella', when: '12 nov', code: '3310', status: 'retirado', size: 'Caja grande' },
  ],
  bills: [
    { k: 'Gasto común noviembre', v: 98000 }, { k: 'Fondo de reserva', v: 9800 },
    { k: 'Agua caliente', v: 22350 }, { k: 'Estacionamiento B-14', v: 12200 },
  ],
  paid: [{ id: 'c0', concept: 'Gastos comunes octubre', v: 139800, date: '28 oct 2026', method: 'Webpay' }],
  reservas: [{ id: 'r1', space: 'Quincho', date: d(11, 28), from: '18:00', to: '23:00' }],
  busyQuincho: ['2026-11-22', '2026-11-27', '2026-12-5'],
  reqs: [{ id: 's0', cat: 'Ascensor', title: 'Ruido en ascensor 2', status: 3, created: '2 nov' }],
  notices: [
    { id: 'n1', t: 'Corte de agua programado', s: 'Martes 24 nov, 10:00–13:00', new: true },
    { id: 'n2', t: 'Asamblea de copropietarios', s: 'Jueves 3 dic, 19:30 · Sala de eventos', new: true },
    { id: 'n3', t: 'Mantención de ascensores', s: 'Realizada el 10 nov', new: false },
  ],
})
export const SLOTS = [['10:00', '14:00'], ['14:00', '18:00'], ['18:00', '23:00']]
export const STEPS = ['Recibida', 'En revisión', 'Asignada a conserjería', 'Resuelta']
export const SPACES = [{ n: 'Quincho', i: 'fire', s: 'Gratis · hasta 12 personas' }]
