import { Link } from '@inertiajs/react';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Panel from '../../components/Panel';
import RoleBadge from '../../components/RoleBadge';
import AppLayout from '../../layouts/AppLayout';
import { formatDate } from '../../lib/format';

export default function Show({ user }) {
    return (
        <AppLayout title={user.name}>
            <div className="mb-3 text-sm">
                <Link href="/admin/users" className="text-ink-2 hover:text-ink">
                    Users
                </Link>
                <span className="px-1.5 text-ink-3">/</span>
                <span className="text-ink">{user.name}</span>
            </div>

            <PageHeader
                title={user.name}
                description={user.email}
                actions={
                    <Button variant="secondary" href={`/admin/users/${user.id}/edit`}>
                        Edit
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Panel title="Account" className="lg:col-span-1">
                    <dl className="grid gap-3">
                        <div>
                            <dt className="text-xs font-medium text-ink-3">Role</dt>
                            <dd className="mt-1">
                                <RoleBadge role={user.role} />
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-ink-3">Joined</dt>
                            <dd className="mt-0.5 text-sm text-ink">{formatDate(user.created_at)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-ink-3">Stock records made</dt>
                            <dd className="mt-0.5 text-sm tabular-nums text-ink">{user.movements_count}</dd>
                        </div>
                    </dl>
                </Panel>

                <Panel title={`Permissions from the ${user.role ?? 'assigned'} role`} className="lg:col-span-2">
                    {user.permissions.length === 0 ? (
                        <p className="text-sm text-ink-2">This account has no permissions yet.</p>
                    ) : (
                        <ul className="flex flex-wrap gap-2">
                            {user.permissions.map((permission) => (
                                <li key={permission} className="rounded-md border border-line px-2 py-1 text-xs text-ink-2">
                                    {permission}
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>
            </div>
        </AppLayout>
    );
}
