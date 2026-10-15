# FinalTermLaravel: Apparel Inventory System

An inventory system for an apparel shop, built for **INTECH 3112** at Central Luzon State University (BSIT 3-3).
It is our first term project (an apparel inventory system in plain PHP and MySQL) rebuilt in **Laravel 13** with a **React** frontend.

## Features

- **Authentication** with Laravel Fortify: register, login, logout, forgot and reset password, profile and password updates
- **Role-based access** with Spatie Laravel Permission: Admin, Manager, and Staff
- **CRUD** for products, categories, suppliers, and users
- **Stock in/out** with a full stock history (who made each change, quantity before and after)
- **Low-stock alerts**, with a per-product alert level and a summary after login
- **Search, filters, sorting, and pagination** on lists, including a date range filter on stock history
- **Dashboard** with stock totals, stock value, items that need restocking, and units by category
- Light and dark mode

## Tech stack

| Part | Technology |
|---|---|
| Backend | Laravel 13 (PHP 8.3+) |
| Frontend | React 19 with Inertia.js |
| Styling | Tailwind CSS 4 |
| Authentication | Laravel Fortify |
| Roles and permissions | Spatie Laravel Permission |
| Database | MySQL (XAMPP) |

## Roles

| Permission | Admin | Manager | Staff |
|---|:-:|:-:|:-:|
| View dashboard, products, categories, suppliers | Yes | Yes | Yes |
| Create, edit, delete products, categories, suppliers | Yes | Yes | No |
| Stock in/out and view stock history | Yes | Yes | Yes |
| Manage users and roles | Yes | No | No |

New accounts created through the register page start as **Staff**. An Admin can change their role from **Users and roles**.

## Setup

Requirements: PHP 8.3 or newer, Composer, Node.js, and MySQL (XAMPP).

1. Clone the repository and open the folder:
```
   git clone https://github.com/markdanielle11/FinalTermLaravel.git
   cd FinalTermLaravel
```
2. Install the PHP packages:
```
   composer install
```
3. Create the environment file and app key:
```
   copy .env.example .env
   php artisan key:generate
```
4. Start MySQL in XAMPP and create an empty database named `finalterm_inventory` in phpMyAdmin.
5. In `.env`, set the database settings:
```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=finalterm_inventory
   DB_USERNAME=root
   DB_PASSWORD=
```
6. Create the tables and sample data, then install the JavaScript packages:
```
   php artisan migrate --seed
   npm install
```
7. Run the app and open http://localhost:8000:
```
   composer run dev
```

To reset the sample data at any time, run `php artisan migrate:fresh --seed`.

## Demo accounts

The password for all accounts is `password`.

| Email | Role |
|---|---|
| admin@example.com | Admin |
| manager@example.com | Manager |
| staff@example.com | Staff |

## Running the tests

```
php artisan test
```

## Contributors

- Mark Danielle Mendoza
- Lester Salvador
