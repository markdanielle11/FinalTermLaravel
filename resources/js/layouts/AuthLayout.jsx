import { Head, Link } from '@inertiajs/react';
import FlashToast from '../components/FlashToast';
import ThemeToggle from '../components/ThemeToggle';

export default function AuthLayout({ title, heading, description, children, footer }) {
    return (
        <>
            <Head title={title} />

            <div className="flex min-h-[100dvh] flex-col bg-canvas">
                <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
                    <Link href="/" className="text-sm font-semibold text-ink">
                        Apparel Inventory
                    </Link>
                    <ThemeToggle />
                </header>

                <main className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:pt-16">
                    <div className="w-full max-w-sm">
                        <h1 className="text-2xl font-semibold tracking-tight text-ink">{heading}</h1>
                        {description && <p className="mt-1.5 text-sm text-ink-2">{description}</p>}

                        <div className="mt-6 rounded-xl border border-line bg-surface p-5 sm:p-6">{children}</div>

                        {footer && <div className="mt-5 text-center text-sm text-ink-2">{footer}</div>}
                    </div>
                </main>
            </div>

            <FlashToast />
        </>
    );
}
