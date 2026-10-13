@extends('layouts.app')

@section('content')

<h1>Edit Category</h1>

<form action="{{ route('product-categories.update', $productCategory) }}"
      method="POST">

    @csrf
    @method('PUT')

    <input
        type="text"
        name="name"
        value="{{ $productCategory->name }}"
    >

    <textarea name="description">{{ $productCategory->description }}</textarea>

    <button type="submit">Update</button>

</form>

@endsection