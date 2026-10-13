export default function Panel({ title, actions, children, className = '', bodyClassName = 'p-5' }) {
    return (
        <section className={`rounded-xl border border-line bg-surface ${className}`}>
            {(title || actions) && (
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                    {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
                    {actions}
                </header>
            )}
            <div className={bodyClassName}>{children}</div>
        </section>
    );
}
