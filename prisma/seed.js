const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const existingUser = await prisma.user.findFirst();

    if (!existingUser) {
        const email = process.env.ADMIN_EMAIL || 'admin@example.com';
        const password = process.env.ADMIN_PASSWORD || Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        console.log('\n');
        console.log('┌──────────────────────────────────────────────────┐');
        console.log('│                                                  │');
        console.log('│   🔐 Admin User Created!                         │');
        console.log('│                                                  │');
        console.log(`│   Email:    ${email.padEnd(29)}│`);
        console.log(`│   Password: ${password.padEnd(29)}│`);
        console.log('│                                                  │');
        console.log('│   Please save these credentials immediately!     │');
        console.log('│                                                  │');
        console.log('└──────────────────────────────────────────────────┘');
        console.log('\n');
    }

    // Seed default posts if none exist
    const postCount = await prisma.post.count();
    if (postCount === 0) {
        console.log('Seeding demo posts...');

        await prisma.post.create({
            data: {
                title: 'Welcome to your Portfolio',
                slug: 'welcome',
                content: `
# Welcome to your new Portfolio! 👋

This is a demo post to show you how your blog looks. Use the Admin Dashboard to edit or delete this post.

## Features

- **Markdown Support**: Write your posts in standard Markdown.
- **Code Highlighting**: Share your code snippets with beautiful syntax highlighting.
- **Image Uploads**: Drag and drop images directly into your posts.
- **SEO Optimized**: Each post is automatically optimized for search engines.

## Getting Started

1. Go to \`/admin\` to log in.
2. Update your **Settings** to customize the site name, colors, and more.
3. Create your first real post!

Enjoy building! 🚀
                `.trim(),
                published: true,
            }
        });

        await prisma.post.create({
            data: {
                title: 'Markdown Guide',
                slug: 'markdown-guide',
                content: `
# Markdown Guide 📝

This theme supports **bold**, *italic*, and [links](https://example.com).

## Headings

You can use H1 through H6 headings to structure your content.

## Lists

- Item 1
- Item 2
  - Sub-item
- Item 3

1. Ordered Item 1
2. Ordered Item 2

## Code

Inline code looks like \`this\`.

\`\`\`javascript
// Code blocks work too!
function hello() {
  console.log("Hello World");
}
\`\`\`

## Quotes

> This is a blockquote. It's great for emphasizing text.

## Tables

| Feature | Status |
| :--- | :--- |
| Markdown | ✅ Supported |
| Images | ✅ Supported |
| Tables | ✅ Supported |

                `.trim(),
                published: true,
            }
        });

        console.log('✅ Demo posts created.');
    }

}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
