# Deploying EthicSupply Backend to Vercel

## Prerequisites

1. A PostgreSQL database (You can use Vercel Postgres, Supabase, Neon, or any other PostgreSQL provider)
2. Vercel account

## Deployment Steps

1. Set up a PostgreSQL database if you don't have one already.

2. In the Vercel dashboard, create a new project and import your GitHub repository.

3. Configure the project settings:

   - **Project Name**: `ethicsupply-backend` (or your preferred name)
   - **Framework Preset**: Select "Other"
   - **Root Directory**: `ethicsupply-backend`

4. Set up the following environment variables:

   - `SECRET_KEY`: A strong random string (e.g., generated with [Djecrety](https://djecrety.ir/))
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `.vercel.app`
   - `VERCEL`: `1`
   - `POSTGRES_NAME`: Your PostgreSQL database name
   - `POSTGRES_USER`: Your PostgreSQL username
   - `POSTGRES_PASSWORD`: Your PostgreSQL password
   - `POSTGRES_HOST`: Your PostgreSQL host
   - `POSTGRES_PORT`: Your PostgreSQL port (usually `5432`)

5. Deploy the project.

6. After deployment, you need to run migrations. You can do this through the Vercel CLI or by setting up a one-time script.

   ```bash
   vercel env pull .env
   python manage.py migrate
   ```

7. Update your frontend's `VITE_API_URL` environment variable to point to your new backend URL:
   - Go to your frontend project settings in Vercel
   - Add/edit the environment variable: `VITE_API_URL=https://your-backend-url.vercel.app/api`
   - Redeploy the frontend to apply the changes

## Troubleshooting

- If you encounter errors related to database connections, check your PostgreSQL credentials and network settings.
- Make sure your database allows connections from Vercel's servers.
- For CORS issues, verify that your frontend URL is included in the ALLOWED_HOSTS setting.
