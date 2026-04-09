# RemoteWorkNaija

Global remote jobs platform for Nigerian professionals. Built with Django REST Framework + Next.js.

## Structure

```
RemoteJobNG/
├── backend/          # Django REST API
│   ├── users/        # User accounts, profiles, skills
│   ├── jobs/         # Job listings, saved jobs
│   ├── applications/ # Job applications ATS
│   ├── categories/   # Job categories and skill tags
│   ├── aggregation/  # Job feed aggregation (Sprint 3)
│   └── notifications/# Alerts and emails (Sprint 3)
└── my-app/           # Next.js 15 frontend
```

## Local Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Fill in your values
python manage.py migrate
python manage.py seed_categories
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd my-app
npm install
cp .env.example .env.local  # Fill in your values
npm run dev
```

## Environment Variables

See `backend/.env.example` and `my-app/.env.example` for all required variables.
