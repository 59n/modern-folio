import Link from 'next/link';
import { signOut } from '@/auth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-black text-white font-sans">
            <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Admin Panel
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
                        Overview
                    </Link>
                    <Link href="/admin/posts" className="block px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
                        Posts
                    </Link>
                    <Link href="/admin/analytics" className="block px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
                        Analytics
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
                        Settings
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors">
                        Users
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <button className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-400 bg-red-900/10 rounded-lg hover:bg-red-900/20 transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
            <div className="flex-1 overflow-auto bg-black text-gray-100 p-8">
                {children}
            </div>
        </div>
    );
}
