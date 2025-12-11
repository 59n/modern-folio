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

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const published = formData.get('published') === 'on';

    // Handle files
    const files = formData.getAll('files') as File[];

    try {
        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                published,
            },
        });

        // Save attachments
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

    // Handle new files
    const files = formData.getAll('files') as File[];

    try {
        await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                published,
            },
        });

        // Save new attachments
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
        // Find post and its attachments first to delete files
        const post = await prisma.post.findUnique({
            where: { id },
            include: { attachments: true }
        });

        if (post) {
            // Delete files from storage
            for (const attachment of post.attachments) {
                await deleteFile(attachment.url);
            }
            // DB cascade will delete attachment records, but we deleted files manually
        }

        await prisma.post.delete({
            where: { id },
        });
        revalidatePath('/admin/posts');
    } catch (error) {
        console.error('Failed to delete post:', error);
        throw new Error('Failed to delete post.');
    }
}

export async function deleteAttachment(attachmentId: string) {
    try {
        const attachment = await prisma.attachment.findUnique({
            where: { id: attachmentId }
        });

        if (!attachment) return;

        // Delete from storage
        await deleteFile(attachment.url);

        // Delete from DB
        await prisma.attachment.delete({
            where: { id: attachmentId }
        });

        revalidatePath('/admin/posts');
    } catch (error) {
        console.error('Failed to delete attachment:', error);
        throw new Error('Failed to delete attachment.');
    }
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function importPosts() {
    const postsDirectory = path.join(process.cwd(), 'content/posts');
    if (!fs.existsSync(postsDirectory)) return;

    const files = fs.readdirSync(postsDirectory);

    for (const filename of files) {
        if (!filename.endsWith('.md') && !filename.endsWith('.mdx')) continue;

        const filePath = path.join(postsDirectory, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // Slug from filename or frontmatter
        const slug = filename.replace(/\.mdx?$/, '');

        await prisma.post.upsert({
            where: { slug },
            update: {
                title: data.title || slug,
                content: content,
                published: true,
                // We could map other fields like date if we added them to schema
            },
            create: {
                slug,
                title: data.title || slug,
                content: content,
                published: true,
            },
        });
    }

    revalidatePath('/admin/posts');
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
                showSocialIcons: formData.get('header_show_social') === 'on',
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
                copyright: {
                    text: formData.get('footer_text') as string,
                    year: new Date().getFullYear(), // Always current
                },
                emojis: formData.get('footer_emojis') as string,
            },
            meta: {
                keywords: (formData.get('meta_keywords') as string)?.split(',').map(k => k.trim()).filter(Boolean),
            }
        };

        // Filter out empty strings if necessary, or let them override.
        // For now, we save everything.

        await prisma.settings.upsert({
            where: { key: 'site_config' },
            update: { value: JSON.stringify(rawData) },
            create: { key: 'site_config', value: JSON.stringify(rawData) },
        });

        revalidatePath('/', 'layout'); // Revalidate everything
    } catch (error) {
        console.error('Failed to update site config:', error);
        throw new Error('Failed to update site config.');
    }
}

import bcrypt from 'bcryptjs';

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        throw new Error('Email and password are required.');
    }

    // Basic email validation
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
        // Check for unique constraint violation
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
        // Prevent deleting the last user or self?
        // Ideally we check context, but for now just simple delete.
        // The UI should prevent self-deletion if possible, or we check here.
        // Let's rely on simple deletion for MVP, assuming admin knows what they are doing.

        await prisma.user.delete({
            where: { id },
        });

        revalidatePath('/admin/users');
    } catch (error) {
        console.error('Failed to delete user:', error);
        throw new Error('Failed to delete user.');
    }
}
