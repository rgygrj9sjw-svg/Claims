'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { deleteArticle } from '@/actions/admin'
import { Pencil, Trash2 } from 'lucide-react'

interface ArticleActionsProps {
  articleId: string
}

export function ArticleActions({ articleId }: ArticleActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return
    }
    setIsDeleting(true)
    await deleteArticle(articleId)
    router.refresh()
    setIsDeleting(false)
  }

  return (
    <div className="flex gap-1">
      <Link href={`/admin/education/${articleId}`}>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
