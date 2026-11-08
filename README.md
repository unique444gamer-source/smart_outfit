# SMART OUTFIT

Responsive fashion e-commerce starter built with HTML, CSS, vanilla JavaScript, Node.js, Express and MongoDB Atlas.

## Render deployment

**Build Command:** `npm install`

**Start Command:** `npm start`

Add these in Render → your Web Service → Environment:

- `MONGODB_URI`: MongoDB Atlas connection string for database `smart_outfit`
- `JWT_SECRET`: a random secret of at least 32 characters
- `CLIENT_URL`: `https://smart-outfit-g4vp.onrender.com`
- `ADMIN_NAME`: desired admin display name
- `ADMIN_EMAIL`: desired admin login email
- `ADMIN_PASSWORD`: strong password of at least 12 characters

The server connects to MongoDB before it starts listening. If MongoDB is unavailable or required secrets are missing, deployment fails visibly instead of serving a storefront with broken authentication. On first successful startup, the admin account is created automatically if it does not already exist. Existing admin passwords are not overwritten on every restart.

After deployment, check `https://YOUR-SERVICE.onrender.com/api/health`. The response should include `"database":"connected"`.

## Local development

1. Install Node.js 18+.
2. Copy `.env.example` to `.env` and fill in the values.
3. Run `npm install` then `npm start`.
4. Open `http://localhost:5000`.

## Included

- Responsive black-and-white premium storefront inspired by the supplied desktop/mobile UI references
- Redesigned admin workspace with sales summary, order status controls and customer directory
- Customer order cards with delivery-status progress tracking
- Storefront, product catalog, cart, wishlist, checkout and customer account
- Register/login using bcrypt password hashing and JWT sessions
- Admin dashboard protected by database-backed admin role
- Order creation, order status updates and customer listing
- Cash on Delivery demo flow; online payments require a real payment gateway

Never commit `.env` or share database credentials.
