import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Button from './Button';
import { Field, TextInput, bind } from './Form';
import Modal from './Modal';

/**
 * Stock in / stock out form. Posts to StockMovementController@store,
 * which validates on the server and refuses to go below zero.
 */
export default function StockAdjustModal({ product, onClose }) {
    const form = useForm({
        product_id: product?.id ?? '',
        type: 'in',
        quantity: '',
        note: '',
    });

    useEffect(() => {
        if (product) {
            form.setData({ product_id: product.id, type: 'in', quantity: '', note: '' });
            form.clearErrors();
        }
        // Only re-run when a different product is opened.
    }, [product?.id]);

    const submit = (event) => {
        event.preventDefault();
        form.post('/stock/movements', {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    const quantity = Number(form.data.quantity) || 0;
    const after = product ? (form.data.type === 'in' ? product.stock + quantity : product.stock - quantity) : 0;

    return (
        <Modal open={Boolean(product)} onClose={onClose} title={product ? `Adjust stock: ${product.name}` : ''}>
            {product && (
                <form onSubmit={submit} noValidate className="grid gap-4">
                    <p className="text-sm text-ink-2">
                        Current stock: <span className="font-semibold tabular-nums text-ink">{product.stock}</span>
                    </p>

                    <fieldset>
                        <legend className="text-sm font-medium text-ink">Movement</legend>
                        <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface-2 p-1">
                            {[
                                ['in', 'Stock in'],
                                ['out', 'Stock out'],
                            ].map(([value, label]) => (
                                <label
                                    key={value}
                                    className={`cursor-pointer rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                                        form.data.type === value ? 'bg-surface text-ink shadow-sm' : 'text-ink-2 hover:text-ink'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="type"
                                        value={value}
                                        checked={form.data.type === value}
                                        onChange={() => {
                                            form.setData('type', value);
                                            form.clearErrors('type', 'quantity');
                                        }}
                                        className="sr-only"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                        {form.errors.type && <p className="mt-1.5 text-sm text-bad">{form.errors.type}</p>}
                    </fieldset>

                    <Field label="Quantity" htmlFor="quantity" error={form.errors.quantity} required>
                        <TextInput {...bind(form, 'quantity')} type="number" min="1" step="1" inputMode="numeric" autoFocus />
                    </Field>

                    <Field label="Note" htmlFor="note" error={form.errors.note} hint="Optional, for example: delivery from supplier, sold, damaged.">
                        <TextInput {...bind(form, 'note')} maxLength={255} />
                    </Field>

                    {quantity > 0 && (
                        <p className={`text-sm ${after < 0 ? 'text-bad' : 'text-ink-2'}`}>
                            Stock after this: <span className="font-semibold tabular-nums">{after}</span>
                        </p>
                    )}

                    {form.errors.product_id && <p className="text-sm text-bad">{form.errors.product_id}</p>}

                    <div className="flex justify-end gap-2 pt-1">
                        <Button variant="secondary" onClick={onClose} disabled={form.processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Save movement'}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
