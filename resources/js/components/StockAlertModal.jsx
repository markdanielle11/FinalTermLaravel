import { Link, usePage } from '@inertiajs/react';
import { WarningIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import StockBadge from './StockBadge';

/**
 * Low-stock alert shown once right after signing in (the server flashes
 * "stock_alert" on the Login event). Lists products at or below their threshold.
 */
export default function StockAlertModal({ products, lowCount, outCount }) {
    const { flash } = usePage().props;
    const [open, setOpen] = useState(false);
    const dialog = useRef(null);

    useEffect(() => {
        if (flash?.stock_alert && products.length > 0) {
            setOpen(true);
        }
    }, [flash, products.length]);

    useEffect(() => {
        const element = dialog.current;
        if (!element) {
            return;
        }
        if (open && !element.open) {
            element.showModal();
        } else if (!open && element.open) {
            element.close();
        }
    }, [open]);

    const summary = [
        outCount > 0 ? `${outCount} out of stock` : null,
        lowCount > 0 ? `${lowCount} low on stock` : null,
    ]
        .filter(Boolean)
        .join(' and ');

    return (
        <dialog
            ref={dialog}
            role="alertdialog"
            aria-labelledby="stock-alert-title"
            onClose={() => setOpen(false)}
            onClick={(event) => {
                if (event.target === dialog.current) {
                    setOpen(false);
                }
            }}
            className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-line bg-surface p-0 text-ink shadow-2xl shadow-black/20"
        >
            {open && (
                <div className="fade-up p-6">
                    <div className="flex items-start gap-4">
                        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-warn-soft text-warn" aria-hidden="true">
                            <WarningIcon size={26} weight="fill" />
                        </span>
                        <div>
                            <h2 id="stock-alert-title" className="text-lg font-semibold text-ink">
                                Stock alert
                            </h2>
                            <p className="mt-1 text-sm text-ink-2">{summary}. Restock these soon.</p>
                        </div>
                    </div>

                    <ul className="mt-5 divide-y divide-line rounded-lg border border-line">
                        {products.map((product) => (
                            <li key={product.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-medium text-ink">{product.name}</span>
                                    <span className="block text-xs text-ink-3">
                                        {product.stock} left, alert at {product.low_stock_threshold}
                                    </span>
                                </span>
                                <StockBadge status={product.stock_status} />
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink hover:bg-surface-2"
                        >
                            Close
                        </button>
                        <Link
                            href="/product/products?status=low_stock"
                            onClick={() => setOpen(false)}
                            className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-ink hover:bg-accent-hover"
                        >
                            View low stock
                        </Link>
                    </div>
                </div>
            )}
        </dialog>
    );
}
