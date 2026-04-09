# Deployment

---

## Local Development

### Option A: Docker (recommended)

```bash
git clone https://github.com/sirsahol/RemoteJobNG
cd RemoteJobNG
docker compose up --build
```

What Docker does automatically:
1. Builds backend image (python:3.12-slim + requirements)
2. Builds frontend image (node:20-alpine + npm ci + npm run build)
3. Runs `python manage.py migrate`
4. Runs `python manage.py seed_categories`
5. Runs `python manage.py seed_plans`
6. Starts Django dev server on port 8000
7. Starts Next.js production server on port 3000

URLs:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1/
- Swagger UI: http://localhost:8000/api/docs/
- Django Admin: http://localhost:8000/admin/

### Option B: Manual

**Prerequisites:** Python 3.12+, Node.js 20+

```bash
# Clone
git clone https://github.com/sirsahol/RemoteJobNG
cd RemoteJobNG

# Backend
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env — set SECRET_KEY to any random string for local dev
python manage.py migrate
python manage.py seed_categories
python manage.py seed_plans
python manage.py runserver      # http://127.0.0.1:8000

# Frontend (new terminal)
cd ../my-app
npm install
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev                     # http://localhost:3000
```

---

## Production Deployment

### Prerequisites

- VPS with Docker + Docker Compose installed (DigitalOcean, Hetzner, AWS EC2, etc.)
- Domain pointing to your server's IP
- SSL certificate (Let's Encrypt via Certbot or Nginx proxy manager)

### Environment Variables

**Backend (`backend/.env` on the server — NEVER commit this):**

```env
# Django
SECRET_KEY=<generate-with-python-secrets>
DEBUG=False
ALLOWED_HOSTS=api.remoteworknaija.com,remoteworknaija.com
CORS_ALLOWED_ORIGINS=https://remoteworknaija.com

# Database
DATABASE_URL=postgres://user:password@db:5432/remoteworknaija

# JWT
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# Paystack
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=https://remoteworknaija.com

# Cloudinary (for media uploads)
USE_CLOUDINARY=True
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Static
STATIC_URL=/static/
MEDIA_URL=/media/
```

**Frontend (`my-app/.env.local` on server or as build args):**

```env
NEXT_PUBLIC_API_URL=https://api.remoteworknaija.com
NEXT_PUBLIC_SITE_URL=https://remoteworknaija.com
NEXT_PUBLIC_SITE_NAME=RemoteWorkNaija
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
```

### Generating a Strong SECRET_KEY

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Docker Compose (production)

For production, override the docker-compose with a production variant:

```yaml
# docker-compose.prod.yml
version: "3.9"

services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: remoteworknaija
      POSTGRES_USER: rwn_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  backend:
    build:
      context: ./backend
    env_file: ./backend/.env
    depends_on:
      - db
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn remotejobs_backend.wsgi:application --bind 0.0.0.0:8000 --workers 3"

  frontend:
    build:
      context: ./my-app
      args:
        NEXT_PUBLIC_API_URL: https://api.remoteworknaija.com
        NEXT_PUBLIC_SITE_URL: https://remoteworknaija.com
    ports:
      - "3000:3000"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - certbot_certs:/etc/letsencrypt
    depends_on:
      - backend
      - frontend

volumes:
  pgdata:
  certbot_certs:
```

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Nginx Configuration

```nginx
# /etc/nginx/conf.d/default.conf

server {
    listen 80;
    server_name remoteworknaija.com www.remoteworknaija.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name remoteworknaija.com;

    ssl_certificate /etc/letsencrypt/live/remoteworknaija.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/remoteworknaija.com/privkey.pem;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name api.remoteworknaija.com;

    ssl_certificate /etc/letsencrypt/live/api.remoteworknaija.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.remoteworknaija.com/privkey.pem;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 10M;  # For resume uploads
    }

    location /static/ {
        alias /app/staticfiles/;
    }
}
```

---

## PostgreSQL Migration

The codebase is currently using SQLite for local dev. The Django ORM is fully DB-agnostic — switching to PostgreSQL requires only:

**Step 1:** Add psycopg2 to requirements:
```
psycopg2-binary==2.9.9
```

**Step 2:** Update `settings.py` to use `DATABASE_URL`:
```python
import dj_database_url
DATABASES = {
    "default": dj_database_url.config(
        default="sqlite:///db.sqlite3",
        conn_max_age=600
    )
}
```
Add `dj-database-url` to requirements.txt.

**Step 3:** Set `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgres://rwn_user:password@localhost:5432/remoteworknaija
```

**Step 4:** Run migrations — all existing migrations are DB-agnostic:
```bash
python manage.py migrate
python manage.py seed_categories
python manage.py seed_plans
```

---

## Production Checklist

Before going live, verify:

- [ ] `DEBUG=False` in production `.env`
- [ ] `SECRET_KEY` is a strong random value (50+ chars), not the dev default
- [ ] `ALLOWED_HOSTS` includes your domain
- [ ] `CORS_ALLOWED_ORIGINS` is set to your frontend domain only
- [ ] `DATABASE_URL` points to PostgreSQL (not SQLite)
- [ ] `USE_CLOUDINARY=True` with valid Cloudinary credentials
- [ ] `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY` are live keys
- [ ] `FRONTEND_URL` is the production domain (for Paystack callback URL)
- [ ] Paystack webhook URL configured in Paystack dashboard
- [ ] `python manage.py collectstatic` has been run
- [ ] SSL certificate installed and HTTPS redirects in place
- [ ] `db.sqlite3` is NOT accessible from the web
- [ ] `.env` files are NOT committed to git

---

## Scheduled Tasks (Phase 2)

Currently, `fetch_jobs` must be run manually or via a cron job. In Phase 2, Celery + Redis will automate this.

**Temporary cron approach (until Celery):**
```bash
# Add to server crontab: crontab -e
0 */6 * * * cd /app && /usr/local/bin/python manage.py fetch_jobs >> /var/log/fetch_jobs.log 2>&1
0 0 * * * cd /app && /usr/local/bin/python manage.py expire_jobs >> /var/log/expire_jobs.log 2>&1
```

This fetches jobs every 6 hours and expires overdue listings daily at midnight.

---

## Backups

```bash
# PostgreSQL backup
docker exec -t db pg_dump -U rwn_user remoteworknaija > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20260408.sql | docker exec -i db psql -U rwn_user -d remoteworknaija
```

Schedule daily backups and store off-server (S3, Backblaze B2, etc.).
