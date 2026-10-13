import { Link } from '@inertiajs/react';

// Radius rule for the whole app: controls rounded-lg (8px), panels rounded-xl (12px).
const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-[background-color,color,transform] duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60';

const variants = {
    primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
    secondary: 'border border-line bg-surface text-ink hover:bg-surface-2',
    danger: 'bg-bad text-surface hover:opacity-90',
    ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
};

/**
 * <Button> renders a <button>; pass href to render an Inertia <Link> instead.
 */
export default function Button({ variant = 'primary', href, className = '', children, ...props }) {
    const classes = `${base} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={classes} {...props}>
            {children}
        </button>
    );
}
