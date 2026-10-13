import Button from './Button';
import { Field, TextInput, bind } from './Form';
import Panel from './Panel';

export default function SupplierForm({ form, onSubmit, submitLabel, cancelHref }) {
    return (
        <form onSubmit={onSubmit} noValidate className="grid max-w-2xl gap-6">
            <Panel>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Company name" htmlFor="name" error={form.errors.name} required className="sm:col-span-2">
                        <TextInput {...bind(form, 'name')} autoFocus />
                    </Field>
                    <Field label="Contact person" htmlFor="contact_person" error={form.errors.contact_person}>
                        <TextInput {...bind(form, 'contact_person')} autoComplete="off" />
                    </Field>
                    <Field label="Contact number" htmlFor="contact_number" error={form.errors.contact_number} hint="Example: 0917 123 4567">
                        <TextInput {...bind(form, 'contact_number')} type="tel" inputMode="tel" />
                    </Field>
                    <Field label="Email" htmlFor="email" error={form.errors.email} className="sm:col-span-2">
                        <TextInput {...bind(form, 'email')} type="email" />
                    </Field>
                    <Field label="Address" htmlFor="address" error={form.errors.address} className="sm:col-span-2">
                        <TextInput {...bind(form, 'address')} />
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
