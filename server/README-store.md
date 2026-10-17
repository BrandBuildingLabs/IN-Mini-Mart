# IN MINI MART catalog and ordering setup

This repo already has an Express/Mongoose server. The storefront catalog now lives in MongoDB in `storecatalogproducts`; WhatsApp checkout creates pending records in `storeorders`. Existing product/user/cart/payment collections are left in place.

## Local steps (PowerShell)

1. Install Node.js 20+ and run MongoDB locally, or use MongoDB Atlas. Copy `.env.example` to `.env` if you need to recreate the ignored local environment file. Put the Atlas application connection URI in `MONGODB_URI`.
2. In `server`, install dependencies with `npm install`, then start `npm run dev`. At startup, the server creates the configured admin on first run and imports new product IDs from `../Products/catalog.json` into MongoDB without overwriting existing product records.
3. In a second terminal, run `npm install` and `npm run dev` inside `client`. Vite proxies `/api` and `/uploads` to Express on port 8080.
4. Sign in using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`; then open `/dashboard/catalog`. Product add/edit and uploaded images are saved through routes protected by the existing JWT auth and ADMIN role middleware.
5. Customers add products to the basket, provide name and phone, then select **Place order on WhatsApp**. Express validates IDs/quantities, reads current Mongo product prices, saves a pending order snapshot, and then WhatsApp opens with the order reference. This implements shop-confirmed pay-on-delivery ordering; Stripe checkout remains a separate pre-existing feature.

## Atlas and Compass

In Atlas, create a deployment, create a database user, allow the client IP in the project's IP access list, and copy the application connection string into `MONGODB_URI`. Atlas requires both the allowed IP and database user for app connections: https://www.mongodb.com/docs/atlas/connect-to-database-deployment/

Connect Compass using the same URI. After the server starts, select `in-mini-mart` and inspect `storecatalogproducts` and `storeorders`. Compass connection instructions: https://www.mongodb.com/docs/atlas/compass-connection/

## Store API routes

- `GET /api/catalog` — category list plus active Mongo catalog products.
- `POST /api/catalog/products` — add a product (admin bearer token).
- `PUT /api/catalog/products/:id` — update a product (admin bearer token).
- `POST /api/catalog/products/:id/image` — upload JPG/PNG/WEBP/AVIF image, up to 5 MB.
- `POST /api/catalog/seed` — admin-only idempotent catalog import.
- `POST /api/store-orders` — create a pending customer order.
- `GET /api/store-orders/admin` and `PATCH /api/store-orders/:id/status` — admin order management endpoints.

Change the sample admin password before sharing or deploying. For production, use HTTPS, a secure persistent image-storage provider, and actual payment integration if customers should pay online.
