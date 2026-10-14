import { CaretDownIcon, CaretUpIcon, CaretUpDownIcon } from '@phosphor-icons/react';

/**
 * Clickable column header. Click once to sort ascending, again for descending.
 */
export default function SortHeader({ column, label, filters, onSort, align = 'left' }) {
    const active = filters.sort === column;
    const direction = active ? filters.direction : null;
    const Icon = !active ? CaretUpDownIcon : direction === 'desc' ? CaretDownIcon : CaretUpIcon;

    const next = active && direction === 'asc' ? 'desc' : 'asc';

    return (
        <th
            scope="col"
            aria-sort={active ? (direction === 'desc' ? 'descending' : 'ascending') : 'none'}
            className={`px-4 py-2.5 font-medium ${align === 'right' ? 'text-right' : ''}`}
        >
            <button
                type="button"
                onClick={() => onSort({ sort: column, direction: next })}
                className={`inline-flex items-center gap-1 rounded hover:text-ink ${active ? 'text-ink' : ''}`}
            >
                {label}
                <Icon size={12} weight="bold" aria-hidden="true" />
            </button>
        </th>
    );
}
