import { useEffect, useState } from 'react';

export default function ThemeToggle({ className = 'px-2.5 py-1.5' }) {
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

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={dark}
            className={`rounded-lg text-sm text-ink-2 hover:bg-surface-2 hover:text-ink ${className}`}
        >
            {dark ? 'Light mode' : 'Dark mode'}
        </button>
    );
}
