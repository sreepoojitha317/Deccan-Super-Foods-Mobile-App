# Deccan Super Foods - Mobile App

A mobile shopping application MVP developed for Deccan Super Foods.

The application is designed to give customers a simple and easy way to browse food products, view product details, add products to a cart, select their address and payment type, and continue up to the payment page.

## About the Project

The main goal of this project is to build a basic mobile commerce experience for Deccan Super Foods.

The app includes the complete basic shopping flow:

**Login/Register → Home → Categories → Products → Product Details → Cart → Address → Payment Type → Payment Page**

## Features

- User registration and login
- Persistent login session
- Home screen with Deccan Super Foods branding
- Product categories
- Product listing
- Product details
- Ingredients and allergen information
- Nutrition information
- Product weight and price
- Product rating and stock information
- Add products to cart
- Increase or decrease product quantity
- Remove products from cart
- User-specific cart persistence
- Address selection
- Payment type selection
- Payment page
- Mobile testing using Expo Go

## Product Categories

The current MVP contains five categories:

- Biscuits
- Breads
- Fresh Mints
- Cakes
- Healthy Foods

There are 25 sample products added to demonstrate the shopping flow.

## Product Information

Each product contains details such as:

- Product name
- Description
- Ingredients
- Allergens
- Nutrition
- Storage instructions
- Weight
- Price
- Stock
- Rating
- Category
- State
- Healthy food indicator

The product information is sample/demo data created for the MVP.

## Technology Stack

### Frontend

- React Native
- Expo
- TypeScript

### Backend

- FastAPI
- Python

### Database and Authentication

- Supabase
- Supabase Authentication

### Local Storage

- AsyncStorage

### Testing

- Expo Go

## How the Application Works

The user first creates an account or logs in.

After login, the user can browse the available food categories and products. When a product is selected, the application displays its complete product information.

The user can add products to the cart and change the quantity whenever required. The cart is maintained separately for each logged-in user.

After reviewing the cart, the user can continue by selecting their address and payment type. The current MVP stops at the payment page and does not process a real payment.

## Authentication

Supabase Authentication is used for user registration and login.

User passwords are handled by Supabase Authentication and are not stored in the application's profile table.

Additional user information such as:

- Full name
- Email
- Mobile number

is stored in the profiles table.

The login session is persisted, so users do not need to log in every time they open the application.

## Cart Management

Cart functionality is implemented using React Context.

Users can:

- Add a product
- Increase quantity
- Decrease quantity
- Remove a product
- View the cart count

AsyncStorage is used to keep the cart available locally.

The cart is stored using a user-specific storage key, so different users have separate carts.

## Backend

FastAPI is used to create the backend API.

The mobile application communicates with the FastAPI backend to get product information.
## Database

Supabase PostgreSQL is used as the database.

The current project includes tables for:

- Profiles
- Categories
- Products
- Cart Items
- Addresses
- Delivery Slots
- Orders
- Order Items

The MVP currently uses sample product data stored in Supabase.

## Shopify Integration

The original application design is planned around Shopify for commerce functionality.

However, Shopify credentials and access were not available during this MVP development.

Because of this, the current application uses Supabase and sample data for development and demonstration.

The project structure is designed so that Shopify can be integrated in a future stage for real products, inventory, orders, checkout and other commerce functionality.

## Payment

The current project does not process real payments.

The application only demonstrates the flow up to the payment page.

Real payment processing can be added in a future version.

## Running the Project

### 1. Start the Backend

Open a terminal and run:

```powershell
cd D:\DeccanSuperFoods\backend
.\venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000

### 2. Start the Mobile App

Open another terminal:

cd D:\DeccanSuperFoods\mobile
npx expo start

Scan the QR code using Expo Go on a mobile device.
