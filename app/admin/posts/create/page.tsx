'use client';

import { createPost } from '@/app/lib/actions';
import SubmitButton from '@/components/SubmitButton';

export default function CreatePostPage() {
    return (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-white">Create New Post</h2>
            <form action={createPost} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-400 mb-2">
                        Slug
                    </label>
                    <input
                        type="text"
                        name="slug"
                        id="slug"
                        required
                        className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="mb-2 block text-sm font-medium text-gray-300">
                        Content (Markdown)
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={12}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="# My Awesome Post..."
                        required
                    />
                </div>

                <div>
                    <label htmlFor="files" className="mb-2 block text-sm font-medium text-gray-300">
                        Attachments (Optional)
                    </label>
                    <input
                        type="file"
                        id="files"
                        name="files"
                        multiple
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 p-2 text-white placeholder-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="published"
                        name="published"
                        className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-300">
                        Publish immediately
                    </label>
                </div>

                <div className="flex justify-end">
                    <SubmitButton label="Create Post" />
                </div>
            </form>
        </div>
    );
}

