'use server'

import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { EducationArticleSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

// Claim management
export async function getPendingClaims() {
  await requireAdmin()

  return prisma.claim.findMany({
    where: { status: 'PENDING_REVIEW' },
    include: {
      carrier: true,
      metadata: true,
      timeline: true,
      outcome: true,
      user: {
        select: { email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function publishClaim(claimId: string) {
  await requireAdmin()

  await prisma.claim.update({
    where: { id: claimId },
    data: {
      status: 'PUBLISHED',
      flagReason: null,
    },
  })

  revalidatePath('/admin/submissions')
  revalidatePath('/claims')

  return { success: true }
}

export async function rejectClaim(claimId: string, reason: string) {
  await requireAdmin()

  await prisma.claim.update({
    where: { id: claimId },
    data: {
      status: 'REJECTED',
      flagReason: reason,
    },
  })

  revalidatePath('/admin/submissions')

  return { success: true }
}

export async function deleteClaim(claimId: string) {
  await requireAdmin()

  await prisma.claim.delete({
    where: { id: claimId },
  })

  revalidatePath('/admin/submissions')
  revalidatePath('/claims')

  return { success: true }
}

// Education article management
export async function getAllArticles() {
  await requireAdmin()

  return prisma.educationArticle.findMany({
    orderBy: { title: 'asc' },
  })
}

export async function createArticle(data: unknown) {
  await requireAdmin()

  const validationResult = EducationArticleSchema.safeParse(data)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0]?.message || 'Validation failed' }
  }

  const { slug, title, category, content, published } = validationResult.data

  // Check for duplicate slug
  const existing = await prisma.educationArticle.findUnique({
    where: { slug },
  })

  if (existing) {
    return { error: 'An article with this slug already exists' }
  }

  try {
    const article = await prisma.educationArticle.create({
      data: {
        slug,
        title,
        category,
        content,
        published,
        lastReviewedDate: new Date(),
      },
    })

    revalidatePath('/admin/education')
    revalidatePath('/education')

    return { success: true, articleId: article.id }
  } catch (error) {
    console.error('Error creating article:', error)
    return { error: 'Failed to create article' }
  }
}

export async function updateArticle(articleId: string, data: unknown) {
  await requireAdmin()

  const validationResult = EducationArticleSchema.safeParse(data)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0]?.message || 'Validation failed' }
  }

  const { slug, title, category, content, published } = validationResult.data

  // Check for duplicate slug (excluding current article)
  const existing = await prisma.educationArticle.findFirst({
    where: {
      slug,
      NOT: { id: articleId },
    },
  })

  if (existing) {
    return { error: 'An article with this slug already exists' }
  }

  try {
    await prisma.educationArticle.update({
      where: { id: articleId },
      data: {
        slug,
        title,
        category,
        content,
        published,
        lastReviewedDate: new Date(),
      },
    })

    revalidatePath('/admin/education')
    revalidatePath('/education')
    revalidatePath(`/education/${slug}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating article:', error)
    return { error: 'Failed to update article' }
  }
}

export async function deleteArticle(articleId: string) {
  await requireAdmin()

  await prisma.educationArticle.delete({
    where: { id: articleId },
  })

  revalidatePath('/admin/education')
  revalidatePath('/education')

  return { success: true }
}

// Dashboard stats
export async function getAdminStats() {
  await requireAdmin()

  const [
    totalClaims,
    pendingClaims,
    openReports,
    totalUsers,
  ] = await Promise.all([
    prisma.claim.count(),
    prisma.claim.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.report.count({ where: { status: 'OPEN' } }),
    prisma.user.count(),
  ])

  return {
    totalClaims,
    pendingClaims,
    openReports,
    totalUsers,
  }
}
