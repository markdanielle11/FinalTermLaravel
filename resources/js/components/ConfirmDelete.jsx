import { router } from '@inertiajs/react';
import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';

/**
 * Delete button with a confirmation dialog. Sends a DELETE request through Inertia
 * (Inertia attaches the CSRF token automatically from the XSRF-TOKEN cookie).
 */
export default function ConfirmDelete({ url, title, message, label = 'Delete', variant = 'ghost', className = '' }) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const destroy = () => {
        router.delete(url, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setOpen(false);
            },
        });
    };

    return (
        <>
            <Button
                variant={variant}
                onClick={() => setOpen(true)}
                className={variant === 'ghost' ? `text-bad hover:text-bad ${className}` : className}
            >
                {label}
            </Button>

            <Modal open={open} onClose={() => setOpen(false)} title={title}>
                <p className="text-sm text-ink-2">{message}</p>
                <div className="mt-5 flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setOpen(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={destroy} disabled={processing}>
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </Modal>
        </>
    );
}
