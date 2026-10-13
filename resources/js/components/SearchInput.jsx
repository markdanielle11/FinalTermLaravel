import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { TextInput } from './Form';

export default function SearchInput({ id = 'search', label, className = '', ...props }) {
    return (
        <div className={`relative ${className}`}>
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <MagnifyingGlassIcon size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
            <TextInput id={id} type="search" className="pl-9" {...props} />
        </div>
    );
}
