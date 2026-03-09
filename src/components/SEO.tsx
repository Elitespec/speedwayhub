import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  path?: string
  type?: 'website' | 'article'
  image?: string
  keywords?: string
}

export const SEO: React.FC<SEOProps> = ({
  title = 'SpeedwayHub NZ - New Zealand Speedway Directory',
  description = 'Find every speedway track, race night, driver, and event across New Zealand. Your complete NZ speedway directory for fans, drivers, and promoters.',
  path = '',
  type = 'website',
  image = 'https://speedwayhub.nz/photos/western-spring.webp',
  keywords = 'speedway, New Zealand speedway, NZ speedway, sprintcars, stockcars, midgets, speedway tracks, racing, motorsport',
}) => {
  const fullTitle = title.includes('SpeedwayHub') ? title : `${title} | SpeedwayHub NZ`
  const canonicalUrl = `https://speedwayhub.nz${path}`

  useEffect(() => {
    // Update document title
    document.title = fullTitle

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', keywords)

    // Update or create canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'SpeedwayHub NZ' },
      { property: 'og:locale', content: 'en_NZ' },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    ]

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    })

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ]

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    })
  }, [fullTitle, description, canonicalUrl, type, image, keywords])

  return null
}
