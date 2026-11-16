# IN MINI MART

IN MINI MART is a React/Vite storefront with an Express/Mongoose API. The storefront catalog and pending WhatsApp orders use MongoDB; GitHub Pages serves only the static frontend.

## Run locally

1. Install Node.js 20 or newer.
2. In `server`, copy `.env.example` to `.env`, add your MongoDB Atlas URI and strong secrets, then run `npm install` and `npm run dev`.
3. In `client`, run `npm install` and `npm run dev`. Vite proxies `/api` and `/uploads` to the local server.
4. The API seeds missing storefront categories and products from `Products/catalog.json` on startup. Set a unique admin email and password in the server environment.

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for the collection and relationship map and [server/README-store.md](server/README-store.md) for catalog administration details.

## Deploy the frontend to GitHub Pages

The included `.github/workflows/pages.yml` builds and deploys `client` when changes reach `main`. In GitHub, open **Settings → Pages**, select **GitHub Actions** as the build and deployment source, and add a repository variable named `VITE_API_URL` with the HTTPS origin of your deployed API (for example, `https://api.example.com`). Then push this repository to GitHub; the Actions run publishes the site at `https://<owner>.github.io/IN-Mini-Mart/`.

GitHub Pages cannot run Express or connect securely to MongoDB. Deploy `server` to a Node.js host such as Render or Railway, keep `MONGODB_URI`, JWT secrets, and admin credentials in that host's environment settings, and set `FRONTEND_URL` to the exact GitHub Pages origin (for this project: `https://<owner>.github.io`). The server must also be deployed from the repository root so its catalog seed can read `Products/catalog.json`. Configure the API host's persistent image storage before relying on uploaded images; the local `server/uploads` directory is not durable on many hosts.

Use GitHub **Actions** to check the frontend deploy status. Set `VITE_API_URL` before a production build so the storefront reads and writes through the hosted API. Do not put MongoDB credentials or server secrets in `VITE_*` variables; those are embedded in public browser code.
