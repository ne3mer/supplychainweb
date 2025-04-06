# EthicSupply

EthicSupply is a web application designed to help businesses evaluate and monitor the ethical and environmental performance of their suppliers. The platform leverages AI to provide ethical scoring, recommendations, and sustainability insights.

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

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd ethicsupply-backend
   ```

2. Create and activate a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Run migrations:

   ```
   python manage.py migrate
   ```

5. Start the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd ethicsupply-frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. The application will be available at `http://localhost:5173` (or another port if 5173 is in use)

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
