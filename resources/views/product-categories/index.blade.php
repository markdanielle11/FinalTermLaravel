@extends('layouts.app')

@section('content')

<h1>Product Categories</h1>

<a href="{{ route('product-categories.create') }}">
    + Add Category
</a>

<table border="1" cellpadding="8">
    <tr>
        <th>Name</th>
        <th>Products</th>
        <th>Actions</th>
    </tr>

    @foreach($categories as $category)
        <tr>
            <td>{{ $category->name }}</td>
            <td>{{ $category->products->count() }}</td>
            <td>
                <a href="{{ route('product-categories.show', $category) }}">
                    View
                </a>

                <a href="{{ route('product-categories.edit', $category) }}">
                    Edit
                </a>

                <form action="{{ route('product-categories.destroy', $category) }}"
                      method="POST"
                      style="display:inline">
                    @csrf
                    @method('DELETE')
                    <button>Delete</button>
                </form>
            </td>
        </tr>
    @endforeach
</table>

@endsection