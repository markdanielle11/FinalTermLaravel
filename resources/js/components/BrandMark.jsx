/**
 * Simple monogram for "Apparel Inventory" (no logo file needed).
 */
export default function BrandMark({ className = 'size-8 text-sm' }) {
    return (
        <span
            aria-hidden="true"
            className={`grid shrink-0 place-items-center rounded-lg bg-accent font-semibold tracking-tight text-accent-ink ${className}`}
        >
            AI
        </span>
    );
}
