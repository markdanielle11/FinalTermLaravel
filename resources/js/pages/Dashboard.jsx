import { Link } from '@inertiajs/react';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    CoinsIcon,
    PackageIcon,
    PlusIcon,
    StackIcon,
    TruckIcon,
    WarningIcon,
    XCircleIcon,
} from '@phosphor-icons/react';
import Button from '../components/Button';
import CategoryBars from '../components/CategoryBars';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import StockBadge from '../components/StockBadge';
import AppLayout from '../layouts/AppLayout';
import { formatDateTime, formatNumber, formatPeso } from '../lib/format';
import useAuth from '../lib/useAuth';

export default function Dashboard({ stats, needsAttention, recentMovements, categories }) {
    const { user, can } = useAuth();
    const firstName = user?.name?.split(' ')[0] ?? '';
    const today = new Intl.DateTimeFormat('en-PH', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

    return (
        <AppLayout title="Dashboard">
            <PageHeader
                title={`Good to see you, ${firstName}`}
                description={`${today}. Here is where your stock stands.`}
                actions={
                    can('create products') && (
                        <Button href="/product/products/create">
                            <PlusIcon size={16} weight="bold" />
                            Add product
                        </Button>
                    )
                }
            />

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                <Stat icon={PackageIcon} label="Products" value={formatNumber(stats.products)} />
                <Stat icon={StackIcon} label="Units in stock" value={formatNumber(stats.units)} />
                <Stat icon={CoinsIcon} label="Stock value" value={formatPeso(stats.stock_value)} />
                <Stat icon={TruckIcon} label="Suppliers" value={formatNumber(stats.suppliers)} />
                <Stat
                    icon={WarningIcon}
                    label="Low stock"
                    value={formatNumber(stats.low_stock)}
                    tone="warn"
                    href="/product/products?status=low_stock"
                />
                <Stat
                    icon={XCircleIcon}
                    label="Out of stock"
                    value={formatNumber(stats.out_of_stock)}
                    tone="bad"
                    href="/product/products?status=out_of_stock"
                />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                <Panel
                    title="Needs restocking"
                    className="lg:col-span-3"
                    bodyClassName=""
                    actions={
                        <Link href="/product/products?status=low_stock" className="text-sm font-medium text-accent hover:underline">
                            View all
                        </Link>
                    }
                >
                    {needsAttention.length === 0 ? (
                        <EmptyState title="Everything is stocked" description="No product is at or below its low stock threshold." />
                    ) : (
                        <ul className="divide-y divide-line">
                            {needsAttention.map((product) => (
                                <li key={product.id}>
                                    <Link
                                        href={`/product/products/${product.id}`}
                                        className="flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-surface-2/60"
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-medium text-ink">{product.name}</span>
                                            <span className="block text-xs text-ink-3">
                                                {product.sku} in {product.category}
                                            </span>
                                        </span>
                                        <span className="flex shrink-0 items-center gap-3">
                                            <span className="text-right text-xs text-ink-3">
                                                <span className="block text-sm font-semibold tabular-nums text-ink">{product.stock} left</span>
                                                alert at {product.low_stock_threshold}
                                            </span>
                                            <StockBadge status={product.stock_status} />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>

                <Panel title="Units by category" className="lg:col-span-2">
                    <CategoryBars categories={categories} />
                </Panel>
            </div>

            <Panel
                title="Recent stock activity"
                className="mt-6"
                bodyClassName=""
                actions={
                    can('view stock movements') && (
                        <Link href="/stock/movements" className="text-sm font-medium text-accent hover:underline">
                            Full history
                        </Link>
                    )
                }
            >
                {recentMovements.length === 0 ? (
                    <EmptyState title="No activity yet" description="Stock in and stock out records will appear here." />
                ) : (
                    <ul className="divide-y divide-line">
                        {recentMovements.map((movement) => {
                            const isIn = movement.type === 'in';
                            const Icon = isIn ? ArrowDownIcon : ArrowUpIcon;
                            return (
                                <li key={movement.id} className="flex items-center gap-4 px-5 py-3">
                                    <span
                                        className={`grid size-9 shrink-0 place-items-center rounded-full ${
                                            isIn ? 'bg-ok-soft text-ok' : 'bg-surface-2 text-ink-2'
                                        }`}
                                        aria-hidden="true"
                                    >
                                        <Icon size={16} weight="bold" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <Link
                                            href={`/product/products/${movement.product?.id}`}
                                            className="block truncate text-sm font-medium text-ink hover:text-accent"
                                        >
                                            {movement.product?.name}
                                        </Link>
                                        <span className="block truncate text-xs text-ink-3">
                                            {isIn ? 'Stock in' : 'Stock out'} by {movement.user ?? 'Deleted user'}
                                        </span>
                                    </span>
                                    <span className="hidden text-xs text-ink-3 sm:block">{formatDateTime(movement.created_at)}</span>
                                    <span className={`w-12 text-right text-sm font-semibold tabular-nums ${isIn ? 'text-ok' : 'text-ink'}`}>
                                        {isIn ? '+' : '-'}
                                        {movement.quantity}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Panel>
        </AppLayout>
    );
}

const tones = {
    default: { icon: 'bg-accent-soft text-accent', value: 'text-ink' },
    warn: { icon: 'bg-warn-soft text-warn', value: 'text-warn' },
    bad: { icon: 'bg-bad-soft text-bad', value: 'text-bad' },
};

function Stat({ icon: Icon, label, value, tone = 'default', href }) {
    const style = tones[tone];
    const body = (
        <>
            <span className={`grid size-9 place-items-center rounded-lg ${style.icon}`} aria-hidden="true">
                <Icon size={18} weight="duotone" />
            </span>
            <span className="mt-4 block text-xs font-medium text-ink-3">{label}</span>
            <span className={`mt-1 block text-xl font-semibold tracking-tight tabular-nums ${style.value}`}>{value}</span>
        </>
    );
    const classes = 'block rounded-xl border border-line bg-surface p-4';

    return href ? (
        <Link href={href} className={`${classes} transition-colors hover:border-ink-3`}>
            {body}
        </Link>
    ) : (
        <div className={classes}>{body}</div>
    );
}
