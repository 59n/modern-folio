# Modern Portfolio & Blog

A high-performance, dynamic portfolio template built with Next.js 14, React Server Components, and Tailwind CSS. Designed to be fast, beautiful, and easy to manage.

<img width="1893" height="963" alt="NOtYNCoR5cpdpK7c" src="https://github.com/user-attachments/assets/ea4b7650-3adb-4483-93e5-df8c3675f251" />

## Navigation

- [Features](#features)
- [Quick Start (Docker)](#quick-start-docker)
- [Development (Localhost)](#development-localhost)
- [Admin Setup](#admin-setup)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## Features

- 🚀 **Next.js 16** (App Router)
- ⚛️ **React 19** (Server Components)
- 💅 **Aceternity UI** & **Tailwind CSS** for styling
- 📝 **Markdown Blog** with syntax highlighting
- 🔐 **Admin Dashboard** (CMS) included
- 💾 **SQLite Database** (via Prisma)
- 🐳 **Docker Ready**

## Quick Start (Docker)

The easiest way to get started is to use the pre-built Docker image.

1. **Create a `docker-compose.yml` file**:
   Copy and paste the following content into a new file named `docker-compose.yml`:

   ```yaml
   services:
     app:
       container_name: folio-app
       image: ghcr.io/59n/modern-folio:latest
       restart: always
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=file:/app/data/dev.db
         - AUTH_SECRET=your_super_secret_auth_secret_change_me
         - NEXTAUTH_URL=http://localhost:3000
         - AUTH_TRUST_HOST=true
       volumes:
         - db_data:/app/data
         - uploads_data:/app/public/uploads

   volumes:
     db_data:
     uploads_data:
   ```

2. **Start the Application**:
   Run this command in the same directory:
   ```bash
   docker-compose up -d
   ```
   
   The app will start at `http://localhost:3000`.

   *Note: In production, ensure you change the `AUTH_SECRET` to a secure random string.*

## Development (Localhost)

Use this method if you are developing features or modifying the code locally.

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="super-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install & Run

```bash
npm install
npm run dev
```

## Admin Setup

When you first run the application, visit `/admin`. A default admin account will be created if one doesn't exist:

- **Email**: `admin@example.com`
- **Password**: (Check your server console logs for the generated password on first run)

**Important**: Change your credentials immediately after logging in.

## Customization

You can customize the site identity directly from the **Admin > Settings** page:
- Site Name & Description
- Colors & Themes
- Social Links
- Features (Enable/Disable Blog, Projects, etc.)

## Troubleshooting

### Resetting the Database
If you want to clear all data and start fresh (e.g. to remove old demo content):

```bash
docker-compose down -v
docker-compose up -d --build
```
*Note: The `-v` flag deletes the persistent data volumes.*

### Auth Errors
If you see `JWTSessionError` or "no matching decryption secret":
1. Ensure `AUTH_SECRET` is set in your environment.
2. Clear your browser cookies (specifically the `authjs.session-token`).
3. This often happens when the `AUTH_SECRET` changes between deployments.

