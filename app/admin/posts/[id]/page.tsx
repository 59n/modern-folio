import { prisma } from '@/lib/prisma';
import { updatePost, deletePost, deleteAttachment } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';

export default async function EditPostPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const post = await prisma.post.findUnique({
        where: { id: params.id },
        include: { attachments: true }
    });

    if (!post) {
        notFound();
    }

    const deletePostWithId = deletePost.bind(null, post.id);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Edit Post</h1>
                    <p className="text-gray-400">Update your blog post content.</p>
                </div>
                <form action={deletePostWithId}>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium border border-red-500/20"
                    >
                        Delete Post
                    </button>
                </form>
            </div>

            <form action={updatePost.bind(null, post.id)} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        defaultValue={post.title}
                        required
                        className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-400 mb-2">
                        Slug (URL)
                    </label>
                    <input
                        type="text"
                        name="slug"
                        id="slug"
                        defaultValue={post.slug}
                        required
                        className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">
                        Content (Markdown)
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        rows={12}
                        defaultValue={post.content}
                        required
                        className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono text-sm"
                    />
                </div>

                {/* Existing Attachments */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-4">
                        Current Attachments
                    </label>
                    <div className="space-y-3">
                        {post.attachments.length === 0 ? (
                            <p className="text-gray-500 text-sm">No attachments.</p>
                        ) : (
                            post.attachments.map((file: { id: string; filename: string; url: string }) => (
                                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs uppercase font-bold shrink-0">
                                            {file.filename.split('.').pop()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-200 truncate font-medium">{file.filename}</p>
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
                                                View / Download
                                            </a>
                                        </div>
                                    </div>
                                    <button
                                        formAction={deleteAttachment.bind(null, file.id)}
                                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        title="Delete Attachment"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* New Attachments */}
                <div>
                    <label htmlFor="files" className="block text-sm font-medium text-gray-400 mb-2">
                        Add New Attachments
                    </label>
                    <input
                        type="file"
                        id="files"
                        name="files"
                        multiple
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                    />
                </div>


                <div className="flex items-center">
                    <input
                        id="published"
                        name="published"
                        type="checkbox"
                        defaultChecked={post.published}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-gray-900 border-gray-700"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-300">
                        Publish immediately
                    </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <Link
                        href="/admin/posts"
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium border border-gray-700"
                    >
                        Cancel
                    </Link>
                    <SubmitButton label="Save Changes" />
                </div>
            </form>
        </div>
    );
}
