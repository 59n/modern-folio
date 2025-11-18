# How to Write Blog Posts

The blog uses markdown files stored in the `content/posts/` directory.

## Creating a New Post

1. Create a new `.md` file in the `content/posts/` directory
2. Name it something like `my-first-post.md` (this becomes the URL slug)
3. Add frontmatter at the top with metadata:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
excerpt: "A short description that appears on the blog listing page"
---

Your blog post content goes here. You can use **markdown** formatting!

## Headers

- Lists
- More lists

[Links](https://example.com) work too!
```

## Frontmatter Fields

- **title** (required): The post title
- **date** (required): Publication date in YYYY-MM-DD format
- **excerpt** (optional): Short description. If not provided, it will use the first 150 characters of your content

## Example Post Structure

```
content/posts/
  ├── welcome.md
  ├── my-first-post.md
  └── another-post.md
```

## Markdown Support

You can use standard markdown:
- **Bold** and *italic* text
- Headers (# ## ###)
- Lists (ordered and unordered)
- Links
- Code blocks
- And more!

## Viewing Your Posts

- Blog listing: `/blog`
- Individual post: `/blog/your-post-slug`

That's it! Just create markdown files and they'll automatically appear on your blog.

