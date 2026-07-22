import { Helmet } from 'react-helmet-async'

const PageMeta = ({ title, description }) => {
  const siteName = 'PMC College Portal'
  const fullTitle = title ? `${title} | ${siteName}` : siteName

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description || 'PMC College — Pokhara Management College'} />
      <meta name="theme-color" content="#1565C0" />
    </Helmet>
  )
}

export default PageMeta