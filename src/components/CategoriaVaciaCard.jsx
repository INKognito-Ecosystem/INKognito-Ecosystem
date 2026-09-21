// Tarjeta UNIVERSAL de "categoría sin productos" (2026-09-21, Jose: "cuando
// una categoría no tiene producto... lo único correcto que dice es 'sin
// stock por el momento', y quizás 'próximamente disponible'; la descripción y
// el botón de wpp sobran, la card debe ser universal pues son multitenant").
//
// Antes cada módulo (Supply, Store ×8, Suple, Gym, Aprende) tenía su propia
// copia con un texto largo ("Déjanos tu número y te avisamos...") y un botón de
// WhatsApp "Avisarme cuando haya stock": con vendedores propios ya no es
// INKognito quien va a "tener stock" de esa categoría, así que ese
// ofrecimiento era incorrecto. Ahora es una sola pieza con dos líneas fijas;
// cada página solo le pasa las clases de su tema (borde/fondo/colores) y, si
// hace falta, el margen lateral — el contenido es idéntico en todos los módulos.
export default function CategoriaVaciaCard({
  className = 'border border-zinc-200 bg-zinc-50',
  labelClassName = 'text-zinc-500',
  titleClassName = 'text-zinc-900',
}) {
  return (
    <div role="status" className={`rounded-2xl p-10 text-center ${className}`}>
      <p className={`${labelClassName} text-[10px] font-bold uppercase tracking-widest mb-2`}>Sin stock por el momento</p>
      <p className={`${titleClassName} text-lg font-black uppercase`}>Próximamente disponible</p>
    </div>
  )
}
