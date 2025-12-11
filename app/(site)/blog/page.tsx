import Link from 'next/link'
import { getSiteConfig } from '@/lib/settings'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogFilters from '@/components/BlogFilters'

export async function generateMetadata() {
  const siteConfig = await getSiteConfig()
  return {
    title: siteConfig.meta.titleTemplate.replace('%s', siteConfig.blog.title),
    description: siteConfig.blog.description,
  }
}

type SearchParams = {
  search?: string
  tag?: string
  year?: string
  hasFiles?: string
  page?: string
}

interface Attachment {
  id: string
  filename: string
  url: string
  type: string
  size: number
  createdAt: Date
  postId: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  createdAt: Date
  updatedAt: Date
  attachments: Attachment[]
  date: string
  excerpt: string
  tags: string[]
}

export default async function BlogPage(props: {
  searchParams: Promise<SearchParams>
}) {
  const siteConfig = await getSiteConfig();
  const searchParams = await props.searchParams;

  // Fetch DB Links for Header
  const links = await prisma.link.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  }).catch(() => []);


  // Fetch Posts
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { attachments: true }
  });

  const allPosts: BlogPost[] = dbPosts.map((p: any) => ({
    ...p,
    date: p.createdAt.toISOString(),
    excerpt: p.content.slice(0, 150) + '...',
    tags: [] as string[],
  }));

  const searchQuery = searchParams.search || ''
  const selectedTag = searchParams.tag || ''
  const selectedYear = searchParams.year || ''
  const hasFiles = searchParams.hasFiles || ''
  const currentPage = parseInt(searchParams.page || '1', 10)
  const perPage = siteConfig.blog.postsPerPage

  // Filter logic
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag)
    const matchesYear = !selectedYear ||
      new Date(post.date).getFullYear().toString() === selectedYear
    const contentHasFiles = /!\[.*?\]\(.*?\)|\[.*?\]\(.*?\.(pdf|zip|doc|docx|xls|xlsx|ppt|pptx)\)/i.test(post.content);
    const hasAttachments = post.attachments.length > 0;
    let matchesHasFiles = true;
    if (hasFiles === 'yes') matchesHasFiles = contentHasFiles || hasAttachments;
    else if (hasFiles === 'no') matchesHasFiles = !contentHasFiles && !hasAttachments;
    return matchesSearch && matchesTag && matchesYear && matchesHasFiles
  })

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  const buildQueryString = (updates: any) => {
    const params = new URLSearchParams()
    if (updates.search) params.set('search', updates.search)
    if (updates.tag) params.set('tag', updates.tag)
    if (updates.year) params.set('year', updates.year)
    if (updates.hasFiles) params.set('hasFiles', updates.hasFiles)
    if (updates.page && updates.page > 1) params.set('page', updates.page.toString())
    return params.toString() ? `?${params.toString()}` : ''
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Header siteConfig={siteConfig} links={links} />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{siteConfig.blog.title}</h1>
          <p className="text-muted-foreground">{siteConfig.blog.description}</p>
        </div>

        <BlogFilters
          allPosts={allPosts}
          initialSearch={searchQuery}
          initialTag={selectedTag}
          initialYear={selectedYear}
          initialHasFiles={hasFiles}
        />

        <div className="mt-8 space-y-8">
          {paginatedPosts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No posts found.
            </div>
          ) : (
            paginatedPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <article className="flex flex-col sm:flex-row gap-4 sm:items-baseline border-b border-border pb-8 hover:opacity-75 transition-opacity">
                  <time className="text-sm text-muted-foreground sm:w-32 shrink-0 font-mono">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 group-hover:underline decoration-1 underline-offset-4">{post.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {/* First & Prev */}
            <Link
              href={`/blog${buildQueryString({ ...searchParams, page: 1 })}`}
              className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage > 1 ? 'hover:bg-accent' : 'opacity-50 pointer-events-none'}`}
              aria-label="First page"
            >
              «
            </Link>
            <Link
              href={`/blog${buildQueryString({ ...searchParams, page: currentPage - 1 })}`}
              className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage > 1 ? 'hover:bg-accent' : 'opacity-50 pointer-events-none'}`}
              aria-label="Previous page"
            >
              ‹
            </Link>

            {/* Page Numbers with Ellipsis */}
            {(() => {
              const pages = [];
              // Always show first page
              pages.push(1);

              if (currentPage > 3) {
                pages.push('...');
              }

              // Show pages around current
              for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
              }

              if (currentPage < totalPages - 2) {
                pages.push('...');
              }

              // Always show last page if not already added
              if (totalPages > 1) {
                pages.push(totalPages);
              }

              // Deduplicate just in case logic overlaps
              const uniquePages = [...new Set(pages)];

              return (
                <div className="flex gap-2 justify-center w-[330px]">
                  {uniquePages.map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return (
                      <Link
                        key={page}
                        href={`/blog${buildQueryString({ ...searchParams, page })}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${page === currentPage ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                          }`}
                      >
                        {page}
                      </Link>
                    );
                  })}
                </div>
              );
            })()}

            {/* Next & Last */}
            <Link
              href={`/blog${buildQueryString({ ...searchParams, page: currentPage + 1 })}`}
              className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage < totalPages ? 'hover:bg-accent' : 'opacity-50 pointer-events-none'}`}
              aria-label="Next page"
            >
              ›
            </Link>
            <Link
              href={`/blog${buildQueryString({ ...searchParams, page: totalPages })}`}
              className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage < totalPages ? 'hover:bg-accent' : 'opacity-50 pointer-events-none'}`}
              aria-label="Last page"
            >
              »
            </Link>
          </div>
        )}
      </main>

      {siteConfig.footer.enabled && <Footer siteConfig={siteConfig} />}
    </div>
  )
}
