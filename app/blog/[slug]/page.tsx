import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import Footer from '@/components/Footer'
import ClickableTitle from '@/components/ClickableTitle'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  return {
    title: siteConfig.meta.titleTemplate.replace('%s', post.title),
    description: post.excerpt,
  }
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const processedContent = await remark().use(remarkHtml).process(post.content)
  const contentHtml = processedContent.toString()

  return (
    <main 
      className="flex min-h-screen items-center justify-center antialiased"
      style={{
        backgroundColor: siteConfig.colors.background,
        color: siteConfig.colors.foreground,
      }}
    >
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="mb-8">
          <ClickableTitle href="/blog" />
        </div>

        <article className="mb-12">
          <Link
            href="/blog"
            className="mb-6 inline-block text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Blog
          </Link>
          <h1 className="mb-4 text-4xl font-normal text-white">{post.title}</h1>
          <time className="mb-8 block text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </time>
          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-white prose-a:underline prose-strong:text-white prose-code:text-gray-300 prose-code:bg-gray-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-300"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>

        {siteConfig.footer.enabled && <Footer />}
      </div>
    </main>
  )
}

