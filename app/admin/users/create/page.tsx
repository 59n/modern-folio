'use client';

import { createUser } from '@/app/lib/actions';
import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';

export default function CreateUserPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/users"
                    className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block"
                >
                    ← Back to Users
                </Link>
                <h2 className="text-3xl font-bold text-white">Add New User</h2>
                <p className="text-gray-400 mt-2">Create a new admin account.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <form action={createUser} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            minLength={6}
                            className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                        />
                        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long.</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <SubmitButton label="Create User" />
                    </div>
                </form>
            </div>
        </div>
    );
}
