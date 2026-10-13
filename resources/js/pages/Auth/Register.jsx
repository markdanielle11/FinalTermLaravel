import { Link, useForm } from '@inertiajs/react';
import Button from '../../components/Button';
import { Field, TextInput, bind } from '../../components/Form';
import AuthLayout from '../../layouts/AuthLayout';
import PasswordInput from '../../components/PasswordInput';

export default function Register() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        // Fortify's POST /register -> App\Actions\Fortify\CreateNewUser (assigns the Staff role).
        form.post('/register', { onFinish: () => form.reset('password', 'password_confirmation') });
    };

    return (
        <AuthLayout
            title="Create account"
            heading="Create your account"
            description="New accounts start as Staff. An Admin can change your role later."
            footer={
                <>
                    Already registered?{' '}
                    <Link href="/login" className="font-medium text-accent hover:underline">
                        Log in
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} noValidate className="grid gap-4">
                <Field label="Full name" htmlFor="name" error={form.errors.name}>
                    <TextInput {...bind(form, 'name')} autoComplete="name" autoFocus />
                </Field>

                <Field label="Email" htmlFor="email" error={form.errors.email}>
                    <TextInput {...bind(form, 'email')} type="email" autoComplete="username" />
                </Field>

                <Field label="Password" htmlFor="password" error={form.errors.password} hint="At least 8 characters.">
                    <PasswordInput {...bind(form, 'password')} autoComplete="new-password" />
                </Field>

                <Field label="Confirm password" htmlFor="password_confirmation" error={form.errors.password_confirmation}>
                    <PasswordInput {...bind(form, 'password_confirmation')} autoComplete="new-password" />
                </Field>

                <Button type="submit" disabled={form.processing} className="w-full">
                    {form.processing ? 'Creating account...' : 'Create account'}
                </Button>
            </form>
        </AuthLayout>
    );
}
