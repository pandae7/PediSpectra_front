'use client'

import { useParams } from 'next/navigation'
import { ArrowLeft, Newspaper } from 'lucide-react'
import { getNewsArticle } from '@/lib/mock-data'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function NewsArticlePage() {
  const params = useParams()
  const id = params.id as string
  const article = getNewsArticle(id)

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack backHref="/" backLabel="Home" />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <Newspaper className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          {article ? article.title : 'Article not found'}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {article
            ? 'The full article is coming soon. This is a preview in our demo — the complete story will be published here shortly.'
            : 'This article is not available in the demo.'}
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </a>
      </div>
      <Footer />
    </div>
  )
}