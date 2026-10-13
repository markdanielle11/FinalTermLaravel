export default function EmptyState({ title, description, action }) {
    return (
        <div className="flex flex-col items-start gap-2 px-5 py-10 sm:items-center sm:text-center">
            <p className="text-sm font-semibold text-ink">{title}</p>
            {description && <p className="max-w-[48ch] text-sm text-ink-2">{description}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
