import { Head, Link } from '@inertiajs/react';
import StockBadge from '../components/StockBadge';
import ThemeToggle from '../components/ThemeToggle';
import useAuth from '../lib/useAuth';

// Rows for the role comparison. Mirrors RolesAndPermissionsSeeder.
const access = [
    ['View products, categories, and suppliers', 'Yes', 'Yes', 'Yes'],
    ['Record stock in and stock out', 'Yes', 'Yes', 'Yes'],
    ['Add, edit, and delete products', 'Yes', 'Yes', 'No'],
    ['Manage categories and suppliers', 'Yes', 'Yes', 'No'],
    ['Create accounts and assign roles', 'Yes', 'No', 'No'],
];

export default function Welcome() {
    const { user } = useAuth();

    return (
        <>
            <Head title="Stock tracking for apparel shops" />

            <div className="min-h-[100dvh] bg-canvas text-ink">
                <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="text-base font-semibold tracking-tight">
                        Apparel Inventory
                    </Link>
                    <nav className="flex items-center gap-1 sm:gap-2" aria-label="Site">
                        <ThemeToggle />
                        {user ? (
                            <Link href="/dashboard" className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-ink hover:bg-accent-hover">
                                Open dashboard
                            </Link>
                        ) : (
                            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-surface-2">
                                Log in
                            </Link>
                        )}
                    </nav>
                </header>

                <main>
                    {/* Hero: text left, real screenshot of the dashboard right */}
                    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-24">
                        <div className="fade-up lg:col-span-5">
                            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tighter md:text-5xl">
                                Every size and supplier, accounted for.
                            </h1>
                            <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-ink-2">
                                Track apparel stock, record every unit in or out, and give admins, managers, and staff the access they need.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                {user ? (
                                    <Link href="/dashboard" className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-transform hover:bg-accent-hover active:scale-[0.98]">
                                        Open dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-ink transition-transform hover:bg-accent-hover active:scale-[0.98]">
                                            Log in
                                        </Link>
                                        <Link href="/register" className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-transform hover:bg-surface-2 active:scale-[0.98]">
                                            Create account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="fade-up lg:col-span-7 lg:-mr-16 xl:-mr-28" style={{ animationDelay: '120ms' }}>
                            <Screenshot name="dashboard" alt="Dashboard showing stock totals, products that need restocking, and recent stock activity" />
                        </div>
                    </section>

                    {/* Roles: comparison table */}
                    <section className="border-y border-line bg-surface">
                        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
                            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Three roles, one login page.</h2>
                            <p className="mt-3 max-w-[60ch] text-ink-2">
                                Each account gets a role. The server checks it on every request, and the screen only shows the actions that role allows.
                            </p>

                            <div className="mt-10">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-line text-ink-3">
                                            <th className="py-3 pr-4 font-medium">What you can do</th>
                                            <th className="px-2 py-3 text-center font-medium text-ink sm:px-4">Admin</th>
                                            <th className="px-2 py-3 text-center font-medium text-ink sm:px-4">Manager</th>
                                            <th className="px-2 py-3 text-center font-medium text-ink sm:px-4">Staff</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {access.map(([label, ...cells]) => (
                                            <tr key={label}>
                                                <td className="py-3 pr-4 text-ink">{label}</td>
                                                {cells.map((cell, index) => (
                                                    <td key={index} className={`px-2 py-3 text-center sm:px-4 ${cell === 'Yes' ? 'font-medium text-ink' : 'text-ink-3'}`}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Stock status: the rule as a simple scale */}
                    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
                        <div className="max-w-[60ch]">
                            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Low stock shows up before it runs out.</h2>
                            <p className="mt-3 text-ink-2">
                                Each product has its own threshold. Leather jackets can warn at 5 units while plain shirts warn at 10.
                            </p>
                        </div>

                        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-[1fr_2fr_3fr]">
                            <div className="bg-surface p-5">
                                <StockBadge status="out_of_stock" />
                                <p className="mt-3 text-2xl font-semibold tabular-nums">0</p>
                                <p className="mt-1 text-sm text-ink-2">Nothing left to sell.</p>
                            </div>
                            <div className="bg-surface p-5">
                                <StockBadge status="low_stock" />
                                <p className="mt-3 text-2xl font-semibold tabular-nums">1 to threshold</p>
                                <p className="mt-1 text-sm text-ink-2">Listed on the dashboard under Needs restocking.</p>
                            </div>
                            <div className="bg-surface p-5">
                                <StockBadge status="in_stock" />
                                <p className="mt-3 text-2xl font-semibold tabular-nums">Above threshold</p>
                                <p className="mt-1 text-sm text-ink-2">No action needed.</p>
                            </div>
                        </div>
                    </section>

                    {/* Audit trail: text above, screenshot below (different layout from the hero) */}
                    <section className="border-t border-line bg-surface">
                        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:pt-20">
                            <h2 className="max-w-[24ch] text-2xl font-semibold tracking-tight md:text-3xl">Every unit in or out is on record.</h2>
                            <p className="mt-3 max-w-[60ch] text-ink-2">
                                Stock never changes silently. Each movement saves who made it, when, the quantity before and after, and a note.
                            </p>
                            <div className="mt-10 overflow-hidden">
                                <Screenshot name="stock-history" alt="Stock history table with date, product, movement type, quantity, and the user who recorded it" className="translate-y-px rounded-b-none border-b-0" />
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-line">
                    <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-ink-3 sm:flex-row sm:justify-between sm:px-6">
                        <p>INTECH 3112 Final Term Project, BSIT 3-3, Central Luzon State University</p>
                        <p>Built with Laravel, Inertia, and React</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

/**
 * Real screenshots of the app in public/images, one per theme.
 */
function Screenshot({ name, alt, className = '' }) {
    const frame = `w-full rounded-xl border border-line shadow-xl shadow-ink/5 ${className}`;

    return (
        <>
            <img src={`/images/${name}-light.png`} alt={alt} width="1440" height="900" className={`${frame} dark:hidden`} />
            <img src={`/images/${name}-dark.png`} alt={alt} width="1440" height="900" className={`${frame} hidden dark:block`} loading="lazy" />
        </>
    );
}
