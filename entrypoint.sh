#!/bin/sh
python manage.py migrate --noinput
python manage.py seed_categories
python manage.py seed_plans
python manage.py seed_jobs
exec gunicorn remotejobs_backend.wsgi:application --bind 0.0.0.0:${PORT:-8000}
