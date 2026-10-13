import Button from './Button';
import { Field, TextArea, TextInput, bind } from './Form';
import Panel from './Panel';

export default function CategoryForm({ form, onSubmit, submitLabel, cancelHref }) {
    return (
        <form onSubmit={onSubmit} noValidate className="grid max-w-2xl gap-6">
            <Panel>
                <div className="grid gap-4">
                    <Field label="Name" htmlFor="name" error={form.errors.name} required>
                        <TextInput {...bind(form, 'name')} autoFocus />
                    </Field>
                    <Field label="Description" htmlFor="description" error={form.errors.description}>
                        <TextArea {...bind(form, 'description')} />
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
