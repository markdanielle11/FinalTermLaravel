import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Keeps list filters in the URL (?search=...&category=...).
 * Text search waits 350ms after typing stops; dropdowns and sorting apply right away.
 * `loading` is true while the request runs, so the list can dim instead of jumping.
 */
export default function useFilters(url, initial) {
    const [filters, setFilters] = useState(initial);
    const [loading, setLoading] = useState(false);
    const skipSearchEffect = useRef(true); // skip the first render
    const timer = useRef(null);

    const visit = (next) => {
        const query = Object.fromEntries(Object.entries(next).filter(([, value]) => value !== '' && value !== null));
        router.get(url, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
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

    const setMany = (values) => {
        const next = { ...filters, ...values };
        setFilters(next);
        clearTimeout(timer.current);
        visit(next);
    };

    const reset = () => {
        // Sorting is a view preference, not a filter, so it survives "Clear".
        const cleared = Object.fromEntries(
            Object.keys(filters).map((key) => [key, key === 'sort' || key === 'direction' ? filters[key] : '']),
        );
        clearTimeout(timer.current);
        if ((filters.search ?? '') !== '') {
            skipSearchEffect.current = true; // the visit below already covers it
        }
        setFilters(cleared);
        visit(cleared);
    };

    const active = Object.entries(filters).some(
        ([key, value]) => key !== 'sort' && key !== 'direction' && value !== '' && value !== null,
    );

    return { filters, set, setMany, reset, active, loading };
}
