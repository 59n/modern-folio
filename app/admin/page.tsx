import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminPage() {
    const session = await auth();

    // Fetch quick stats
    const totalPosts = await prisma.post.count();
    const publishedPosts = await prisma.post.count({ where: { published: true } });
    const draftPosts = totalPosts - publishedPosts;

    return (
        <div className="space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Welcome back, {session?.user?.email}
                </h2>
                <p className="text-gray-400 text-lg">
                    This is your admin dashboard. Use the sidebar to manage your content.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Posts</h3>
                    <div className="text-3xl font-bold text-white mb-1">{totalPosts}</div>
                    <p className="text-gray-500 text-xs">
                        {publishedPosts} Published · {draftPosts} Drafts
                    </p>
                </div>

                <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Quick Actions</h3>
                    <div className="flex gap-3 mt-2">
                        <Link
                            href="/admin/posts/create"
                            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                            New Post
                        </Link>
                        <Link
                            href="/admin/analytics"
                            className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                            View Analytics
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
