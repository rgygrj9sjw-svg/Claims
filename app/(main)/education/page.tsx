export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getPublishedArticles, getArticleCategories } from '@/actions/education'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Disclaimer } from '@/components/disclaimer'
import { BookOpen, Calendar } from 'lucide-react'

export default async function EducationPage() {
  const [articles, categories] = await Promise.all([
    getPublishedArticles(),
    getArticleCategories(),
  ])

  // Group articles by category
  const articlesByCategory = categories.reduce((acc, category) => {
    acc[category] = articles.filter(a => a.category === category)
    return acc
  }, {} as Record<string, typeof articles>)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Education Library</h1>
        <p className="text-gray-600">
          Learn about different types of insurance claims, the claims process,
          and what to expect when filing a claim.
        </p>
      </div>

      <div className="mb-8">
        <Disclaimer variant="compact" />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <a
            key={category}
            href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-block"
          >
            <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
              {category}
            </Badge>
          </a>
        ))}
      </div>

      {/* Articles by Category */}
      <div className="space-y-12">
        {Object.entries(articlesByCategory).map(([category, categoryArticles]) => (
          <section
            key={category}
            id={category.toLowerCase().replace(/\s+/g, '-')}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryArticles.map(article => (
                <Link key={article.id} href={`/education/${article.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{article.title}</CardTitle>
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Updated{' '}
                              {new Date(article.lastReviewedDate).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {article.content
                          .replace(/^#.*$/gm, '')
                          .replace(/\*\*/g, '')
                          .replace(/\n+/g, ' ')
                          .trim()
                          .slice(0, 150)}
                        ...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No articles available yet.</p>
        </div>
      )}
    </div>
  )
}
