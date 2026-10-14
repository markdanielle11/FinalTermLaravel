import { PlusIcon } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';
import Button from '../../components/Button';
import ConfirmDelete from '../../components/ConfirmDelete';
import EmptyState from '../../components/EmptyState';
import { Select } from '../../components/Form';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import RoleBadge from '../../components/RoleBadge';
import AppLayout from '../../layouts/AppLayout';
import { formatDate } from '../../lib/format';
import useAuth from '../../lib/useAuth';
import useFilters from '../../lib/useFilters';

export default function Index({ users, roles, filters: initialFilters }) {
    const { user: me } = useAuth();
    const { filters, set, reset, active, loading } = useFilters('/admin/users', initialFilters);

    return (
        <AppLayout title="Users and roles">
            <PageHeader
                title="Users and roles"
                description="Only Admins can open this page. The route group uses the role:Admin middleware."
                actions={<Button href="/admin/users/create"><PlusIcon size={16} weight="bold" />Add user</Button>}
            />

            <div className="rounded-xl border border-line bg-surface">
                <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-[2fr_1fr_auto]">
                    <SearchInput label="Search users" placeholder="Search name or email" value={filters.search} onChange={(event) => set('search', event.target.value)} />
                    <div>
                        <label htmlFor="role" className="sr-only">
                            Role
                        </label>
                        <Select id="role" value={filters.role} onChange={(event) => set('role', event.target.value)}>
                            <option value="">All roles</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <Button variant="ghost" onClick={reset} disabled={!active}>
                        Clear
                    </Button>
                </div>

                <div aria-busy={loading} className={`transition-opacity duration-150 ${loading ? 'opacity-50' : ''}`}>
                    {users.data.length === 0 ? (
                        <EmptyState title="No users match these filters" description="Try another name or role." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="bg-surface-2/60 text-xs text-ink-3">
                                    <tr className="border-b border-line">
                                        <th className="px-4 py-2.5 font-medium">Name</th>
                                        <th className="px-4 py-2.5 font-medium">Role</th>
                                        <th className="px-4 py-2.5 font-medium">Joined</th>
                                        <th className="px-4 py-2.5">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-surface-2/60">
                                            <td className="px-4 py-3">
                                                <Link href={`/admin/users/${user.id}`} className="font-medium text-ink hover:text-accent">
                                                    {user.name}
                                                </Link>
                                                {user.id === me?.id && <span className="ml-2 text-xs text-ink-3">(you)</span>}
                                                <p className="text-xs text-ink-3">{user.email}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-4 py-3 text-ink-2">{formatDate(user.created_at)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" className="px-2.5 py-1.5" href={`/admin/users/${user.id}/edit`}>
                                                        Edit
                                                    </Button>
                                                    {user.id !== me?.id && (
                                                        <ConfirmDelete
                                                            url={`/admin/users/${user.id}`}
                                                            title="Delete this user?"
                                                            message={`${user.name} will lose access. Their past stock records stay, marked as a deleted user.`}
                                                            className="px-2.5 py-1.5"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <Pagination paginator={users} noun="users" />
            </div>
        </AppLayout>
    );
}
