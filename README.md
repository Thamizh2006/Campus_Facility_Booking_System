# Campus Facility Booking System

This project is set up to deploy with:

- `Frontend/` on Netlify
- `backend/` on Render

## Local setup

1. Install dependencies:

```bash
npm install
npm install --prefix Frontend
npm install --prefix backend
```

2. Create env files:

- Copy `Frontend/.env.example` to `Frontend/.env`
- Copy `backend/.env.example` to `backend/.env`

3. Fill the values:

- `Frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8080
```

- `backend/.env`

```env
PORT=8080
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

4. Start the apps:

```bash
npm run backend:dev
npm run frontend:dev
```

## Deploy backend on Render

This repo includes [`render.yaml`](./render.yaml), so you can deploy with Render Blueprint or create the service manually.

### Render settings

- Root directory: `backend`
- Runtime: `Node`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

### Render environment variables

Set these in Render:

- `NODE_VERSION=20`
- `PORT=10000`
- `MONGO_URI=your-mongodb-connection-string`
- `JWT_SECRET=replace-with-a-long-random-secret`
- `FRONTEND_URL=https://your-site.netlify.app`
- `CORS_ORIGINS=https://your-site.netlify.app,http://localhost:5173`

Important:

- Use only the site origin in `FRONTEND_URL` and `CORS_ORIGINS`, not a path like `/login`
- After deploy, copy the Render backend URL, for example `https://your-api.onrender.com`

## Deploy frontend on Netlify

This repo includes [`netlify.toml`](./netlify.toml).

### Netlify settings

- Base directory: `Frontend`
- Build command: `npm run build`
- Publish directory: `Frontend/dist`

### Netlify environment variable

Set this in Netlify:

- `VITE_API_BASE_URL=https://your-api.onrender.com`

After the first frontend deploy, update Render:

- `FRONTEND_URL=https://your-site.netlify.app`
- `CORS_ORIGINS=https://your-site.netlify.app,http://localhost:5173`

Then redeploy the backend so browser requests from Netlify are allowed.

## Deployment order

1. Deploy the backend to Render
2. Copy the Render service URL into Netlify as `VITE_API_BASE_URL`
3. Deploy the frontend to Netlify
4. Copy the Netlify site URL back into Render as `FRONTEND_URL` and `CORS_ORIGINS`
5. Redeploy the backend

## Notes

- Netlify redirects are already configured for React Router in [`netlify.toml`](./netlify.toml)
- The backend reads `process.env.PORT`, so it works with Render's assigned port
- The frontend already reads `import.meta.env.VITE_API_BASE_URL`, so no code changes are needed in components for production
