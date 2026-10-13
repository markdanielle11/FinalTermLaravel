import { useForm } from '@inertiajs/react';
import Button from '../../components/Button';
import { Field, TextInput, bind } from '../../components/Form';
import AuthLayout from '../../layouts/AuthLayout';

// email and token are passed by Fortify::resetPasswordView() in FortifyServiceProvider.
export default function ResetPassword({ email, token }) {
    const form = useForm({
        token,
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.post('/reset-password', { onFinish: () => form.reset('password', 'password_confirmation') });
    };

    return (
        <AuthLayout title="Choose a new password" heading="Choose a new password">
            <form onSubmit={submit} noValidate className="grid gap-4">
                <Field label="Email" htmlFor="email" error={form.errors.email}>
                    <TextInput {...bind(form, 'email')} type="email" autoComplete="username" />
                </Field>

                <Field label="New password" htmlFor="password" error={form.errors.password} hint="At least 8 characters.">
                    <TextInput {...bind(form, 'password')} type="password" autoComplete="new-password" autoFocus />
                </Field>

                <Field label="Confirm new password" htmlFor="password_confirmation" error={form.errors.password_confirmation}>
                    <TextInput {...bind(form, 'password_confirmation')} type="password" autoComplete="new-password" />
                </Field>

                <Button type="submit" disabled={form.processing} className="w-full">
                    {form.processing ? 'Saving...' : 'Reset password'}
                </Button>
            </form>
        </AuthLayout>
    );
}
