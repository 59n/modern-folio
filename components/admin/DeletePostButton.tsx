'use client';

import { deletePost } from '@/app/lib/actions';
import { useTransition } from 'react';

export default function DeletePostButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            type="button"
            className="px-3 py-1 text-sm text-red-400 hover:text-red-300 border border-red-900/50 rounded bg-red-900/10 hover:bg-red-900/20 disabled:opacity-50"
            disabled={isPending}
            onClick={() => {
                if (confirm('Are you sure you want to delete this post?')) {
                    startTransition(async () => {
                        await deletePost(id);
                    });
                }
            }}
        >
            {isPending ? 'Deleting...' : 'Delete Post'}
        </button>
    );
}
