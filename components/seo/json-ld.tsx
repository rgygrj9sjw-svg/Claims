const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://insuranceclaimindex.com'

interface OrganizationJsonLdProps {
  className?: string
}

export function OrganizationJsonLd({ className }: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Insurance Claim Index',
    description: 'Michigan insurance claim experience sharing platform providing educational resources and crowdsourced claim data',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    areaServed: {
      '@type': 'State',
      name: 'Michigan',
      containedIn: {
        '@type': 'Country',
        name: 'United States',
      },
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      className={className}
    />
  )
}

interface ArticleJsonLdProps {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified: string
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: `${BASE_URL}/education/${slug}`,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Organization',
      name: 'Insurance Claim Index',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Insurance Claim Index',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/education/${slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface FAQJsonLdProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface WebPageJsonLdProps {
  title: string
  description: string
  url: string
}

export function WebPageJsonLd({ title, description, url }: WebPageJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Insurance Claim Index',
      url: BASE_URL,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
