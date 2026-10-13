const styles = {
    Admin: 'bg-accent-soft text-accent',
    Manager: 'bg-surface-2 text-ink',
    Staff: 'bg-surface-2 text-ink-2',
};

export default function RoleBadge({ role }) {
    return (
        <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${styles[role] ?? 'bg-surface-2 text-ink-3'}`}>
            {role ?? 'No role'}
        </span>
    );
}
