export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug } from '@/actions/education'
import { Disclaimer } from '@/components/disclaimer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Simple markdown-like rendering
function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: string[] = []
  let listKey = 0

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-1 mb-4 text-gray-600">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
      currentList = []
    }
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
          {trimmed.slice(4)}
        </h3>
      )
    } else if (trimmed.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4">
          {trimmed.slice(3)}
        </h2>
      )
    } else if (trimmed.startsWith('# ')) {
      flushList()
      // Skip title as we show it separately
    }
    // List items
    else if (trimmed.startsWith('- ')) {
      currentList.push(trimmed.slice(2))
    }
    // Bold text and paragraphs
    else if (trimmed.length > 0) {
      flushList()
      const processed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      elements.push(
        <p
          key={index}
          className="text-gray-600 mb-4"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      )
    }
  })

  flushList()
  return elements
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link href="/education">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Education Library
        </Button>
      </Link>

      {/* Article header */}
      <article>
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {article.category}
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              Last reviewed:{' '}
              {new Date(article.lastReviewedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </header>

        {/* Disclaimer at top */}
        <div className="mb-8">
          <Disclaimer variant="compact" />
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {renderContent(article.content)}
        </div>

        {/* Disclaimer at bottom */}
        <div className="mt-12">
          <Disclaimer />
        </div>
      </article>
    </div>
  )
}
