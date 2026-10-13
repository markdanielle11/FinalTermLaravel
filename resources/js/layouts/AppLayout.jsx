import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import FlashToast from '../components/FlashToast';
import ThemeToggle from '../components/ThemeToggle';
import useAuth from '../lib/useAuth';

// Each link declares the permission it needs. Links the user cannot use are not rendered.
const navigation = [
    { label: 'Dashboard', href: '/dashboard', permission: 'view dashboard' },
    { label: 'Products', href: '/product/products', permission: 'view products' },
    { label: 'Categories', href: '/product-category/product-categories', permission: 'view categories' },
    { label: 'Suppliers', href: '/supplier/suppliers', permission: 'view suppliers' },
    { label: 'Stock history', href: '/stock/movements', permission: 'view stock movements' },
];

export default function AppLayout({ title, children }) {
    const { url } = usePage();
    const { user, roles, can, hasRole } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close the mobile menu after navigating.
    useEffect(() => setMenuOpen(false), [url]);

    const isActive = (href) => url === href || url.startsWith(`${href}/`) || url.startsWith(`${href}?`);

    const links = navigation.filter((item) => can(item.permission));

    const sidebar = (
        <div className="flex h-full flex-col">
            <Link href="/dashboard" className="px-5 pt-5 pb-6 text-base font-semibold tracking-tight text-ink">
                Apparel Inventory
            </Link>

            <nav className="flex-1 space-y-0.5 px-3" aria-label="Main">
                {links.map((item) => (
                    <NavLink key={item.href} href={item.href} active={isActive(item.href)}>
                        {item.label}
                    </NavLink>
                ))}

                {/* Role-based rendering: only Admins see the administration section. */}
                {hasRole('Admin') && (
                    <>
                        <p className="px-3 pt-5 pb-1.5 text-xs font-medium text-ink-3">Administration</p>
                        <NavLink href="/admin/users" active={isActive('/admin/users')}>
                            Users and roles
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="border-t border-line p-3">
                <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
                    <p className="truncate text-xs text-ink-3">
                        {roles.join(', ') || 'No role'} account
                    </p>
                </div>
                <NavLink href="/profile" active={isActive('/profile')}>
                    Profile
                </NavLink>
                <ThemeToggle className="w-full px-3 py-2 text-left font-medium" />
                <button
                    type="button"
                    onClick={() => router.post('/logout')}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-2 hover:bg-surface-2 hover:text-ink"
                >
                    Log out
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-canvas">
                {/* Desktop sidebar */}
                <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-line bg-surface lg:block">{sidebar}</aside>

                {/* Mobile top bar */}
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
                    <Link href="/dashboard" className="text-sm font-semibold text-ink">
                        Apparel Inventory
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink"
                    >
                        Menu
                    </button>
                </header>

                {/* Mobile drawer */}
                {menuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden" id="mobile-menu">
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setMenuOpen(false)}
                        />
                        <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-line bg-surface">{sidebar}</aside>
                    </div>
                )}

                <main className="lg:pl-60">
                    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
                </main>
            </div>

            <FlashToast />
        </>
    );
}

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
            }`}
        >
            {children}
        </Link>
    );
}
