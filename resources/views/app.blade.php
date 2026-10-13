<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Apparel Inventory</title>

    {{-- Apply the saved (or system) theme before the page paints to avoid a flash. --}}
    <script>
        (function () {
            try {
                var saved = localStorage.getItem('theme');
                var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', dark);
            } catch (e) {}
        })();
    </script>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    @inertiaHead
</head>
<body class="min-h-screen bg-canvas font-sans text-ink antialiased">
    @inertia
</body>
</html>
