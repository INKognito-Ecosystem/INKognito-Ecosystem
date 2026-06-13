import { Helmet } from 'react-helmet-async'

export default function Seo({ title, description, image, type = 'website', siteName = 'INKognito Tattoo Studio', canonical, noindex = false, jsonLd }) {
  const absoluteImage = image
    ? image.startsWith('http')
      ? image
      : `${window.location.origin}${image}`
    : null

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="es_CO" />
      <meta property="og:site_name" content={siteName} />
      {canonical && <meta property="og:url" content={canonical} />}
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
