@extends('layouts.app')

@section('content')

<h1>Create Category</h1>

<form action="{{ route('product-categories.store') }}" method="POST">

    @csrf

    <input type="text" name="name" placeholder="Category Name">

    <textarea name="description" placeholder="Description"></textarea>

    <button type="submit">Save</button>

</form>

@endsection