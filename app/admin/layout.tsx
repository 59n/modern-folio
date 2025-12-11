import Link from 'next/link';
import { signOut } from '@/auth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background text-foreground font-sans">
            <div className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold text-foreground">
                        Admin Panel
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-2">
                        Platform
                    </p>
                    <Link href="/admin" className="block px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors">
                        Overview
                    </Link>
                    <Link href="/admin/posts" className="block px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors">
                        Posts
                    </Link>
                    <Link href="/admin/analytics" className="block px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors">
                        Analytics
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors">
                        Users
                    </Link>

                    <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6">
                        System
                    </p>
                    <Link href="/admin/settings" className="block px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors">
                        Settings
                    </Link>
                </nav>
                <div className="p-4 border-t border-border space-y-2">
                    <Link
                        href="/"
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                    >
                        ← Back to Website
                    </Link>
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
            <div className="flex-1 overflow-auto bg-background text-foreground p-8">
                {children}
            </div>
        </div>
    );
}
