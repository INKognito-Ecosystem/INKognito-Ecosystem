import { Helmet } from 'react-helmet-async'

export default function Seo({ title, description, image, type = 'website' }) {
  // og:image debe ser URL absoluta; al renderizar en cliente usamos el origin actual
  const absoluteImage = image
    ? image.startsWith('http')
      ? image
      : `${window.location.origin}${image}`
    : null

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="es_CO" />
      <meta property="og:site_name" content="INKognito Tattoo Studio" />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
    </Helmet>
  )
}
