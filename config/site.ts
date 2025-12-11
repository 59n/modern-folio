export const siteConfig = {

  name: 'Portfolio',
  title: 'My Portfolio',
  description: "Welcome to my portfolio. I'm a software developer and this is my corner of the internet.",
  author: {
    name: 'Author Name',
    email: 'hello@example.com',
  },


  url: 'https://example.com',
  github: {
    username: 'username',
    url: 'https://github.com/username',
  },


  social: {
    github: 'https://github.com/username',
    email: 'hello@example.com',
    solo: 'https://solo.to/username',
  },


  theme: 'system',
  colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    card: {
      background: 'rgba(17, 24, 39, 0.4)',
      border: 'rgba(31, 41, 55, 0.5)',
      hover: {
        background: 'rgba(31, 41, 55, 0.6)',
        border: 'rgba(55, 65, 81, 0.5)',
      },
    },
    text: {
      primary: 'var(--foreground)',
      secondary: 'var(--text-secondary)',
      muted: 'var(--text-muted)',
    },
    button: {
      background: 'rgba(17, 24, 39, 0.4)',
      border: 'rgba(31, 41, 55, 0.5)',
      text: '#d1d5db',
      hover: {
        background: 'rgba(31, 41, 55, 0.6)',
        border: 'rgba(55, 65, 81, 0.5)',
        text: 'var(--foreground)',
      },
    },
  },


  layout: {
    maxWidth: '42rem',
    padding: {
      mobile: '1.5rem',
      desktop: '2rem',
    },
    spacing: {
      section: '4rem',
      element: '1.5rem',
    },
  },


  header: {
    title: 'Hello World',
    subtitle: "I'm a developer building things for the web.",
    description: `This is my personal portfolio and blog. I write about software development,
tech, and my journey as a creator.`,
    showSocialIcons: true,
    titleSize: 'large',
    subtitleSize: 'medium',
    descriptionSize: 'small',
    iconSize: 'medium',
  },


  navigation: {
    showBlogButton: true,
    showProjectsButton: true,
    blogLabel: 'Blog',
    projectsLabel: 'Projects',
  },


  footer: {
    enabled: true,
    showLogo: true,
    logo: 'Portfolio',
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


  blog: {
    enabled: true,
    title: 'Blog',
    description: 'Thoughts, tutorials, and updates.',
    postsPerPage: 4,
    showExcerpt: true,
    excerptLength: 150,
  },


  projects: {
    enabled: true,
    title: 'Projects',
    description: 'Open source work and experiments.',
    githubUser: 'vercel',
    sortBy: 'updated',
    perPage: 6,
    totalFetch: 100,
    cacheTime: 3600,
    showStars: true,
    showLanguage: true,
    showUpdatedDate: true,
    excludePatterns: [],
  },


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


  favicon: {
    enabled: true,
    path: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png',
    version: 0,
  },
} as const

export type SiteConfig = typeof siteConfig