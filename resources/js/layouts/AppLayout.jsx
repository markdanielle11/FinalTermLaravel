import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ClockCounterClockwiseIcon,
    PackageIcon,
    SignOutIcon,
    SquaresFourIcon,
    TagIcon,
    TruckIcon,
    UserGearIcon,
    ListIcon,
    XIcon,
} from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import Avatar from '../components/Avatar';
import BrandMark from '../components/BrandMark';
import FlashAlert from '../components/FlashAlert';
import RoleBadge from '../components/RoleBadge';
import ThemeToggle from '../components/ThemeToggle';
import useAuth from '../lib/useAuth';

// Each link declares the permission it needs. Links the user cannot use are not rendered.
const navigation = [
    { label: 'Dashboard', href: '/dashboard', permission: 'view dashboard', icon: SquaresFourIcon },
    { label: 'Products', href: '/product/products', permission: 'view products', icon: PackageIcon },
    { label: 'Categories', href: '/product-category/product-categories', permission: 'view categories', icon: TagIcon },
    { label: 'Suppliers', href: '/supplier/suppliers', permission: 'view suppliers', icon: TruckIcon },
    { label: 'Stock history', href: '/stock/movements', permission: 'view stock movements', icon: ClockCounterClockwiseIcon },
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
            <div className="flex h-16 items-center justify-between gap-2 px-4">
                <Link href="/dashboard" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-ink">
                    <BrandMark />
                    Apparel Inventory
                </Link>
                <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="grid size-9 place-items-center rounded-lg text-ink-2 hover:bg-surface-2 lg:hidden"
                >
                    <XIcon size={18} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pt-2" aria-label="Main">
                <p className="px-3 pb-1.5 text-xs font-medium text-ink-3">Inventory</p>
                <div className="space-y-0.5">
                    {links.map((item) => (
                        <NavLink key={item.href} item={item} active={isActive(item.href)} />
                    ))}
                </div>

                {/* Role-based rendering: only Admins see the administration section. */}
                {hasRole('Admin') && (
                    <>
                        <p className="px-3 pt-6 pb-1.5 text-xs font-medium text-ink-3">Administration</p>
                        <NavLink
                            item={{ label: 'Users and roles', href: '/admin/users', icon: UserGearIcon }}
                            active={isActive('/admin/users')}
                        />
                    </>
                )}
            </nav>

            <div className="border-t border-line p-3">
                <Link
                    href="/profile"
                    className={`flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-2 ${
                        isActive('/profile') ? 'bg-surface-2' : ''
                    }`}
                >
                    <Avatar name={user?.name} />
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{user?.name}</span>
                        <span className="mt-0.5 block">
                            <RoleBadge role={roles[0]} />
                        </span>
                    </span>
                </Link>
                <div className="mt-2 flex items-center gap-1 px-1">
                    <ThemeToggle iconOnly />
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium text-ink-2 hover:bg-surface-2 hover:text-ink"
                    >
                        <SignOutIcon size={18} />
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-canvas">
                {/* Desktop sidebar */}
                <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-line bg-surface lg:block">{sidebar}</aside>

                {/* Mobile top bar */}
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur lg:hidden">
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <BrandMark className="size-7 text-xs" />
                        Apparel Inventory
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        aria-label="Open menu"
                        className="grid size-9 place-items-center rounded-lg border border-line text-ink"
                    >
                        <ListIcon size={18} />
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

                <main className="lg:pl-64">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
                </main>
            </div>

            <FlashAlert />
        </>
    );
}

function NavLink({ item, active }) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            prefetch
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
            }`}
        >
            <Icon size={18} weight={active ? 'fill' : 'regular'} />
            {item.label}
        </Link>
    );
}
