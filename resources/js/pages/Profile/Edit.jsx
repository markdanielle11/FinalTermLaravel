import { useForm } from '@inertiajs/react';
import Button from '../../components/Button';
import { Field, TextInput } from '../../components/Form';
import PageHeader from '../../components/PageHeader';
import Panel from '../../components/Panel';
import AppLayout from '../../layouts/AppLayout';
import useAuth from '../../lib/useAuth';
import PasswordInput from '../../components/PasswordInput';

/**
 * Both forms submit to routes provided by Fortify. Fortify validates with named
 * error bags, so each useForm() reads its own bag via the errorBag option.
 */
export default function Edit({ roles }) {
    const { user } = useAuth();

    const profile = useForm({ name: user.name, email: user.email });
    const password = useForm({ current_password: '', password: '', password_confirmation: '' });

    const saveProfile = (event) => {
        event.preventDefault();
        profile.put('/user/profile-information', {
            errorBag: 'updateProfileInformation',
            preserveScroll: true,
        });
    };

    const savePassword = (event) => {
        event.preventDefault();
        password.put('/user/password', {
            errorBag: 'updatePassword',
            preserveScroll: true,
            onSuccess: () => password.reset(),
            onError: () => password.reset('current_password', 'password', 'password_confirmation'),
        });
    };

    const field = (form, name) => ({
        id: `${form === profile ? 'profile' : 'password'}-${name}`,
        value: form.data[name],
        error: form.errors[name],
        onChange: (event) => {
            form.setData(name, event.target.value);
            form.clearErrors(name);
        },
    });

    return (
        <AppLayout title="Profile">
            <PageHeader title="Profile" description={`Signed in as ${roles.join(', ') || 'a user with no role'}.`} />

            <div className="grid max-w-2xl gap-6">
                <Panel title="Account information">
                    <form onSubmit={saveProfile} noValidate className="grid gap-4">
                        <Field label="Full name" htmlFor="profile-name" error={profile.errors.name} required>
                            <TextInput {...field(profile, 'name')} autoComplete="name" />
                        </Field>
                        <Field label="Email" htmlFor="profile-email" error={profile.errors.email} required>
                            <TextInput {...field(profile, 'email')} type="email" autoComplete="username" />
                        </Field>
                        <div>
                            <Button type="submit" disabled={profile.processing}>
                                {profile.processing ? 'Saving...' : 'Save changes'}
                            </Button>
                        </div>
                    </form>
                </Panel>

                <Panel title="Change password">
                    <form onSubmit={savePassword} noValidate className="grid gap-4">
                        <Field label="Current password" htmlFor="password-current_password" error={password.errors.current_password} required>
                            <PasswordInput {...field(password, 'current_password')} autoComplete="current-password" />
                        </Field>
                        <Field label="New password" htmlFor="password-password" error={password.errors.password} hint="At least 8 characters." required>
                            <PasswordInput {...field(password, 'password')} autoComplete="new-password" />
                        </Field>
                        <Field label="Confirm new password" htmlFor="password-password_confirmation" error={password.errors.password_confirmation} required>
                            <PasswordInput {...field(password, 'password_confirmation')} autoComplete="new-password" />
                        </Field>
                        <div>
                            <Button type="submit" disabled={password.processing}>
                                {password.processing ? 'Saving...' : 'Change password'}
                            </Button>
                        </div>
                    </form>
                </Panel>
            </div>
        </AppLayout>
    );
}
