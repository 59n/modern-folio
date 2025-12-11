import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deleteUser } from '@/app/lib/actions';
import { auth } from '@/auth';

export default async function UsersPage() {
    const session = await auth();
    const currentUserEmail = session?.user?.email;

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">Users</h2>
                    <p className="text-gray-400 mt-2">Manage admin access</p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm"
                >
                    Add User
                </Link>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 bg-gray-900/50">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {users.map((user) => (
                            <tr key={user.id} className="group hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-white">
                                        {user.email}
                                        {user.email === currentUserEmail && (
                                            <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-green-900/30 text-green-400 border border-green-800/50">
                                                YOU
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {user.email !== currentUserEmail ? (
                                        <form action={async () => {
                                            'use server';
                                            await deleteUser(user.id);
                                        }}>
                                            <button
                                                className="text-gray-500 hover:text-red-400 transition-colors text-sm font-medium p-2 hover:bg-red-900/10 rounded"
                                                type="submit"
                                            >
                                                Delete
                                            </button>
                                        </form>
                                    ) : (
                                        <span className="text-gray-600 text-xs italic p-2">Current User</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
}
