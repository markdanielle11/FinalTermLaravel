import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = 'Apparel Inventory';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob('./pages/**/*.jsx')
        ),

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: '#1f4fd1',
    },

    defaults: {
        // Hovering a link loads the next page in the background; keep it fresh.
        prefetch: { cacheFor: '10s', hoverDelay: 75 },
        // Plain page navigations cross-fade with the browser's View Transitions API.
        // Filter/search visits (preserveState) and form submits update in place.
        visitOptions: (href, options) =>
            (options.method ?? 'get') === 'get' && !options.preserveState ? { viewTransition: true } : {},
    },
});

// Any change to data (POST, PUT, DELETE) clears prefetched pages so nothing shows stale stock numbers.
router.on('start', (event) => {
    if (event.detail.visit.method !== 'get') {
        router.flushAll();
    }
});
