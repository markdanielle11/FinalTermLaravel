import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../layouts/AppLayout';

const messages = {
    403: {
        title: 'You do not have access to this page',
        description: 'Your role does not include this permission. Ask an Admin if you need it.',
    },
    404: {
        title: 'Page not found',
        description: 'The page or record you are looking for does not exist or was deleted.',
    },
};

/**
 * Rendered by AppServiceProvider for 403 and 404 responses.
 * A blocked request (for example Staff opening /admin/users) ends up here.
 */
export default function Error({ status }) {
    const { auth } = usePage().props;
    const message = messages[status] ?? messages[404];

    const content = (
        <div className="py-16">
            <p className="text-sm font-medium text-accent">Error {status}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{message.title}</h1>
            <p className="mt-2 max-w-[55ch] text-sm text-ink-2">{message.description}</p>
            <Link
                href={auth?.user ? '/dashboard' : '/'}
                className="mt-6 inline-flex rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-ink hover:bg-accent-hover"
            >
                {auth?.user ? 'Back to dashboard' : 'Back to home'}
            </Link>
        </div>
    );

    if (auth?.user) {
        return <AppLayout title={`Error ${status}`}>{content}</AppLayout>;
    }

    return (
        <>
            <Head title={`Error ${status}`} />
            <div className="mx-auto max-w-3xl px-4">{content}</div>
        </>
    );
}
