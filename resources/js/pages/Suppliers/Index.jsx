import { PlusIcon } from '@phosphor-icons/react';
import { Link } from '@inertiajs/react';
import Button from '../../components/Button';
import ConfirmDelete from '../../components/ConfirmDelete';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import SearchInput from '../../components/SearchInput';
import Pagination from '../../components/Pagination';
import AppLayout from '../../layouts/AppLayout';
import useAuth from '../../lib/useAuth';
import useFilters from '../../lib/useFilters';

export default function Index({ suppliers, filters: initialFilters }) {
    const { can } = useAuth();
    const { filters, set, reset, active } = useFilters('/supplier/suppliers', initialFilters);

    return (
        <AppLayout title="Suppliers">
            <PageHeader
                title="Suppliers"
                description="Companies that deliver stock. Deleting a supplier keeps its products but leaves them unassigned."
                actions={can('create suppliers') && <Button href="/supplier/suppliers/create"><PlusIcon size={16} weight="bold" />Add supplier</Button>}
            />

            <div className="rounded-xl border border-line bg-surface">
                <SearchInput label="Search suppliers" placeholder="Search name, contact, or email" value={filters.search} onChange={(event) => set('search', event.target.value)} className="sm:max-w-xs" />

                {suppliers.data.length === 0 ? (
                    <EmptyState
                        title={active ? 'No suppliers match your search' : 'No suppliers yet'}
                        description={active ? 'Try another name or email.' : 'Add the companies you buy stock from.'}
                        action={
                            active ? (
                                <Button variant="secondary" onClick={reset}>
                                    Clear search
                                </Button>
                            ) : (
                                can('create suppliers') && <Button href="/supplier/suppliers/create"><PlusIcon size={16} weight="bold" />Add supplier</Button>
                            )
                        }
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-surface-2/60 text-xs text-ink-3">
                                <tr className="border-b border-line">
                                    <th className="px-4 py-2.5 font-medium">Supplier</th>
                                    <th className="px-4 py-2.5 font-medium">Contact number</th>
                                    <th className="px-4 py-2.5 font-medium">Email</th>
                                    <th className="px-4 py-2.5 text-right font-medium">Products</th>
                                    <th className="px-4 py-2.5">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {suppliers.data.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-surface-2/60">
                                        <td className="px-4 py-3">
                                            <Link href={`/supplier/suppliers/${supplier.id}`} className="font-medium text-ink hover:text-accent">
                                                {supplier.name}
                                            </Link>
                                            {supplier.contact_person && <p className="text-xs text-ink-3">{supplier.contact_person}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-ink-2">{supplier.contact_number}</td>
                                        <td className="px-4 py-3 text-ink-2">{supplier.email}</td>
                                        <td className="px-4 py-3 text-right tabular-nums text-ink-2">{supplier.products_count}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                {can('edit suppliers') && (
                                                    <Button variant="ghost" className="px-2.5 py-1.5" href={`/supplier/suppliers/${supplier.id}/edit`}>
                                                        Edit
                                                    </Button>
                                                )}
                                                {can('delete suppliers') && (
                                                    <ConfirmDelete
                                                        url={`/supplier/suppliers/${supplier.id}`}
                                                        title="Delete this supplier?"
                                                        message={`"${supplier.name}" will be deleted. Its ${supplier.products_count} product(s) will stay, without a supplier.`}
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

                <Pagination paginator={suppliers} noun="suppliers" />
            </div>
        </AppLayout>
    );
}
