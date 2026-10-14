import { useForm } from '@inertiajs/react';
import PageHeader from '../../components/PageHeader';
import SupplierForm from '../../components/SupplierForm';
import AppLayout from '../../layouts/AppLayout';

export default function Edit({ supplier }) {
    const form = useForm({
        name: supplier.name,
        contact_person: supplier.contact_person ?? '',
        contact_number: supplier.contact_number ?? '',
        email: supplier.email ?? '',
        address: supplier.address ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        form.put(`/supplier/suppliers/${supplier.id}`);
    };

    return (
        <AppLayout title={`Edit ${supplier.name}`}>
            <PageHeader title={`Edit ${supplier.name}`} />
            <SupplierForm requireChanges form={form} onSubmit={submit} submitLabel="Save changes" cancelHref="/supplier/suppliers" />
        </AppLayout>
    );
}
