'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
    label?: string;
}

export default function SubmitButton({ label = 'Save' }: SubmitButtonProps) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium shadow-lg shadow-blue-900/20 disabled:opacity-50"
        >
            {pending ? 'Saving...' : label}
        </button>
    )
}
