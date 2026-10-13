<!DOCTYPE html>
<html>
<head>
    <title>Laravel CRUD Demo</title>
</head>
<body>

    <nav>
        <a href="{{ route('products.index') }}">Products</a> |
        <a href="{{ route('product-categories.index') }}">Categories</a>
    </nav>

    <hr>

    @if(session('success'))
        <p style="color: green;">
            {{ session('success') }}
        </p>
    @endif

    @yield('content')

</body>
</html>