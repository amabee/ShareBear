# 🐻 ShareBear - Social Media Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.x-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Fastify-5.x-green?logo=fastify" alt="Fastify" />
  <img src="https://img.shields.io/badge/Node.js-20.x-brightgreen?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Prisma-ORM-blueviolet?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/NextAuth.js-Auth-orange?logo=nextauth" alt="NextAuth" />
</p>

Welcome to **ShareBear**! A modern, full-stack social media platform built with Next.js, Fastify, and Prisma. Share memes, memories, and moments with friends in a secure and user-friendly environment.

## 🎯 Project Overview

ShareBear is a complete social media application with:
- **Modern Frontend**: Next.js 15 with React 19, Tailwind CSS, and shadcn/ui
- **Robust Backend**: Fastify API with Prisma ORM and MySQL
- **Secure Authentication**: NextAuth.js with JWT tokens
- **Real-time Features**: Posts, following, notifications, and more

---

## 🚀 Features

### **Frontend Features**
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS and shadcn/ui
- **Authentication**: NextAuth.js with automatic token refresh
- **Real-time Feed**: Dynamic post feed with infinite scrolling
- **User Profiles**: Complete profile pages with posts, photos, and stats
- **Search & Discovery**: Advanced search functionality
- **Notifications**: Real-time notification system
- **Mobile-First**: Responsive design with mobile bottom navigation
- **Dark/Light Themes**: Multiple theme support with theme switching
- **Reels/Stories**: Video content support
- **Chat System**: Direct messaging and conversations

### **Backend Features**
- **User Authentication** (JWT-based with NextAuth.js)
- **Posts**: Create, update, soft-delete, restore
- **Follow System**: Follow/unfollow users with stats
- **Input Validation**: AJV JSON schema validation
- **Security**: Helmet, rate limiting, anti-bot, CORS
- **File Uploads**: Local and cloud (Cloudflare R2) storage
- **Logging**: Comprehensive system and security logs
- **Database**: MySQL with Prisma ORM

---

## 🛠️ Getting Started

### **Prerequisites**
- Node.js 20.x or higher
- MySQL database
- npm or yarn package manager

### **Backend Setup**

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Environment**
- Copy `.env.example` to `.env` and fill in your secrets:
```env
DATABASE_URL="mysql://user:password@localhost:3306/sharebear"
JWT_SECRET="your-jwt-secret"
# ... other environment variables
```

4. **Database Setup**
```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

5. **Start the backend server**
```bash
npm run dev
```

The backend will be running on `http://localhost:9001`

### **Frontend Setup**

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Environment**
Create `.env.local` file:
```env
# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:9001"
```

4. **Start the frontend development server**
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

### **Quick Start (Both Services)**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

---

## 📚 API Overview

### **Authentication Endpoints**
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT tokens
- `POST /api/auth/refresh` — Refresh JWT access token
- `POST /api/auth/logout` — Logout and invalidate session

### **Posts Endpoints**
- `POST /api/posts/create` — Create a new post
- `PATCH /api/posts/:postId` — Update post (content, privacy, etc.)
- `DELETE /api/posts/:postId` — Soft delete post (sets `isDeleted: true`)
- `POST /api/posts/:postId/restore` — Restore a soft-deleted post
- `GET /api/posts/feed` — Get user's feed (following posts)
- `GET /api/posts/user/:userId` — Get user's posts

### **Follow System Endpoints**
- `POST /api/follow/:followingId` — Follow a user
- `DELETE /api/follow/:followingId` — Unfollow a user
- `GET /api/follow/check/:followingId` — Check follow status
- `GET /api/follow/stats/:userId` — Get follow stats
- `GET /api/follow/followers/:userId` — Get user's followers
- `GET /api/follow/following/:userId` — Get users being followed

### **User Endpoints**
- `GET /api/user/profile/:userId` — Get user profile
- `PATCH /api/user/profile` — Update user profile
- `POST /api/user/avatar` — Upload profile picture
- `POST /api/user/cover` — Upload cover photo

---

## 🔒 Security & Architecture

### **Security Features**
- **NextAuth.js**: Secure authentication with CSRF protection
- **JWT Tokens**: Stateless authentication with automatic refresh
- **Helmet**: HTTP headers & Content Security Policy
- **AJV**: Strict input validation and sanitization
- **XSS Protection**: HTML sanitization and encoding
- **Rate Limiting**: API rate limiting and anti-bot protection
- **CORS**: Configurable cross-origin resource sharing

### **Frontend Architecture**
- **Next.js 15**: App Router with server-side rendering
- **React 19**: Latest React with concurrent features
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **NextAuth.js**: Authentication and session management
- **React Query**: Server state management
- **Zustand**: Client state management (for additional data)

### **Backend Architecture**
- **Fastify**: High-performance web framework
- **Prisma**: Type-safe database ORM
- **MySQL**: Reliable relational database
- **JWT**: JSON Web Token authentication
- **File Upload**: Local and cloud storage support

---

## 📁 Project Structure

```
ShareBear/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages and layouts
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (home)/          # Protected home pages
│   │   └── api/             # API routes (NextAuth)
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── ui/              # shadcn/ui components
│   │   └── ...              # Other feature components
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand state stores
│   └── providers/           # Context providers
├── backend/                 # Fastify API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Database access (Prisma)
│   │   ├── routes/          # API route definitions
│   │   ├── plugins/         # Fastify plugins
│   │   └── utils/           # Helper functions
│   └── prisma/              # Database schema & migrations
└── references/              # Design references and assets
```

## 🚧 Ongoing / In-Progress Features
- **WYSIWYG post content**: Rich text editor with HTML sanitization
- **Real-time notifications**: WebSocket integration for live updates
- **Admin dashboard**: User management and analytics
- **File management**: Cloudflare R2 integration with file deletion
- **Advanced search**: Elasticsearch integration
- **Mobile app**: React Native companion app
- **Comprehensive testing**: Unit, integration, and E2E tests

---

## 🛠️ Development

### **Frontend Development**
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### **Backend Development**
```bash
cd backend
npm run dev          # Start development server
npm run start        # Start production server
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev # Run migrations
```

### **Database Management**
```bash
cd backend
npx prisma studio    # Visual database browser
npx prisma migrate dev # Create and apply migrations
npx prisma generate  # Generate Prisma client
npx prisma db seed   # Seed database (if configured)
```

## 🧪 Testing

### **Frontend Testing**
```bash
cd frontend
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### **Backend Testing**
```bash
cd backend
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🚀 Deployment

### **Frontend Deployment**
- **Vercel** (Recommended): Automatic deployments from Git
- **Netlify**: Static site hosting
- **AWS Amplify**: Full-stack deployment

### **Backend Deployment**
- **Railway**: Easy Node.js deployment
- **Heroku**: Platform as a service
- **AWS EC2**: Self-managed server
- **Docker**: Containerized deployment

### **Environment Variables**
Make sure to set all required environment variables in your deployment platform.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📝 License

This project is **UNLICENSED**. All rights reserved.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing React framework
- **Fastify** team for the high-performance web framework
- **Prisma** team for the excellent ORM
- **shadcn/ui** for the beautiful component library
- **NextAuth.js** team for secure authentication 
