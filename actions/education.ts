'use server'

import { prisma } from '@/lib/db'
import { EducationArticleDisplay } from '@/types'

export async function getPublishedArticles(): Promise<EducationArticleDisplay[]> {
  const articles = await prisma.educationArticle.findMany({
    where: { published: true },
    orderBy: { title: 'asc' },
  })

  return articles.map(article => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category,
    content: article.content,
    lastReviewedDate: article.lastReviewedDate,
    published: article.published,
  }))
}

export async function getArticleBySlug(slug: string): Promise<EducationArticleDisplay | null> {
  const article = await prisma.educationArticle.findUnique({
    where: { slug, published: true },
  })

  if (!article) return null

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    category: article.category,
    content: article.content,
    lastReviewedDate: article.lastReviewedDate,
    published: article.published,
  }
}

export async function getArticleCategories(): Promise<string[]> {
  const articles = await prisma.educationArticle.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ['category'],
  })

  return articles.map(a => a.category)
}
