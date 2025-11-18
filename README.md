# Portfolio Website

A minimal, dark-themed personal portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. Inspired by [adryd.com](https://adryd.com/), [prpl.wtf](https://prpl.wtf/), and [matdoes.dev](https://matdoes.dev/).

## Features

- 🎨 **Minimal Dark Theme** - Clean, modern design with customizable colors
- 📝 **Markdown Blog** - Write blog posts in markdown with frontmatter
- 💼 **GitHub Projects** - Automatically fetches and displays your GitHub repositories
- 🔍 **Search & Filters** - Search blog posts and filter by tags/year
- 📄 **Pagination** - Navigate through projects and blog posts
- 🎮 **Easter Eggs** - Hidden surprises throughout the site
- ⚙️ **Fully Configurable** - Everything customizable via `config/site.ts`
- 📱 **Responsive** - Works beautifully on all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/59n/folio.git
cd folio
```

2. Install dependencies:
```bash
npm install
```

3. Configure your site:
Edit `config/site.ts` with your information:
- Site name, title, description
- Social links (GitHub, email, solo.to)
- Colors and theme
- GitHub username for projects

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Configuration

All customization is done through `config/site.ts`. See [CONFIG_README.md](./CONFIG_README.md) for detailed configuration options.

### Quick Config Examples

**Change Site Name:**
```typescript
name: 'YourName',
title: 'Your Name',
```

**Change GitHub User:**
```typescript
projects: {
  githubUser: 'yourusername',
}
```

**Change Colors:**
```typescript
colors: {
  background: '#000000',
  foreground: '#ffffff',
  // ... more colors
}
```

## Blog Posts

Create markdown files in `content/posts/` to add blog posts. See [BLOG_README.md](./BLOG_README.md) for details.

Example post structure:
```markdown
---
title: "My First Post"
date: "2024-01-15"
tags: ["javascript", "react"]
excerpt: "A short description"
---

Your blog post content here!
```

## Deployment

### Netlify

This project is configured for Netlify deployment. Simply connect your GitHub repository to Netlify and it will automatically deploy.

**Manual Deploy:**
```bash
npm run build
```

The build output will be in the `.next` directory.

### Environment Variables

No environment variables are required for basic functionality. All configuration is done through `config/site.ts`.

## Project Structure

```
.
├── app/
│   ├── blog/           # Blog pages
│   ├── projects/       # Projects page
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── Header.tsx      # Site header
│   ├── Footer.tsx       # Site footer
│   ├── ClickableTitle.tsx # Title component
│   ├── BlogFilters.tsx # Blog search/filters
│   └── EasterEgg.tsx   # Easter eggs 🎮
├── config/
│   └── site.ts         # Site configuration
├── content/
│   └── posts/          # Blog post markdown files
├── lib/
│   └── posts.ts        # Blog post utilities
└── public/             # Static assets
```

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **gray-matter** - Markdown frontmatter parsing
- **remark** - Markdown processing

## Customization

- **Colors**: Edit `config/site.ts` → `colors`
- **Layout**: Edit `config/site.ts` → `layout`
- **Content**: Edit components in `components/`
- **Blog**: Add markdown files to `content/posts/`
- **Projects**: Configure GitHub user in `config/site.ts`

## Easter Eggs 🎮

Try these hidden features:
- **Konami Code**: `↑ ↑ ↓ ↓ ← → ← → B A`
- **Secret Words**: Type `secret`, `hello`, `magic`, `surprise`, or `hidden`
- **Title Click**: Click the site title 5 times
- **Rainbow Mode**: Press `Ctrl/Cmd + Shift + R`

## License

MIT

## Contributing

Feel free to fork and customize for your own portfolio!
