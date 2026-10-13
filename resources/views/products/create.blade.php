@extends('layouts.app')

@section('content')

<h1>Create Product</h1>

<form action="{{ route('products.store') }}" method="POST">

    @csrf

    <input type="text" name="name" placeholder="Product Name">

    <select name="product_category_id">
        <option value="">Select Category</option>

        @forelse($categories as $category)
            <option value="{{ $category->id }}">
                {{ $category->name }}
            </option>
        @empty
            <option value="" disabled>
                No categories available
            </option>
        @endforelse
    </select>

    <input type="number" name="price" placeholder="Price">

    <input type="number" name="stock" placeholder="Stock">

    <textarea name="description" placeholder="Description"></textarea>

    <button type="submit">Save</button>

</form>

@endsection