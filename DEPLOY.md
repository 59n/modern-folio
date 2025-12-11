# Deployment Guide

This guide covers how to deploy the Modern Folio application in a production environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option A: Docker Deployment (Recommended)](#option-a-docker-deployment-recommended)
3. [Option B: Manual Node.js Deployment](#option-b-manual-nodejs-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Management](#database-management)

---

## Prerequisites

- **Domain Name**: A domain pointing to your server's IP.
- **Server**: A VPS (Virtual Private Server) running Linux (Ubuntu 20.04/22.04 recommended).
- **Git**: Installed on the server.

---

## Option A: Docker Deployment (Recommended)

This is the simplest way to get up and running.

### 1. Install Docker
If you haven't already, install Docker and Docker Compose:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### 2. Prepare the Project
Clone the repository or copy your project files to the server.
```bash
git clone https://github.com/59n/modern-folio.git
cd modern-folio
```

### 3. Configure Environment
Create a `.env` file for production. You can use the example:
```bash
cp .env.example .env
```

Edit `.env` and set secure values:
```env
# Database
DATABASE_URL="file:/app/data/prod.db"

# Authentication (Generate access via `openssl rand -base64 32`)
AUTH_SECRET="your-secure-random-string-here"
AUTH_TRUST_HOST=true
NEXTAUTH_URL="https://your-domain.com"
```

### 4. Start the Service
Using the provided `docker-compose.yml`:

```bash
docker-compose up -d
```

Your app is now running on port `3000`.

### 5. Setup Reverse Proxy (Nginx) with SSL
Do not expose port 3000 directly. Use Nginx and Certbot for SSL.

```bash
# Install Nginx & Certbot
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

Create an Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/folio
```

Add the following (replace `your-domain.com`):
```nginx
server {
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/folio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d your-domain.com
```

---

## Option B: Manual Node.js Deployment

Use this if you prefer managing the Node process yourself with PM2.

### 1. Install Dependencies
```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### 2. Build the Application
```bash
npm install
npm run build
```

### 3. Database Setup
Initialize the SQLite database (or configure Postgres/MySQL in .env).
```bash
npx prisma migrate deploy
```

### 4. Start with PM2
```bash
pm2 start npm --name "folio" -- start
pm2 save
pm2 startup
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string for the database | `file:./dev.db` or `postgresql://...` |
| `AUTH_SECRET` | Secret key for session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | The implementation url, used for auth redirects | `https://example.com` |
| `AUTH_TRUST_HOST` | Set to `true` if behind a proxy (like Docker/Nginx) | `true` |

---

## Database Management

This project uses **Prisma**.

- **Backup**: If using SQLite, simply copy the `.db` file from the `./data` volume.
- **Studio**: To view data visually, run `npx prisma studio` locally.

### Resetting Admin Password
If you get locked out, access the server/container and verify the logs or manually manipulate the DB using Prisma Studio locally with a downloaded copy of the DB.
