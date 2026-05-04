FROM python:3.12-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from backend folder
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy all backend code to the current WORKDIR (/app)
COPY backend/ .

# Ensure entrypoint is in the right place (if it was moved to root)
# Or just copy it from the backend if it was left there.
# Since I moved it to root, I'll copy it from root.
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["sh", "entrypoint.sh"]
