'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { duplicatePost, deletePost, bulkPublishPosts, bulkUnpublishPosts, bulkDeletePosts } from '@/app/lib/actions';

type Post = {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    createdAt: Date;
};

export default function PostsTable({ posts }: { posts: Post[] }) {
    const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const toggleSelectAll = () => {
        if (selectedPosts.length === posts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(posts.map((p) => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedPosts.includes(id)) {
            setSelectedPosts(selectedPosts.filter((pId) => pId !== id));
        } else {
            setSelectedPosts([...selectedPosts, id]);
        }
    };

    const handleDuplicate = async (id: string) => {
        startTransition(async () => {
            await duplicatePost(id);
        });
    };

    const handleBulkPublish = async () => {
        if (!confirm(`Publish ${selectedPosts.length} posts?`)) return;
        startTransition(async () => {
            await bulkPublishPosts(selectedPosts);
            setSelectedPosts([]);
        });
    };

    const handleBulkUnpublish = async () => {
        if (!confirm(`Unpublish ${selectedPosts.length} posts?`)) return;
        startTransition(async () => {
            await bulkUnpublishPosts(selectedPosts);
            setSelectedPosts([]);
        });
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedPosts.length} posts? This cannot be undone.`)) return;
        startTransition(async () => {
            await bulkDeletePosts(selectedPosts);
            setSelectedPosts([]);
        });
    };

    return (
        <div>
            {/* Bulk Actions Toolbar */}
            {selectedPosts.length > 0 && (
                <div className="mb-4 p-4 bg-blue-900/20 border border-blue-900 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <span className="text-blue-200 font-medium">{selectedPosts.length} selected</span>
                    <div className="flex gap-2">
                        <button
                            onClick={handleBulkPublish}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-green-900/40 text-green-400 border border-green-900 rounded hover:bg-green-900/60 transition-colors text-sm font-medium"
                        >
                            Publish
                        </button>
                        <button
                            onClick={handleBulkUnpublish}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-yellow-900/40 text-yellow-400 border border-yellow-900 rounded hover:bg-yellow-900/60 transition-colors text-sm font-medium"
                        >
                            Unpublish
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-red-900/40 text-red-400 border border-red-900 rounded hover:bg-red-900/60 transition-colors text-sm font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-950/50">
                        <tr>
                            <th className="px-6 py-4 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedPosts.length === posts.length && posts.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded border-gray-700 bg-gray-900/50 text-blue-500 focus:ring-blue-900"
                                />
                            </th>
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
                                    <input
                                        type="checkbox"
                                        checked={selectedPosts.includes(post.id)}
                                        onChange={() => toggleSelect(post.id)}
                                        className="rounded border-gray-700 bg-gray-900/50 text-blue-500 focus:ring-blue-900"
                                    />
                                </td>
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
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => handleDuplicate(post.id)}
                                            disabled={isPending}
                                            className="text-gray-400 hover:text-white transition-colors"
                                            title="Duplicate"
                                        >
                                            <span className="sr-only">Duplicate</span>
                                            📄
                                        </button>
                                        <Link href={`/admin/posts/${post.id}`} className="text-blue-400 hover:text-blue-300">
                                            Edit
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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
