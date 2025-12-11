import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import Footer from '@/components/Footer'
import ClickableTitle from '@/components/ClickableTitle'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'

// Helper to convert markdown to html
async function markdownToHtml(markdown: string) {
  // Remove the first H1 heading if it exists at the start of the content
  // This prevents double titles since we render the title in the page layout
  const cleanMarkdown = markdown.trim().replace(/^#\s+[^\n]+(\n|$)/, '');

  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(cleanMarkdown)

  return result.toString()
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { getSiteConfig } = await import('@/lib/settings');
  const siteConfig = await getSiteConfig();
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: siteConfig.meta.titleTemplate.replace('%s', post.title),
    description: post.content.slice(0, 150), // Simple excerpt
  }
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>
}) {
  const { getSiteConfig } = await import('@/lib/settings');
  const siteConfig = await getSiteConfig();
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { attachments: true }
  });

  if (!post) {
    notFound()
  }

  const contentHtml = await markdownToHtml(post.content);

  // Adhoc mapping for now
  const postDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const tags = [] as string[]; // Placeholder

  return (
    <main
      className="flex min-h-screen items-center justify-center antialiased"
      style={{
        backgroundColor: siteConfig.colors.background,
        color: siteConfig.colors.foreground,
      }}
    >
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="mb-12 text-center">
          <ClickableTitle href="/" siteConfig={siteConfig} />
        </div>

        <article>
          <header className="mb-10 text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <time>{postDate}</time>
            </div>
            <h1 className="mb-6 text-3xl font-bold leading-tight md:text-4xl text-white">
              {post.title}
            </h1>
            {tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-3 py-1 text-xs"
                    style={{
                      borderColor: siteConfig.colors.button.border,
                      backgroundColor: siteConfig.colors.button.background,
                      color: siteConfig.colors.text.secondary,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div
            className="prose prose-invert prose-lg mx-auto max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline [&_a:hover]:underline prose-code:text-blue-300 prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-gray-800"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>

        {/* Attachments Section */}
        {post.attachments.length > 0 && (
          <div className="mt-12 border-t border-gray-800 pt-8">
            <h3 className="text-xl font-semibold mb-4 text-white">Attachments</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {post.attachments.map((file: { id: string; filename: string; url: string; size: number }) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-800 bg-gray-900/40 hover:bg-gray-800/60 hover:border-gray-700 transition-all group"
                >
                  <div className="shrink-0 w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs font-bold uppercase group-hover:bg-gray-700 transition-colors">
                    {file.filename.split('.').pop()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                      {file.filename}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 border-t border-gray-800 pt-12">

          <div className="text-center">
            <Link
              href="/blog"
              className="inline-block rounded-lg border border-gray-800/50 bg-gray-900/40 px-6 py-2 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-gray-700/50 hover:bg-gray-800/60 hover:text-white"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>

        {siteConfig.footer.enabled && <Footer siteConfig={siteConfig} />}
      </div>
    </main>
  )
}
