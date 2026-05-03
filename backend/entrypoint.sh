#!/bin/sh
python manage.py migrate --noinput
python manage.py seed_categories --noinput 2>/dev/null || true
python manage.py seed_plans --noinput 2>/dev/null || true
exec gunicorn remotejobs_backend.wsgi:application --bind 0.0.0.0:8000
