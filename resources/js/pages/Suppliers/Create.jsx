import { useForm } from '@inertiajs/react';
import PageHeader from '../../components/PageHeader';
import SupplierForm from '../../components/SupplierForm';
import AppLayout from '../../layouts/AppLayout';

export default function Create() {
    const form = useForm({ name: '', contact_person: '', contact_number: '', email: '', address: '' });

    const submit = (event) => {
        event.preventDefault();
        form.post('/supplier/suppliers');
    };

    return (
        <AppLayout title="Add supplier">
            <PageHeader title="Add supplier" />
            <SupplierForm form={form} onSubmit={submit} submitLabel="Save supplier" cancelHref="/supplier/suppliers" />
        </AppLayout>
    );
}
