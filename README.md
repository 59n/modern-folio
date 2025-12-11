# Modern Portfolio & Blog

A high-performance, dynamic portfolio template built with Next.js 14, React Server Components, and Tailwind CSS. Designed to be fast, beautiful, and easy to manage.

![Preview](https://github.com/59n/modern-folio/assets/preview.png)

## Navigation

- [Features](#features)
- [Quick Start (Docker)](#quick-start-docker)
- [Development (Localhost)](#development-localhost)
- [Admin Setup](#admin-setup)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## Features

- 🚀 **Next.js 14** (App Router)
- 💅 **Aceternity UI** & **Tailwind CSS** for styling
- 📝 **Markdown Blog** with syntax highlighting
- 🔐 **Admin Dashboard** (CMS) included
- 💾 **SQLite Database** (via Prisma)
- 🐳 **Docker Ready**

## Quick Start (Docker)

This is the recommended way to deploy the application.

1. **Clone and Enter Directory**:
   ```bash
   git clone https://github.com/yourusername/modern-folio.git
   cd modern-folio
   ```

2. **Start the Application**:
   ```bash
   docker-compose up -d
   ```
   The app will start at `http://localhost:3000`.

   *Note: In production, ensure you set a secure `AUTH_SECRET` environment variable.*

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

## License

MIT
