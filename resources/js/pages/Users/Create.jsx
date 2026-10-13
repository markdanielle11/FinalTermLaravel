import { useForm } from '@inertiajs/react';
import PageHeader from '../../components/PageHeader';
import UserForm from '../../components/UserForm';
import AppLayout from '../../layouts/AppLayout';

export default function Create({ roles }) {
    const form = useForm({ name: '', email: '', role: 'Staff', password: '', password_confirmation: '' });

    const submit = (event) => {
        event.preventDefault();
        form.post('/admin/users', { onError: () => form.reset('password', 'password_confirmation') });
    };

    return (
        <AppLayout title="Add user">
            <PageHeader title="Add user" />
            <UserForm form={form} onSubmit={submit} roles={roles} submitLabel="Create user" cancelHref="/admin/users" isCreate />
        </AppLayout>
    );
}
