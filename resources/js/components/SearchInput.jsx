import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import { TextInput } from './Form';

/**
 * Search box with an icon. Press "/" anywhere on the page to jump into it.
 */
export default function SearchInput({ id = 'search', label, className = '', ...props }) {
    const input = useRef(null);

    useEffect(() => {
        const onKeyDown = (event) => {
            const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
            if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
                event.preventDefault();
                input.current?.focus();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div className={`relative ${className}`}>
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <MagnifyingGlassIcon size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
            <TextInput ref={input} id={id} type="search" className="pr-9 pl-9" {...props} />
            <kbd
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-line px-1.5 text-xs text-ink-3 sm:block"
            >
                /
            </kbd>
        </div>
    );
}
