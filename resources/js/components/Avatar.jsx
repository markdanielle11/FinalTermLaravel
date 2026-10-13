export default function Avatar({ name = '', className = 'size-9 text-sm' }) {
    const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');

    return (
        <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent ${className}`}>
            {initials || '?'}
        </span>
    );
}
