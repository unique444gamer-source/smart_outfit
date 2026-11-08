# SMART OUTFIT

A responsive black-and-white fashion e-commerce starter built with HTML, CSS, vanilla JavaScript, Node.js, Express and MongoDB.

## Run locally

1. Install Node.js 18+ and MongoDB.
2. Copy `.env.example` to `.env` and set `JWT_SECRET` and `MONGODB_URI`.
3. Run `npm install`.
4. Run `npm start`.
5. Open http://localhost:5000

The storefront catalog can display without MongoDB. Login, registration, admin access and order persistence require a working MongoDB connection.

## Included

- Home, shop, product details, cart, checkout, wishlist, login/register and account views
- Search, category filters, sorting, size/color selection, quantity changes
- Cart and wishlist saved in localStorage for guest browsing
- Express API, MongoDB models, JWT auth, password hashing and order creation
- Mobile responsive layout and light/dark theme toggle

## Demo notes

Create an account to place an order. Configure a real payment gateway before accepting online payments. This starter uses Cash on Delivery and a demo online-payment selection only; it does not collect or process card details.

## Admin panel setup

1. Set `ADMIN_NAME`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` (12+ characters) in `.env`.
2. Run `npm run create-admin` once to create/update the admin account.
3. Start the app and sign in using that admin email/password.
4. Open `http://localhost:5000/#admin` to access the dashboard.

Admin APIs are protected by JWT authentication and a database-backed admin role. Never expose `.env` or use the example password in production.
