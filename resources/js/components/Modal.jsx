import { useEffect, useRef } from 'react';

/**
 * Native <dialog>: focus trapping, Escape to close, and backdrop come from the browser.
 */
export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
    const ref = useRef(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) {
            return;
        }
        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            onClick={(event) => {
                if (event.target === ref.current) {
                    onClose();
                }
            }}
            className={`m-auto w-[calc(100%-2rem)] ${maxWidth} rounded-xl border border-line bg-surface p-0 text-ink shadow-2xl shadow-black/20`}
        >
            {open && (
                <div className="p-5">
                    <h2 className="text-base font-semibold text-ink">{title}</h2>
                    <div className="mt-3">{children}</div>
                </div>
            )}
        </dialog>
    );
}
