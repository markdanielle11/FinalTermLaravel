import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

/**
 * Switches the "dark" class on <html> and remembers the choice in localStorage.
 * iconOnly renders a square icon button (used in the app sidebar).
 */
export default function ThemeToggle({ className = 'px-2.5 py-1.5', iconOnly = false }) {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        setDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem('theme', next ? 'dark' : 'light');
        } catch {
            // Storage can be blocked (private mode); the toggle still works for this visit.
        }
    };

    const label = dark ? 'Light mode' : 'Dark mode';
    const Icon = dark ? SunIcon : MoonIcon;

    if (iconOnly) {
        return (
            <button
                type="button"
                onClick={toggle}
                aria-pressed={dark}
                aria-label={label}
                title={label}
                className={`grid size-9 place-items-center rounded-lg text-ink-2 hover:bg-surface-2 hover:text-ink ${className}`}
            >
                <Icon size={18} />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={dark}
            className={`rounded-lg text-sm text-ink-2 hover:bg-surface-2 hover:text-ink ${className}`}
        >
            {label}
        </button>
    );
}
