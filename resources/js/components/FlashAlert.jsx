import { usePage } from '@inertiajs/react';
import { CheckCircleIcon, WarningCircleIcon, WarningIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

// Fortify sends short status codes; turn them into readable messages.
const statusMessages = {
    'profile-information-updated': 'Your profile was updated.',
    'password-updated': 'Your password was changed.',
};

const tones = {
    success: { title: 'Success', icon: CheckCircleIcon, iconClass: 'bg-ok-soft text-ok' },
    error: { title: 'Something went wrong', icon: WarningCircleIcon, iconClass: 'bg-bad-soft text-bad' },
    warning: { title: 'Low stock alert', icon: WarningIcon, iconClass: 'bg-warn-soft text-warn' },
};

/**
 * Pop-up alert for flash messages (redirect()->with('success'|'error', ...) and Fortify's status).
 * Success closes by itself after a few seconds; errors and low-stock warnings stay until OK.
 * Uses the native <dialog>, so focus, Escape and the backdrop come from the browser.
 */
export default function FlashAlert() {
    const { flash } = usePage().props;
    const [alert, setAlert] = useState(null);
    const dialog = useRef(null);

    useEffect(() => {
        const status = flash?.status ? statusMessages[flash.status] ?? flash.status : null;
        const message = flash?.error ?? flash?.success ?? status;

        if (flash?.error) {
            setAlert({ message: flash.error, tone: 'error', key: Date.now() });
        } else if (flash?.warning) {
            // A stock change that left the product low or out of stock.
            setAlert({ message: flash.warning, detail: message, tone: 'warning', key: Date.now() });
        } else if (message) {
            setAlert({ message, tone: 'success', key: Date.now() });
        }
    }, [flash]);

    useEffect(() => {
        const element = dialog.current;
        if (!element) {
            return undefined;
        }

        if (alert && !element.open) {
            element.showModal();
        } else if (!alert && element.open) {
            element.close();
        }

        if (alert?.tone === 'success') {
            const timer = setTimeout(() => setAlert(null), 3000);
            return () => clearTimeout(timer);
        }

        return undefined;
    }, [alert]);

    const tone = tones[alert?.tone ?? 'success'];
    const Icon = tone.icon;

    return (
        <dialog
            ref={dialog}
            role="alertdialog"
            aria-labelledby="flash-alert-title"
            aria-describedby="flash-alert-message"
            onClose={() => setAlert(null)}
            onClick={(event) => {
                if (event.target === dialog.current) {
                    setAlert(null);
                }
            }}
            className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl border border-line bg-surface p-0 text-ink shadow-2xl shadow-black/20"
        >
            {alert && (
                <div key={alert.key} className="fade-up flex flex-col items-center px-6 pt-7 pb-6 text-center">
                    <span className={`grid size-14 place-items-center rounded-full ${tone.iconClass}`} aria-hidden="true">
                        <Icon size={30} weight="fill" />
                    </span>
                    <h2 id="flash-alert-title" className="mt-4 text-lg font-semibold text-ink">
                        {tone.title}
                    </h2>
                    <p id="flash-alert-message" className="mt-1.5 text-sm leading-relaxed text-ink-2">
                        {alert.message}
                    </p>
                    {alert.detail && <p className="mt-2 text-xs text-ink-3">{alert.detail}</p>}
                    <button
                        type="button"
                        autoFocus
                        onClick={() => setAlert(null)}
                        className="mt-6 w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-transform hover:bg-accent-hover active:scale-[0.98]"
                    >
                        OK
                    </button>
                </div>
            )}
        </dialog>
    );
}
