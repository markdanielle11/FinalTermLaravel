import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Keeps list filters in the URL (?search=...&category=...).
 * Text search waits 350ms after typing stops; dropdowns apply right away.
 */
export default function useFilters(url, initial) {
    const [filters, setFilters] = useState(initial);
    const skipSearchEffect = useRef(true); // skip the first render
    const timer = useRef(null);

    const visit = (next) => {
        const query = Object.fromEntries(Object.entries(next).filter(([, value]) => value !== '' && value !== null));
        router.get(url, query, { preserveState: true, preserveScroll: true, replace: true });
    };

    useEffect(() => {
        if (skipSearchEffect.current) {
            skipSearchEffect.current = false;
            return undefined;
        }
        timer.current = setTimeout(() => visit(filters), 350);
        return () => clearTimeout(timer.current);
        // Only the search text is debounced here.
    }, [filters.search]);

    const set = (key, value) => {
        const next = { ...filters, [key]: value };
        setFilters(next);
        if (key !== 'search') {
            clearTimeout(timer.current);
            visit(next);
        }
    };

    const reset = () => {
        const cleared = Object.fromEntries(Object.keys(filters).map((key) => [key, '']));
        clearTimeout(timer.current);
        if ((filters.search ?? '') !== '') {
            skipSearchEffect.current = true; // the visit below already covers it
        }
        setFilters(cleared);
        visit(cleared);
    };

    const active = Object.values(filters).some((value) => value !== '' && value !== null);

    return { filters, set, reset, active };
}
