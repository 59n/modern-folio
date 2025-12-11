import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const session = await auth();


    const totalPosts = await prisma.post.count();
    const publishedPosts = await prisma.post.count({ where: { published: true } });
    const draftPosts = totalPosts - publishedPosts;


    const recentPosts = await prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 text-sm">Welcome back, {session?.user?.email}</p>
                </div>
                <Link
                    href="/"
                    target="_blank"
                    className="inline-flex items-center justify-center px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                    View Live Site ↗
                </Link>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
                    <h3 className="text-gray-400 text-sm font-medium">Total Content</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{totalPosts}</span>
                        <span className="text-sm text-gray-500">posts</span>
                    </div>
                </div>
                <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
                    <h3 className="text-gray-400 text-sm font-medium">Publish Status</h3>
                    <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Published</span>
                            <span className="text-white font-medium">{publishedPosts}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Drafts</span>
                            <span className="text-white font-medium">{draftPosts}</span>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl flex flex-col justify-center gap-3">
                    <Link
                        href="/admin/posts/create"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
                    >
                        + Create New Post
                    </Link>
                    <Link
                        href="/admin/analytics"
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
                    >
                        View Analytics
                    </Link>
                </div>
            </div>


            <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/50">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-semibold text-white">Recent Content</h3>
                    <Link href="/admin/posts" className="text-sm text-blue-400 hover:text-blue-300">
                        View all
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3 font-medium">Title</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {recentPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white truncate max-w-xs block sm:table-cell">
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${post.published
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'bg-yellow-500/10 text-yellow-400'
                                                }`}
                                        >
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/posts/${post.id}`}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {recentPosts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No posts yet. Create your first one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
