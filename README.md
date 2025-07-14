# 🐻 ShareBear Backend

<p align="center">
  <img src="https://img.shields.io/badge/Fastify-5.x-green?logo=fastify" alt="Fastify" />
  <img src="https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Prisma-ORM-blueviolet?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Next.js-Frontend-grey?logo=next.js" alt="Next.js" />
</p>

Welcome to the **ShareBear** backend! This is a modern, secure, and modular API built with Node.js, Fastify, and Prisma. It powers the social features of ShareBear, including posts, authentication, following, and more.

---

## 🚀 Features
- **User Authentication** (JWT-based)
- **Posts**: Create, update, soft-delete, restore
- **Follow System**: Follow/unfollow users
- **Input Validation**: AJV JSON schema
- **Security**: Helmet, rate limiting, anti-bot, CORS
- **File Uploads**: Local and cloud (Cloudflare R2)
- **Logging**: System and security logs

---

## 🛠️ Getting Started

### 1. **Install dependencies**
```bash
npm install
```

### 2. **Configure Environment**
- Copy `.env.example` to `.env` and fill in your secrets (DB, JWT, etc).

### 3. **Run the server**
```bash
npm run dev
```

### 4. **Database**
- Uses **Prisma** ORM. See `prisma/schema.prisma` for models.
- Run migrations:
```bash
npx prisma migrate dev
```

---

## 📚 API Overview

### **Authentication**
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `POST /api/auth/refresh` — Refresh JWT
- `POST /api/auth/logout` — Logout

### **Posts**
- `POST /api/posts/create` — Create a post
- `PATCH /api/posts/:postId` — Update post (content, privacy, etc.)
- `DELETE /api/posts/:postId` — Soft delete post (sets `isDeleted: true`)
- `POST /api/posts/:postId/restore` — Restore a soft-deleted post

### **Follow**
- `POST /api/follow/:followingId` — Follow a user
- `DELETE /api/follow/:followingId` — Unfollow a user
- `GET /api/follow/check/:followingId` — Check follow status
- `GET /api/follow/stats/:userId` — Get follow stats

---

## 🔒 Security Highlights
- **Helmet** for HTTP headers & CSP
- **AJV** for strict input validation
- **sanitize-html** and **he** for XSS protection
- **Rate limiting** and **anti-bot** plugins
- **CORS** with configurable origins

---

## ⚠️ Ongoing / In-Progress Features
- **WYSIWYG post content**: Planned for future (HTML sanitization ready)
- **Admin endpoints**: Not yet implemented
- **File deletion (Cloudflare R2)**: TODO
- **Friend system**: Placeholder only
- **Comprehensive tests**: In progress

---

## 🧩 Project Structure
```
backend/
  src/
    controllers/    # Route handlers
    services/       # Business logic
    repositories/   # DB access (Prisma)
    routes/         # Fastify route definitions
    schema/         # AJV schemas
    plugins/        # Fastify plugins (security, CORS, etc)
    utils/          # Helpers (sanitization, logging)
    media/          # Uploaded files
  prisma/           # Prisma schema & migrations
```

---

## 🤝 Contributing
Pull requests and issues are welcome! Please open an issue to discuss major changes.

---

## 📝 License
This project is **UNLICENSED**. All rights reserved. 
