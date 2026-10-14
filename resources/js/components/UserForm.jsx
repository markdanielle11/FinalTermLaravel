import Button from './Button';
import { Field, Select, TextInput, bind } from './Form';
import Panel from './Panel';
import PasswordInput from './PasswordInput';

const roleHelp = {
    Admin: 'Everything, including managing users and roles.',
    Manager: 'Add, edit, and delete products, categories, and suppliers. Record stock.',
    Staff: 'View the catalog and record stock in or out.',
};

export default function UserForm({ form, onSubmit, roles, submitLabel, cancelHref, isCreate = false }) {
    return (
        <form onSubmit={onSubmit} noValidate className="grid max-w-2xl gap-6">
            <Panel title="Account">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" htmlFor="name" error={form.errors.name} required>
                        <TextInput {...bind(form, 'name')} autoFocus autoComplete="off" />
                    </Field>
                    <Field label="Email" htmlFor="email" error={form.errors.email} required>
                        <TextInput {...bind(form, 'email')} type="email" autoComplete="off" />
                    </Field>
                    <Field label="Role" htmlFor="role" error={form.errors.role} hint={roleHelp[form.data.role]} required className="sm:col-span-2">
                        <Select {...bind(form, 'role')}>
                            <option value="">Select a role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </Select>
                    </Field>
                </div>
            </Panel>

            <Panel title={isCreate ? 'Password' : 'Change password'}>
                {!isCreate && <p className="mb-4 text-sm text-ink-2">Leave blank to keep the current password.</p>}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Password" htmlFor="password" error={form.errors.password} hint="At least 8 characters." required={isCreate}>
                        <PasswordInput {...bind(form, 'password')} autoComplete="new-password" />
                    </Field>
                    <Field label="Confirm password" htmlFor="password_confirmation" error={form.errors.password_confirmation} required={isCreate}>
                        <PasswordInput {...bind(form, 'password_confirmation')} autoComplete="new-password" />
                    </Field>
                </div>
            </Panel>

            <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={form.processing || (!isCreate && !form.isDirty)}>
                    {form.processing ? 'Saving...' : submitLabel}
                </Button>
                <Button variant="secondary" href={cancelHref}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
