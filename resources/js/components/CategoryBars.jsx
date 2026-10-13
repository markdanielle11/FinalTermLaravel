import { formatNumber } from '../lib/format';

/**
 * Horizontal bars: units in stock per category (one series, so no legend).
 * Bars grow from a shared baseline, value at the row end, native tooltip on hover,
 * and a screen-reader table with the same numbers.
 */
export default function CategoryBars({ categories }) {
    const sorted = [...categories].sort((a, b) => b.units - a.units);
    const max = Math.max(1, ...sorted.map((category) => category.units));

    return (
        <figure>
            <ul className="grid gap-3.5" aria-hidden="true">
                {sorted.map((category) => {
                    const width = (category.units / max) * 100;
                    return (
                        <li
                            key={category.id}
                            className="grid grid-cols-[6.5rem_1fr] items-center gap-3"
                            title={`${category.name}: ${formatNumber(category.units)} units in ${category.products_count} products`}
                        >
                            <span className="truncate text-sm text-ink-2">{category.name}</span>
                            <span className="flex items-center gap-3">
                                <span className="flex-1">
                                    <span
                                        className="block h-2.5 rounded-r-[4px] bg-chart"
                                        style={{ width: `${width}%`, minWidth: category.units > 0 ? '4px' : 0 }}
                                    />
                                </span>
                                <span className="w-10 text-right text-sm font-medium tabular-nums text-ink">{formatNumber(category.units)}</span>
                            </span>
                        </li>
                    );
                })}
            </ul>

            <table className="sr-only">
                <caption>Units in stock by category</caption>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Products</th>
                        <th>Units</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((category) => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>{category.products_count}</td>
                            <td>{category.units}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}
