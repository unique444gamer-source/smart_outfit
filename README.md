# SMART OUTFIT — Professional V5

A responsive fashion e-commerce starter built with Express, MongoDB, vanilla JavaScript and CSS.

## V5 storefront design update
- Rebuilt the customer-facing homepage with an editorial fashion hero, dynamic admin-managed banner content, category tiles, featured products, editorial promotion and newsletter section.
- Added responsive mobile layouts and retained product cards, category selection, support form, store settings and admin functionality.
- V4 admin dashboard styling and existing backend routes are preserved.

## V4 design update
- Redesigned admin workspace with a premium editorial dashboard layout.
- Refined navigation sidebar, KPI cards, section surfaces, tables and mobile layouts.
- Existing V3 store-management functions and APIs are preserved.

## V3 additions
- Expanded admin workspace for categories, banners, branding, coupons, support, payment and delivery configuration.
- Category CRUD (name, slug, visibility).
- Homepage banner CRUD and storefront display of the first active banner.
- Store branding settings: store name, logo URL, tagline, theme colors, contact and footer text.
- Order detail view and authenticated PDF invoice download.
- Payment configuration storage for COD and SSLCommerz/aamarPay merchant settings.
- Delivery charge and courier configuration.
- Coupon creation, validation API, expiry and usage-limit fields.
- Customer support ticket submission API and admin status management.

## Requirements
- Node.js 18+
- MongoDB Atlas or local MongoDB

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set `MONGODB_URI`, `JWT_SECRET` (32+ characters), `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (12+ characters).
3. `npm start`
4. Open `http://localhost:5000` and sign in with the bootstrapped administrator credentials.

## Important configuration notes
- Product, banner and category image fields accept image URLs or paths. Product uploads use the existing `/api/admin/uploads` endpoint. For production, use object storage (Cloudinary/S3) or a persistent disk; Render's ephemeral filesystem does not retain uploads across deploys.
- SSLCommerz/aamarPay credentials can be saved in Admin. This release provides the configuration UI and storage only; it does **not** yet create provider checkout sessions, verify payment callbacks, or reconcile transactions. Do not enable online payment for customers until the provider-specific server integration and webhook verification are completed.
- Courier name, delivery rates and API key can be configured. Automated courier booking/tracking still requires integration with the chosen courier's API.
- Coupon validation is available at `POST /api/store/coupon/validate`. Checkout does not automatically apply coupon discounts yet; the frontend checkout integration and order-side recalculation should be added before public promotion.
- Invoice PDF is generated server-side with PDFKit and downloaded from the admin order list. Invoice currently uses English text and BDT amounts.
- The support ticket API is `POST /api/store/support`; a public contact/support form can be connected to it.
- Store settings are exposed publicly only through `/api/store/public`; payment secrets are not returned there. Admin settings responses mask secrets.

## Security / production checklist
- Configure HTTPS and a strict `CLIENT_URL`.
- Use persistent image storage and backups.
- Add rate limiting, CSRF protections as appropriate, request validation and audit logs.
- Complete payment-provider callback verification before accepting online payments.
- Verify inventory server-side at checkout and recalculate all prices/totals on the server (the current starter accepts client totals).
