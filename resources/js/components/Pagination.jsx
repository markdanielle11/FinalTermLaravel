import { Link } from '@inertiajs/react';

/**
 * Uses Laravel's paginator output (links, from, to, total).
 * The first and last entries of "links" are Previous/Next; their labels
 * contain HTML entities, so plain text labels are used for them instead.
 */
export default function Pagination({ paginator, noun = 'results' }) {
    if (!paginator || paginator.total === 0) {
        return null;
    }

    const pages = paginator.links.slice(1, -1);

    return (
        <nav
            aria-label="Pagination"
            className="flex flex-col gap-3 border-t border-line px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
            <p className="text-ink-2">
                Showing {paginator.from} to {paginator.to} of {paginator.total} {noun}
            </p>

            {paginator.last_page > 1 && (
                <div className="flex flex-wrap items-center gap-1">
                    <PageLink href={paginator.prev_page_url} label="Previous" />
                    {pages.map((link, index) =>
                        link.url ? (
                            <PageLink key={`${link.label}-${index}`} href={link.url} label={link.label} active={link.active} />
                        ) : (
                            <span key={`gap-${index}`} className="px-2 text-ink-3">
                                {link.label}
                            </span>
                        ),
                    )}
                    <PageLink href={paginator.next_page_url} label="Next" />
                </div>
            )}
        </nav>
    );
}

function PageLink({ href, label, active = false }) {
    const classes = `min-w-9 rounded-lg px-2.5 py-1.5 text-center ${
        active ? 'bg-accent text-accent-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
    }`;

    if (!href) {
        return <span className={`${classes} cursor-not-allowed opacity-50`}>{label}</span>;
    }

    return (
        <Link href={href} preserveScroll className={classes} aria-current={active ? 'page' : undefined}>
            {label}
        </Link>
    );
}
