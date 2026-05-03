#!/bin/sh
python manage.py migrate --noinput
exec gunicorn remotejobs_backend.wsgi:application --bind 0.0.0.0:${PORT:-8000}
