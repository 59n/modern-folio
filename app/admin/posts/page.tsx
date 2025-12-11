import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { publishAllPosts, unpublishAllPosts, deleteAllDrafts } from '@/app/lib/actions';
import PostsTable from './PostsTable';
import AdminPostFilters from './AdminPostFilters';
import { Prisma } from '@prisma/client';

export default async function PostsPage(props: {
    searchParams?: Promise<{
        search?: string;
        year?: string;
        hasFiles?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.search || '';
    const year = searchParams?.year;
    const hasFiles = searchParams?.hasFiles;

    const where: Prisma.PostWhereInput = {
        AND: [
            // Search
            query ? {
                OR: [
                    { title: { contains: query } },
                    { slug: { contains: query } },
                ]
            } : {},
            // Year
            year ? {
                createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${parseInt(year) + 1}-01-01`),
                }
            } : {},
            // Has Files
            hasFiles === 'yes' ? {
                attachments: { some: {} }
            } : hasFiles === 'no' ? {
                attachments: { none: {} }
            } : {},
        ]
    };

    const [posts, allPostsMetadata] = await Promise.all([
        prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.post.findMany({ select: { createdAt: true } }),
    ]);

    const filterPosts = allPostsMetadata.map(p => ({ date: p.createdAt.toISOString() }));

    return (
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Posts</h2>
                <div className="flex gap-4">
                    <form action={publishAllPosts}>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-900/40 text-green-400 border border-green-900 rounded-lg hover:bg-green-900/60 transition-colors font-medium text-sm"
                        >
                            Publish All
                        </button>
                    </form>
                    <form action={unpublishAllPosts}>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-yellow-900/40 text-yellow-400 border border-yellow-900 rounded-lg hover:bg-yellow-900/60 transition-colors font-medium text-sm"
                        >
                            Unpublish All
                        </button>
                    </form>
                    <form action={deleteAllDrafts}>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-900/40 text-red-400 border border-red-900 rounded-lg hover:bg-red-900/60 transition-colors font-medium text-sm"
                        >
                            Delete Drafts
                        </button>
                    </form>

                    <Link
                        href="/admin/posts/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium shadow-lg shadow-blue-900/20"
                    >
                        Create New
                    </Link>
                </div>
            </div>

            <AdminPostFilters
                allPosts={filterPosts}
                initialSearch={query}
                initialYear={year}
                initialHasFiles={hasFiles}
            />

            <PostsTable posts={posts} />
        </div>
    );
}
