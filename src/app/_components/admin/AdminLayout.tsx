'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Film,
    FileText,
    Tags,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
    user: {
        name?: string | null;
        email?: string | null;
        role?: string;
    };
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: Film },
    { name: 'Journal', href: '/admin/journal', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children, user }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-zinc-900 to-black border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
                        <Link href="/admin" className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white">vculture</span>
                            <span className="text-xs text-white/40">Admin</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white/60 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-primary text-primary-foreground shadow-lg'
                                            : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                                {user.name?.[0] || user.email?.[0] || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user.name || 'Admin'}
                                </p>
                                <p className="text-xs text-white/40 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-sm border-b border-white/10">
                    <div className="flex items-center justify-between h-full px-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-white/60 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex-1 lg:flex-none">
                            <h1 className="text-lg font-semibold text-white">
                                {navigation.find((item) => item.href === pathname)?.name || 'Admin'}
                            </h1>
                        </div>
                        <Link
                            href="/"
                            className="text-sm text-white/60 hover:text-white transition-colors"
                        >
                            View Site →
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
