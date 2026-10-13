import Button from './Button';
import { Field, Select, TextArea, TextInput, bind } from './Form';
import Panel from './Panel';

/**
 * Shared by Products/Create and Products/Edit.
 * Stock is only set when creating; after that it changes through stock in/out.
 */
export default function ProductForm({ form, onSubmit, categories, suppliers, submitLabel, cancelHref, isCreate = false }) {
    return (
        <form onSubmit={onSubmit} noValidate className="grid gap-6">
            <Panel title="Details">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Product name" htmlFor="name" error={form.errors.name} required className="sm:col-span-2">
                        <TextInput {...bind(form, 'name')} autoFocus />
                    </Field>

                    <Field label="SKU" htmlFor="sku" error={form.errors.sku} hint="Letters, numbers, dashes. Example: TSH-004" required>
                        <TextInput {...bind(form, 'sku')} className="uppercase" />
                    </Field>

                    <Field label="Price (PHP)" htmlFor="price" error={form.errors.price} required>
                        <TextInput {...bind(form, 'price')} type="number" min="0" step="0.01" inputMode="decimal" />
                    </Field>

                    <Field label="Category" htmlFor="product_category_id" error={form.errors.product_category_id} required>
                        <Select {...bind(form, 'product_category_id')}>
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Supplier" htmlFor="supplier_id" error={form.errors.supplier_id}>
                        <Select {...bind(form, 'supplier_id')}>
                            <option value="">No supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field label="Size" htmlFor="size" error={form.errors.size} hint="Example: M, XL, 32">
                        <TextInput {...bind(form, 'size')} />
                    </Field>

                    <Field label="Color" htmlFor="color" error={form.errors.color}>
                        <TextInput {...bind(form, 'color')} />
                    </Field>

                    <Field label="Description" htmlFor="description" error={form.errors.description} className="sm:col-span-2">
                        <TextArea {...bind(form, 'description')} />
                    </Field>
                </div>
            </Panel>

            <Panel title="Stock">
                <div className="grid gap-4 sm:grid-cols-2">
                    {isCreate ? (
                        <Field label="Opening stock" htmlFor="stock" error={form.errors.stock} hint="Recorded as the first stock in." required>
                            <TextInput {...bind(form, 'stock')} type="number" min="0" step="1" inputMode="numeric" />
                        </Field>
                    ) : (
                        <div className="grid gap-1.5">
                            <p className="text-sm font-medium text-ink">Current stock</p>
                            <p className="text-sm text-ink-2">
                                <span className="font-semibold tabular-nums text-ink">{form.data.stock}</span> units. Use Stock in/out on the product page to change it.
                            </p>
                        </div>
                    )}

                    <Field
                        label="Low stock threshold"
                        htmlFor="low_stock_threshold"
                        error={form.errors.low_stock_threshold}
                        hint="Marked as low stock at or below this number."
                        required
                    >
                        <TextInput {...bind(form, 'low_stock_threshold')} type="number" min="0" step="1" inputMode="numeric" />
                    </Field>
                </div>
            </Panel>

            <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? 'Saving...' : submitLabel}
                </Button>
                <Button variant="secondary" href={cancelHref}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
