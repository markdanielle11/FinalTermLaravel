import { Head, Link } from '@inertiajs/react';
import BrandMark from '../components/BrandMark';
import FlashToast from '../components/FlashToast';
import ThemeToggle from '../components/ThemeToggle';

/**
 * Split layout for Fortify pages: the form on the left, a product panel on the right (desktop only).
 */
export default function AuthLayout({ title, heading, description, children, footer }) {
    return (
        <>
            <Head title={title} />

            <div className="grid min-h-[100dvh] bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div className="flex flex-col px-4 sm:px-8">
                    <header className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-ink">
                            <BrandMark />
                            Apparel Inventory
                        </Link>
                        <ThemeToggle />
                    </header>

                    <main className="flex flex-1 items-center justify-center py-10">
                        <div className="fade-up w-full max-w-sm">
                            <h1 className="text-3xl font-semibold tracking-tight text-ink">{heading}</h1>
                            {description && <p className="mt-2 text-sm leading-relaxed text-ink-2">{description}</p>}

                            <div className="mt-8">{children}</div>

                            {footer && <div className="mt-8 text-sm text-ink-2">{footer}</div>}
                        </div>
                    </main>

                    <footer className="py-6 text-xs text-ink-3">INTECH 3112 Final Term Project, BSIT 3-3</footer>
                </div>

                <aside className="relative hidden overflow-hidden bg-accent text-accent-ink lg:block dark:bg-accent-soft dark:text-ink">
                    <div className="flex h-full flex-col justify-center gap-12 p-12 xl:p-16">
                        <div className="max-w-md">
                            <p className="text-2xl leading-snug font-semibold tracking-tight xl:text-3xl">
                                See what is low, what is gone, and who moved it.
                            </p>
                            <p className="mt-3 text-sm leading-relaxed opacity-80">
                                Stock levels, suppliers, and every stock in or out, in one place for your whole team.
                            </p>
                        </div>
                        <div className="-mr-24 xl:-mr-32">
                            <img
                                src="/images/dashboard-light.png"
                                alt="The inventory dashboard"
                                width="1440"
                                height="900"
                                className="w-full rounded-xl border border-white/20 shadow-2xl shadow-black/30 dark:hidden"
                            />
                            <img
                                src="/images/dashboard-dark.png"
                                alt="The inventory dashboard"
                                width="1440"
                                height="900"
                                loading="lazy"
                                className="hidden w-full rounded-xl border border-line shadow-2xl shadow-black/40 dark:block"
                            />
                        </div>
                    </div>
                </aside>
            </div>

            <FlashToast />
        </>
    );
}
