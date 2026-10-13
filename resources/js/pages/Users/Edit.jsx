import { useForm } from '@inertiajs/react';
import PageHeader from '../../components/PageHeader';
import UserForm from '../../components/UserForm';
import AppLayout from '../../layouts/AppLayout';

export default function Edit({ user, roles }) {
    const form = useForm({
        name: user.name,
        email: user.email,
        role: user.role ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.put(`/admin/users/${user.id}`, { onError: () => form.reset('password', 'password_confirmation') });
    };

    return (
        <AppLayout title={`Edit ${user.name}`}>
            <PageHeader title={`Edit ${user.name}`} />
            <UserForm form={form} onSubmit={submit} roles={roles} submitLabel="Save changes" cancelHref="/admin/users" />
        </AppLayout>
    );
}
