# 59n Portfolio (Dynamic Edition)

A powerful, self-hosted portfolio and blog platform built with Next.js 16. This version includes a full **Admin Dashboard**, **SQLite Database**, and **User Management**, allowing you to manage your content entirely from the web.

## ✨ Key Features

### 🚀 Dynamic Core
- **Database Backed**: Uses SQLite (via Prisma) for robust data storage.
- **Admin Dashboard**: Full `/admin` panel to manage your site.
- **File Uploads**: Drag-and-drop file attachments for blog posts.
- **Analytics**: Built-in content analytics (word counts, post stats).

### 🛠 Administrative Control
- **Content Management**: Create, edit, and delete posts with a rich markdown editor.
- **User Management**: Invite other admins, manage accounts.
- **Site Settings**: Configure site title, SEO descriptions, and footer text directly from the dashboard.
- **Theme Switching**: Toggle between 17+ themes instantly.

### 🎨 Beautiful Frontend
- **Modern Design**: Minimal, dark-themed aesthetics using Tailwind CSS 4.
- **Markdown Rendering**: Beautiful typography for code blocks, tables, and lists.
- **Project Showcase**: Automatically fetch and display GitHub repositories.
- **Search & Filter**: Advanced filtering by tags, year, and attachment availability.

---

## 🐳 Getting Started (Docker - Recommended)

The easiest way to run the app is using Docker. This ensures your database and uploads are preserved.

1. **Clone the repository** (or just download the `docker-compose.yml`)
   ```bash
   git clone https://github.com/59n/modern-folio.git
   cd modern-folio
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env and set a secure AUTH_SECRET
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```
   
4. **Access the Site**
   - **Frontend**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin

### 🔐 First Time Login
When the container starts for the first time, it will automatically generate a secure admin user.
Check the logs to find your login credentials:

```bash
docker-compose logs app | grep "Admin User Created" -A 10
```

*Save these credentials immediately!*

---

## 💻 Local Development

If you want to modify the code:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

3. **Run Dev Server**
   ```bash
   npm run dev
   ```

---

## 📖 Admin Guide

### Managed Content
- **Posts**: Go to **Admin > Posts** to write new articles. You can attach PDF/Zip files directly.
- **Users**: Go to **Admin > Users** to add new administrators.
- **Settings**: Go to **Admin > Settings** to change the site name, description, and footer.

### Themes
The site comes with 17+ pre-configured themes (Cyberpunk, Retro, Dracula, etc.). You can switch the active theme in the **Settings** tab.

### File Attachments
Blog posts support file attachments. Authenticated admins can upload files up to 10MB (configurable). Files are stored locally in the `public/uploads` directory.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (Production-ready file-based DB)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Deployment**: Docker / Docker Compose


