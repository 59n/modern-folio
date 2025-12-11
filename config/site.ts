export const siteConfig = {
  // Site Identity
  name: 'Portfolio',
  title: 'My Portfolio',
  description: "Welcome to my portfolio. I'm a software developer and this is my corner of the internet.",
  author: {
    name: 'Author Name',
    email: 'hello@example.com',
  },

  // URLs
  url: 'https://example.com',
  github: {
    username: 'username',
    url: 'https://github.com/username',
  },

  // Social Links
  social: {
    github: 'https://github.com/username',
    email: 'hello@example.com',
    solo: 'https://solo.to/username', // Solo.to profile link
  },

  // Colors & Theme
  theme: 'system',
  colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    card: {
      background: 'rgba(17, 24, 39, 0.4)', // gray-900/40
      border: 'rgba(31, 41, 55, 0.5)', // gray-800/50
      hover: {
        background: 'rgba(31, 41, 55, 0.6)', // gray-800/60
        border: 'rgba(55, 65, 81, 0.5)', // gray-700/50
      },
    },
    text: {
      primary: 'var(--foreground)',
      secondary: 'var(--text-secondary)', // We will define this
      muted: 'var(--text-muted)', // We will define this
    },
    button: {
      background: 'rgba(17, 24, 39, 0.4)',
      border: 'rgba(31, 41, 55, 0.5)',
      text: '#d1d5db', // gray-300
      hover: {
        background: 'rgba(31, 41, 55, 0.6)',
        border: 'rgba(55, 65, 81, 0.5)',
        text: 'var(--foreground)',
      },
    },
  },

  // Layout
  layout: {
    maxWidth: '42rem', // max-w-2xl equivalent
    padding: {
      mobile: '1.5rem', // px-6
      desktop: '2rem', // md:px-8
    },
    spacing: {
      section: '4rem', // mb-16
      element: '1.5rem', // mb-6
    },
  },

  // Header
  header: {
    title: 'Hello World',
    subtitle: "I'm a developer building things for the web.",
    description: `This is my personal portfolio and blog. I write about software development,
tech, and my journey as a creator.`,
    showSocialIcons: true,
    titleSize: 'large', // tiny, small, medium, large, extra-large, huge, gigantic
    subtitleSize: 'medium', // tiny, small, medium, large, extra-large, huge, gigantic
    descriptionSize: 'small', // tiny, small, medium, large, extra-large, huge, gigantic
    iconSize: 'medium', // tiny, small, medium, large, extra-large, huge, gigantic
  },

  // Navigation
  navigation: {
    showBlogButton: true,
    showProjectsButton: true,
    blogLabel: 'Blog',
    projectsLabel: 'Projects',
  },

  // Footer
  footer: {
    enabled: true, // Set to true to show footer
    showLogo: true,
    logo: 'Portfolio', // or any text/emoji
    showCopyright: true,
    copyright: {
      year: new Date().getFullYear(),
      text: 'Author Name',
      showLicense: false,
      license: {
        type: 'MIT',
        url: '/license',
      },
    },
    showEmojis: true,
    emojis: '✨ 💻 🚀',
  },

  // Blog
  blog: {
    enabled: true,
    title: 'Blog',
    description: 'Thoughts, tutorials, and updates.',
    postsPerPage: 4,
    showExcerpt: true,
    excerptLength: 150,
  },

  // Projects
  projects: {
    enabled: true,
    title: 'Projects',
    description: 'Open source work and experiments.',
    githubUser: 'vercel', // Default to Vercel as a safe demo
    sortBy: 'updated', // 'updated' | 'created' | 'stars'
    perPage: 6, // Projects per page
    totalFetch: 100, // Total projects to fetch from GitHub
    cacheTime: 3600, // Cache time in seconds (3600 = 1 hour). Set to 0 to disable caching
    showStars: true,
    showLanguage: true,
    showUpdatedDate: true,
    // Filter out repos matching these patterns (leave empty array to show all repos)
    excludePatterns: [], // Example: ['.github', 'username-username'] to exclude specific patterns
  },

  // Meta
  meta: {
    defaultTitle: 'My Portfolio',
    titleTemplate: '%s | My Portfolio',
    defaultDescription: "Welcome to my portfolio.",
    keywords: ['software development', 'web development', 'portfolio', 'blog'],
    ogImage: '/og-image.png',
    twitter: {
      card: 'summary_large_image',
      site: '@username',
    },
  },

  // Favicon
  favicon: {
    enabled: true, // Set to true to show favicon
    path: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png',
    version: 0,
  },
} as const

export type SiteConfig = typeof siteConfig