# OptiEthic - Ethical Supply Chain Management

A full-stack application for managing and analyzing ethical supply chains.

## Project Structure

- **ethicsupply-frontend**: React frontend built with Vite, TypeScript, and Tailwind CSS
- **ethicsupply-backend**: Django REST API backend

## Deployment Guide for Render.com

### Set Up Your Render Account

1. Sign up for a free account at [Render.com](https://render.com)
2. Connect your GitHub repository

### Deploy the Backend API

1. In your Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:

   - **Name**: optiethic-backend
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn ethicsupply.wsgi:application`
   - **Root Directory**: `ethicsupply-backend`

4. Add environment variables:

   - `DEBUG`: False
   - `SECRET_KEY`: (generate a secure random string)
   - `ALLOWED_HOSTS`: your-backend-app.onrender.com
   - `CORS_ALLOWED_ORIGINS`: https://your-frontend-app.onrender.com

5. Create a PostgreSQL database:

   - In your Render dashboard, click "New" and select "PostgreSQL"
   - Name it "optiethic-db"
   - After creation, copy the "Internal Database URL"
   - Add it as an environment variable for your Web Service:
     - `DATABASE_URL`: (the copied PostgreSQL URL)

6. Deploy the service

### Deploy the Frontend

1. In your Render dashboard, click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:

   - **Name**: optiethic-frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Root Directory**: `ethicsupply-frontend`

4. Add environment variables:

   - `VITE_API_URL`: https://your-backend-app.onrender.com/api
   - `VITE_ENABLE_MOCK_DATA`: false

5. Add a redirect rule to handle client-side routing:

   - In the "Redirects/Rewrites" section, add a rule:
   - Source: `/*`
   - Destination: `/index.html`
   - Type: Rewrite

6. Deploy the service

### Verify Deployment

1. Wait for both deployments to complete (this may take a few minutes)
2. Visit your frontend URL (e.g., https://optiethic-frontend.onrender.com)
3. The application should connect to the backend API and function properly

## Local Development

### Backend Setup

```bash
cd ethicsupply-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd ethicsupply-frontend
npm install
npm run dev
```

## Features

- **Dashboard**: View key metrics on supplier performance, including ethical scores, CO₂ emissions, and industry breakdowns
- **Supplier Evaluation**: Assess suppliers based on multiple ethical and environmental criteria
- **Supplier List**: Browse, sort, and filter your supplier network with visual indicators of performance
- **AI Recommendations**: Receive tailored recommendations to improve your supply chain's sustainability

## Tech Stack

### Backend

- Django (Python)
- Django REST Framework
- SQLite database (for development)

### Frontend

- React with Vite
- Tailwind CSS for styling
- Recharts for data visualization
- Heroicons for UI icons

## API Endpoints

- `GET /api/suppliers/`: List all suppliers
- `POST /api/suppliers/`: Create a new supplier
- `POST /api/suppliers/evaluate/`: Evaluate a supplier
- `GET /api/dashboard/`: Get dashboard statistics

## Screenshots

(Screenshots will be added here)

## License

MIT License

## Contact

For inquiries, please contact [your-email@example.com](mailto:your-email@example.com)
