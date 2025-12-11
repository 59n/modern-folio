import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function PostsPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Posts</h2>
                <div className="flex gap-4">

                    <Link
                        href="/admin/posts/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium shadow-lg shadow-blue-900/20"
                    >
                        Create New
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-950/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-black/20 divide-y divide-gray-800">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-white">{post.title}</div>
                                    <div className="text-sm text-gray-500">/{post.slug}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published
                                            ? 'bg-green-900/30 text-green-400 border border-green-900'
                                            : 'bg-yellow-900/30 text-yellow-400 border border-yellow-900'
                                            }`}
                                    >
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {post.createdAt.toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/posts/${post.id}`} className="text-blue-400 hover:text-blue-300 mr-4">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No posts found. Start writing!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
