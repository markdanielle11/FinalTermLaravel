import { Link, useForm } from '@inertiajs/react';
import Button from '../../components/Button';
import { Field, TextInput, bind } from '../../components/Form';
import AuthLayout from '../../layouts/AuthLayout';
import PasswordInput from '../../components/PasswordInput';

export default function Login() {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();
        // Fortify's POST /login. Inertia sends the CSRF token automatically.
        form.post('/login', { onFinish: () => form.reset('password') });
    };

    return (
        <AuthLayout
            title="Log in"
            heading="Welcome back"
            description="Log in to manage products, suppliers, and stock."
            footer={
                <>
                    No account yet?{' '}
                    <Link href="/register" className="font-medium text-accent hover:underline">
                        Create one
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} noValidate className="grid gap-4">
                <Field label="Email" htmlFor="email" error={form.errors.email}>
                    <TextInput {...bind(form, 'email')} type="email" autoComplete="username" autoFocus />
                </Field>

                <Field label="Password" htmlFor="password" error={form.errors.password}>
                    <PasswordInput {...bind(form, 'password')} autoComplete="current-password" />
                </Field>

                <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm text-ink-2">
                        <input
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={(event) => form.setData('remember', event.target.checked)}
                            className="size-4 rounded border-line accent-accent"
                        />
                        Remember me
                    </label>
                    <Link href="/forgot-password" className="text-sm font-medium text-accent hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" disabled={form.processing} className="w-full">
                    {form.processing ? 'Logging in...' : 'Log in'}
                </Button>
            </form>

            <details className="mt-5 border-t border-line pt-4 text-sm text-ink-2">
                <summary className="cursor-pointer font-medium text-ink">Demo accounts</summary>
                <ul className="mt-2 grid gap-1">
                    <li>admin@example.com (Admin)</li>
                    <li>manager@example.com (Manager)</li>
                    <li>staff@example.com (Staff)</li>
                    <li className="text-ink-3">Password for all: password</li>
                </ul>
            </details>
        </AuthLayout>
    );
}
