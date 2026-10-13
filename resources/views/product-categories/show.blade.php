@extends('layouts.app')

@section('content')

<h1>{{ $productCategory->name }}</h1>

<p>{{ $productCategory->description }}</p>

<h3>Products</h3>

<ul>
    @foreach($productCategory->products as $product)
        <li>
            {{ $product->name }} - ₱{{ $product->price }}
        </li>
    @endforeach
</ul>

<a href="{{ route('product-categories.index') }}">
    Back
</a>

@endsection