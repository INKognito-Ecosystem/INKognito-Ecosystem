import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Seo from '../Seo'

export default function LegalPage({ title, updated, description, children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Seo
        title={`${title} | INKognito`}
        description={description}
        canonical={`${import.meta.env.VITE_SITE_URL}${window.location.pathname}`}
      />

      <div className="pt-8 px-4 max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a INKognito
        </Link>
      </div>

      <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2">
          {title}
        </h1>
        <p className="text-zinc-500 text-sm mb-10">Última actualización: {updated}</p>

        <div className="space-y-8 text-gray-300 font-light leading-relaxed
                        [&_h2]:text-white [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-lg [&_h2]:mb-3
                        [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-zinc-300 [&_a]:underline
                        [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse
                        [&_th]:text-left [&_th]:border-b [&_th]:border-zinc-700 [&_th]:pb-2 [&_th]:pr-4
                        [&_td]:border-b [&_td]:border-zinc-800 [&_td]:py-2 [&_td]:pr-4">
          {children}
        </div>
      </section>
    </div>
  )
}
