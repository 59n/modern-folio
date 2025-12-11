'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    Admin Access
                </h1>
                <form
                    action={async (formData) => {
                        const result = await authenticate(undefined, formData);
                        if (result) setErrorMessage(result);
                    }}
                    className="space-y-6"
                >
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-400" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-400" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            id="password"
                            type="password"
                            name="password"
                            required
                            minLength={6}
                        />
                    </div>
                    <LoginButton />
                    {errorMessage && (
                        <div className="p-3 text-sm text-red-200 bg-red-900/30 border border-red-900/50 rounded-lg text-center">
                            {errorMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-disabled={pending}
        >
            {pending ? 'Authenticating...' : 'Sign In'}
        </button>
    );
}
