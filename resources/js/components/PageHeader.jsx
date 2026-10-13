export default function PageHeader({ title, description, actions }) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
                {description && <p className="mt-1 max-w-[65ch] text-sm text-ink-2">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}
