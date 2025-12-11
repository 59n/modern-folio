import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { SiteConfig } from '@/config/site'

export async function generateMetadata(): Promise<Metadata> {
  const { getSiteConfig } = await import('@/lib/settings');
  const siteConfig = await getSiteConfig();

  return {
    title: siteConfig.meta.titleTemplate.replace('%s', siteConfig.projects.title),
    description: siteConfig.projects.description,
  }
}

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  updated_at: string
  topics: string[]
}

async function getAllProjects(siteConfig: SiteConfig): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${siteConfig.projects.githubUser}/repos?sort=${siteConfig.projects.sortBy}&per_page=${siteConfig.projects.totalFetch}`,
      {
        next: { revalidate: siteConfig.projects.cacheTime || 3600 },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch projects')
    }

    const repos: GitHubRepo[] = await res.json()
    return repos.filter(repo => {
      return !siteConfig.projects.excludePatterns?.some(pattern => repo.name.includes(pattern))
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

interface ProjectsPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { getSiteConfig } = await import('@/lib/settings');
  const siteConfig = await getSiteConfig();
  const allProjects = await getAllProjects(siteConfig)
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10)
  const perPage = siteConfig.projects.perPage
  const totalPages = Math.ceil(allProjects.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const projects = allProjects.slice(startIndex, endIndex)

  // Fetch DB Links for Header
  const links = await prisma.link.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  }).catch(() => []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Header siteConfig={siteConfig} links={links} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{siteConfig.projects.title}</h1>
          <p className="text-muted-foreground">{siteConfig.projects.description}</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>No projects found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="relative h-full flex flex-col justify-between rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm"
                >
                  {/* Overlay Link for Main Card Click (to Repo) */}
                  <a
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="peer absolute inset-0 z-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={`View ${project.name} repository`}
                  />

                  {/* Card Content */}
                  <div className="relative z-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg peer-hover:underline decoration-1 underline-offset-4">
                        {project.name}
                      </h3>
                      {siteConfig.projects.showStars && project.stargazers_count > 0 && (
                        <span className="flex items-center text-xs text-muted-foreground">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          {project.stargazers_count}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {project.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="relative flex items-center justify-between text-xs text-muted-foreground/80 mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3 z-0">
                      {siteConfig.projects.showLanguage && project.language && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                          {project.language}
                        </span>
                      )}
                    </div>

                    {/* View Demo Link (Independent Interaction) */}
                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        View Demo <span className="text-xs">→</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Link
                    key={page}
                    href={`/projects${page > 1 ? `?page=${page}` : ''}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${page === currentPage ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                  >
                    {page}
                  </Link>
                ))}
              </div>
            )}

          </>
        )}
      </main>

      {siteConfig.footer.enabled && <Footer siteConfig={siteConfig} />}
    </div>
  )
}

