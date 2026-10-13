import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Fortify sends short status codes; turn them into readable messages.
const statusMessages = {
    'profile-information-updated': 'Profile updated.',
    'password-updated': 'Password changed.',
};

export default function FlashToast() {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const status = flash?.status ? statusMessages[flash.status] ?? flash.status : null;
        const message = flash?.error ?? flash?.success ?? status;

        if (!message) {
            return undefined;
        }

        setToast({ message, tone: flash?.error ? 'error' : 'success', key: Date.now() });
        return undefined;
    }, [flash]);

    // Auto-hide each toast after a few seconds.
    useEffect(() => {
        if (!toast) {
            return undefined;
        }
        const timer = setTimeout(() => setToast(null), 4500);
        return () => clearTimeout(timer);
    }, [toast]);

    if (!toast) {
        return null;
    }

    const tone = toast.tone === 'error' ? 'border-bad/40 bg-bad-soft text-bad' : 'border-ok/40 bg-ok-soft text-ok';

    return (
        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
            <div
                key={toast.key}
                role={toast.tone === 'error' ? 'alert' : 'status'}
                className={`fade-up pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg shadow-black/10 ${tone}`}
            >
                <span>{toast.message}</span>
                <button
                    type="button"
                    onClick={() => setToast(null)}
                    className="-my-0.5 rounded px-1 text-current opacity-70 hover:opacity-100"
                    aria-label="Dismiss"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
