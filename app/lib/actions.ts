'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

import { saveFile, deleteFile } from '@/lib/storage';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import bcrypt from 'bcryptjs';

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'on';
    const dateStr = formData.get('date') as string;
    const createdAt = dateStr ? new Date(dateStr) : undefined;

    const files = formData.getAll('files') as File[];

    try {
        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                published,
                ...(createdAt && { createdAt }),
            },
        });


        for (const file of files) {
            if (file.size > 0 && file.name !== 'undefined') {
                const savedFile = await saveFile(file);
                await prisma.attachment.create({
                    data: {
                        ...savedFile,
                        postId: post.id,
                    }
                });
            }
        }

    } catch (error) {
        console.error('Failed to create post:', error);
        throw new Error('Failed to create post.');
    }

    revalidatePath('/admin/posts');
    redirect('/admin/posts');
}

export async function updatePost(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'on';
    const dateStr = formData.get('date') as string;
    const createdAt = dateStr ? new Date(dateStr) : undefined;


    const files = formData.getAll('files') as File[];

    try {
        await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                published,
                ...(createdAt && { createdAt }),
            },
        });


        for (const file of files) {
            if (file.size > 0 && file.name !== 'undefined') {
                const savedFile = await saveFile(file);
                await prisma.attachment.create({
                    data: {
                        ...savedFile,
                        postId: id,
                    }
                });
            }
        }

    } catch (error) {
        console.error('Failed to update post:', error);
        throw new Error('Failed to update post.');
    }

    revalidatePath('/admin/posts');
    redirect('/admin/posts');
}

export async function deletePost(id: string) {
    try {

        const post = await prisma.post.findUnique({
            where: { id },
            include: { attachments: true }
        });

        if (post) {

            for (const attachment of post.attachments) {
                await deleteFile(attachment.url);
            }

        }

        await prisma.post.delete({
            where: { id },
        });
        revalidatePath('/admin/posts');
    } catch (error) {
        console.error('Failed to delete post:', error);
        throw new Error('Failed to delete post.');
    }
    redirect('/admin/posts');
}

export async function deleteAttachment(attachmentId: string) {
    try {
        const attachment = await prisma.attachment.findUnique({
            where: { id: attachmentId }
        });

        if (!attachment) return;


        await deleteFile(attachment.url);


        await prisma.attachment.delete({
            where: { id: attachmentId }
        });

        revalidatePath('/admin/posts/[id]', 'page');
    } catch (error) {
        console.error('Failed to delete attachment:', error);
        throw new Error('Failed to delete attachment.');
    }
}


export async function createLink(formData: FormData) {
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const icon = formData.get('icon') as string || 'link';
    const type = formData.get('type') as string || 'NAV_ITEM';

    try {

        const highestOrderLink = await prisma.link.findFirst({
            orderBy: { order: 'desc' },
        });
        const order = highestOrderLink ? highestOrderLink.order + 1 : 0;

        await prisma.link.create({
            data: {
                title,
                url,
                icon,
                type,
                order,
            },
        });
        revalidatePath('/admin/settings');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to create link:', error);
        throw new Error('Failed to create link.');
    }
}

export async function deleteLink(id: string) {
    try {
        await prisma.link.delete({
            where: { id },
        });
        revalidatePath('/admin/settings');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to delete link:', error);
        throw new Error('Failed to delete link.');
    }
}

export async function duplicateLink(id: string) {
    try {
        const linkToDuplicate = await prisma.link.findUnique({
            where: { id },
        });

        if (!linkToDuplicate) return;


        const highestOrderLink = await prisma.link.findFirst({
            orderBy: { order: 'desc' },
        });
        const order = highestOrderLink ? highestOrderLink.order + 1 : 0;

        await prisma.link.create({
            data: {
                title: `${linkToDuplicate.title} (Copy)`,
                url: linkToDuplicate.url,
                icon: linkToDuplicate.icon,
                type: linkToDuplicate.type,
                active: linkToDuplicate.active,
                order,
            },
        });
        revalidatePath('/admin/settings');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to duplicate link:', error);
        throw new Error('Failed to duplicate link.');
    }
}

export async function deleteAllLinks() {
    try {
        await prisma.link.deleteMany();
        revalidatePath('/admin/settings');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to delete all links:', error);
        throw new Error('Failed to delete all links.');
    }
}

export async function updateLinkOrder(items: { id: string; order: number }[]) {
    try {

        await prisma.$transaction(
            items.map((item) =>
                prisma.link.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        );
        revalidatePath('/admin/settings');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to update link order:', error);
        throw new Error('Failed to update link order.');
    }
}

export async function toggleLinkActive(id: string, active: boolean) {
    try {
        await prisma.link.update({
            where: { id },
            data: { active },
        });
        revalidatePath('/admin/settings');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to toggle link:', error);
        throw new Error('Failed to toggle link.');
    }
}



export async function updateTheme(themeId: string) {
    try {
        await prisma.settings.upsert({
            where: { key: 'theme' },
            update: { value: themeId },
            create: { key: 'theme', value: themeId },
        });
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to update theme:', error);
        throw new Error('Failed to update theme.');
    }
}

export async function updateSiteConfig(formData: FormData) {
    try {

        const currentSettings = await prisma.settings.findUnique({
            where: { key: 'site_config' },
        });
        let currentVersion = 0;
        if (currentSettings?.value) {
            try {
                const parsed = JSON.parse(currentSettings.value);
                currentVersion = parsed.favicon?.version || 0;
            } catch (e) {

            }
        }

        const faviconFile = formData.get('favicon') as File | null;
        if (faviconFile && faviconFile.size > 0 && faviconFile.name !== 'undefined') {
            const bytes = await faviconFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const path = join(process.cwd(), 'public', 'favicon.ico');
            await writeFile(path, buffer);
            currentVersion = Date.now();
        }

        const rawData = {
            name: formData.get('name') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            author: {
                name: formData.get('author_name') as string,
                email: formData.get('author_email') as string,
            },
            header: {
                title: formData.get('header_title') as string,
                subtitle: formData.get('header_subtitle') as string,
                description: formData.get('header_description') as string,
                showSocialIcons: formData.get('header_show_social') === 'on',
                titleSize: formData.get('header_title_size') as string,
                subtitleSize: formData.get('header_subtitle_size') as string,
                descriptionSize: formData.get('header_description_size') as string,
                iconSize: formData.get('header_icon_size') as string,
            },
            social: {
                github: formData.get('social_github') as string,
                email: formData.get('social_email') as string,
                solo: formData.get('social_solo') as string,
            },
            navigation: {
                showBlogButton: formData.get('nav_show_blog') === 'on',
                showProjectsButton: formData.get('nav_show_projects') === 'on',
                blogLabel: formData.get('nav_blog_label') as string,
                projectsLabel: formData.get('nav_projects_label') as string,
            },
            blog: {
                enabled: formData.get('blog_enabled') === 'on',
                postsPerPage: Number(formData.get('blog_posts_per_page')),
                showExcerpt: formData.get('blog_show_excerpt') === 'on',
            },
            projects: {
                enabled: formData.get('projects_enabled') === 'on',
                githubUser: formData.get('projects_github_user') as string,
                sortBy: formData.get('projects_sort_by') as string,
                perPage: Number(formData.get('projects_per_page')),
                showStars: formData.get('projects_show_stars') === 'on',
                showLanguage: formData.get('projects_show_language') === 'on',
            },
            footer: {
                enabled: formData.get('footer_enabled') === 'on',
                showLogo: formData.get('footer_show_logo') === 'on',
                showCopyright: formData.get('footer_show_copyright') === 'on',
                copyright: {
                    text: formData.get('footer_text') as string,
                    year: new Date().getFullYear(),
                },
                showEmojis: formData.get('footer_show_emojis') === 'on',
                emojis: formData.get('footer_emojis') as string,
            },
            meta: {
                keywords: (formData.get('meta_keywords') as string)?.split(',').map(k => k.trim()).filter(Boolean),
            },
            favicon: {
                version: currentVersion,
            }
        };

        await prisma.settings.upsert({
            where: { key: 'site_config' },
            update: { value: JSON.stringify(rawData) },
            create: { key: 'site_config', value: JSON.stringify(rawData) },
        });

        revalidatePath('/', 'layout');
        revalidatePath('/admin/settings');
    } catch (error) {
        console.error('Failed to update site config:', error);
        throw new Error('Failed to update site config.');
    }
}

export async function deleteFavicon() {
    try {
        const path = join(process.cwd(), 'public', 'favicon.ico');
        await unlink(path);


        const currentSettings = await prisma.settings.findUnique({
            where: { key: 'site_config' },
        });

        if (currentSettings?.value) {
            try {
                const parsed = JSON.parse(currentSettings.value);
                // Update version
                parsed.favicon = {
                    ...(parsed.favicon || {}),
                    version: Date.now(),
                };

                await prisma.settings.update({
                    where: { key: 'site_config' },
                    data: { value: JSON.stringify(parsed) },
                });
            } catch (e) {
                // ignore
            }
        }

        revalidatePath('/', 'layout');
        revalidatePath('/admin/settings');
    } catch (error) {

        if ((error as any).code !== 'ENOENT') {
            console.error('Failed to delete favicon:', error);
            throw new Error('Failed to delete favicon.');
        }
    }
}

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        throw new Error('Email and password are required.');
    }

    if (!email.includes('@')) {
        throw new Error('Invalid email address.');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
    } catch (error) {
        console.error('Failed to create user:', error);

        if ((error as any).code === 'P2002') {
            throw new Error('User with this email already exists.');
        }
        throw new Error('Failed to create user.');
    }

    revalidatePath('/admin/users');
    redirect('/admin/users');
}

export async function deleteUser(id: string) {
    try {


        await prisma.user.delete({
            where: { id },
        });

        revalidatePath('/admin/users');
    } catch (error) {
        console.error('Failed to delete user:', error);
        throw new Error('Failed to delete user.');
    }
}

export async function publishAllPosts() {
    try {
        await prisma.post.updateMany({
            data: { published: true },
        });
        revalidatePath('/admin/posts');
        revalidatePath('/');
        revalidatePath('/blog');
    } catch (error) {
        console.error('Failed to publish all posts:', error);
        throw new Error('Failed to publish all posts.');
    }
}

export async function unpublishAllPosts() {
    try {
        await prisma.post.updateMany({
            data: { published: false },
        });
        revalidatePath('/admin/posts');
        revalidatePath('/');
        revalidatePath('/blog');
    } catch (error) {
        console.error('Failed to unpublish all posts:', error);
        throw new Error('Failed to unpublish all posts.');

    }
}

export async function deleteAllDrafts() {
    try {
        await prisma.post.deleteMany({
            where: { published: false },
        });
        revalidatePath('/admin/posts');
    } catch (error) {
        console.error('Failed to delete all drafts:', error);
        throw new Error('Failed to delete all drafts.');
    }
}


export async function duplicatePost(id: string) {
    try {
        const postToDuplicate = await prisma.post.findUnique({
            where: { id },
        });

        if (!postToDuplicate) return;

        let newSlug = `${postToDuplicate.slug}-copy`;
        newSlug = `${postToDuplicate.slug}-copy-${Date.now()}`;

        const newPost = await prisma.post.create({
            data: {
                title: `${postToDuplicate.title} (Copy)`,
                slug: newSlug,
                content: postToDuplicate.content,
                published: false,
            },
        });

        revalidatePath('/admin/posts');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to duplicate post:', error);
        throw new Error('Failed to duplicate post.');
    }
}

export async function bulkPublishPosts(ids: string[]) {
    try {
        await prisma.post.updateMany({
            where: { id: { in: ids } },
            data: { published: true },
        });
        revalidatePath('/admin/posts');
        revalidatePath('/');
        revalidatePath('/blog');
    } catch (error) {
        console.error('Failed to bulk publish posts:', error);
        throw new Error('Failed to bulk publish posts.');
    }
}

export async function bulkUnpublishPosts(ids: string[]) {
    try {
        await prisma.post.updateMany({
            where: { id: { in: ids } },
            data: { published: false },
        });
        revalidatePath('/admin/posts');
        revalidatePath('/');
        revalidatePath('/blog');
    } catch (error) {
        console.error('Failed to bulk unpublish posts:', error);
        throw new Error('Failed to bulk unpublish posts.');
    }
}

export async function bulkDeletePosts(ids: string[]) {
    try {

        const posts = await prisma.post.findMany({
            where: { id: { in: ids } },
            include: { attachments: true },
        });

        for (const post of posts) {
            for (const attachment of post.attachments) {
                await deleteFile(attachment.url);
            }
        }

        await prisma.post.deleteMany({
            where: { id: { in: ids } },
        });
        revalidatePath('/admin/posts');
    } catch (error) {
        console.error('Failed to bulk delete posts:', error);
        throw new Error('Failed to bulk delete posts.');
    }
}
