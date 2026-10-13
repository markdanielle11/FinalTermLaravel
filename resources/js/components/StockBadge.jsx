const styles = {
    in_stock: { label: 'In stock', className: 'bg-ok-soft text-ok' },
    low_stock: { label: 'Low stock', className: 'bg-warn-soft text-warn' },
    out_of_stock: { label: 'Out of stock', className: 'bg-bad-soft text-bad' },
};

/**
 * Same rule as the 1st term system: 0 = out of stock, at or below the
 * product's threshold = low stock, otherwise in stock.
 */
export default function StockBadge({ status }) {
    const style = styles[status] ?? styles.in_stock;

    return (
        <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${style.className}`}>
            {style.label}
        </span>
    );
}

export function MovementBadge({ type }) {
    return type === 'in' ? (
        <span className="inline-flex items-center whitespace-nowrap rounded-md bg-ok-soft px-2 py-0.5 text-xs font-medium text-ok">Stock in</span>
    ) : (
        <span className="inline-flex items-center whitespace-nowrap rounded-md bg-surface-2 px-2 py-0.5 text-xs font-medium text-ink-2">Stock out</span>
    );
}
