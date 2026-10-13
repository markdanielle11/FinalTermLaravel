import { Link, useForm } from '@inertiajs/react';
import Button from '../../components/Button';
import { Field, TextInput, bind } from '../../components/Form';
import AuthLayout from '../../layouts/AuthLayout';

export default function ForgotPassword() {
    const form = useForm({ email: '' });

    const submit = (event) => {
        event.preventDefault();
        // Fortify's POST /forgot-password emails a reset link (MAIL_MAILER=log writes it to storage/logs/laravel.log).
        // The "link sent" message comes back as session status and shows as a toast.
        form.post('/forgot-password');
    };

    return (
        <AuthLayout
            title="Forgot password"
            heading="Reset your password"
            description="Enter your email and we will send you a link to choose a new password."
            footer={
                <Link href="/login" className="font-medium text-accent hover:underline">
                    Back to log in
                </Link>
            }
        >
            <form onSubmit={submit} noValidate className="grid gap-4">
                <Field label="Email" htmlFor="email" error={form.errors.email}>
                    <TextInput {...bind(form, 'email')} type="email" autoComplete="username" autoFocus />
                </Field>

                <Button type="submit" disabled={form.processing} className="w-full">
                    {form.processing ? 'Sending...' : 'Email reset link'}
                </Button>
            </form>
        </AuthLayout>
    );
}
