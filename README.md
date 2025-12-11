# Modern Portfolio & Blog

A high-performance, dynamic portfolio template built with Next.js 14, React Server Components, and Tailwind CSS. Designed to be fast, beautiful, and easy to manage.

![Preview](https://github.com/59n/modern-folio/assets/preview.png)

## Features

- 🚀 **Next.js 14** (App Router)
- 💅 **Aceternity UI** & **Tailwind CSS** for styling
- 📝 **Markdown Blog** with syntax highlighting
- 🔐 **Admin Dashboard** (CMS) included
- 💾 **SQLite Database** (via Prisma)
- 🐳 **Docker Ready**

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/modern-folio.git
cd modern-folio
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="super-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install & Run

```bash
npm install
npm run dev
```

The app will start at `http://localhost:3000`.

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

## Docker Deployment (Production)

This project handles its own Docker setup.

```bash
docker-compose up -d
```

Valid `auth_secret` and environment variables should be set in production.

## License

MIT
