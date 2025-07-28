# 🐻 ShareBear Frontend - Next.js Social Media Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.x-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.x-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Performance-Optimized-green?logo=speed" alt="Performance" />
</p>

Welcome to **ShareBear Frontend**! A high-performance, modern social media platform built with Next.js 15, React 19, and Tailwind CSS. This frontend application is optimized for speed, accessibility, and user experience.

## 🎯 Project Overview

ShareBear Frontend is a complete social media application featuring:
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS and shadcn/ui
- **High Performance**: Optimized for Core Web Vitals and Lighthouse scores
- **Authentication**: NextAuth.js with automatic token refresh
- **Real-time Features**: Dynamic post feed, notifications, and messaging
- **Mobile-First**: Responsive design with mobile bottom navigation
- **Dark/Light Themes**: Multiple theme support with theme switching

---

## 🚀 Features

### **Core Features**
- **User Authentication**: NextAuth.js with JWT tokens
- **Real-time Feed**: Dynamic post feed with infinite scrolling
- **User Profiles**: Complete profile pages with posts, photos, and stats
- **Search & Discovery**: Advanced search functionality
- **Notifications**: Real-time notification system
- **Chat System**: Direct messaging and conversations
- **Reels/Stories**: Video content support

### **Performance Features**
- **Optimized Loading**: Lazy loading and code splitting
- **Image Optimization**: Next.js Image with WebP/AVIF support
- **Bundle Optimization**: Tree shaking and package optimization
- **Performance Monitoring**: Core Web Vitals tracking
- **Caching Strategy**: Static asset and API response caching

---

## 🛠️ Getting Started

### **Prerequisites**
- Node.js 20.x or higher
- npm or yarn package manager
- Backend API running (see main project README)

### **Installation**

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

4. **Start the development server**
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Performance & Analysis
npm run analyze      # Build with bundle analysis
npm run performance  # Build and start for performance testing
```

---

## 🚀 Performance Optimization Guide

### **Overview**
This guide documents the comprehensive performance optimizations implemented to improve the Lighthouse performance score from 45 to target 90+.

### **🎯 Key Performance Issues Addressed**

#### 1. **Largest Contentful Paint (LCP): 4.1s → Target: <2.5s**
- **Problem**: Slow loading of main content
- **Solutions Implemented**:
  - Lazy loading of non-critical components
  - Optimized font loading with `display: swap`
  - Preload critical resources
  - Image optimization with Next.js Image component

#### 2. **Total Blocking Time (TBT): 860ms → Target: <200ms**
- **Problem**: JavaScript blocking main thread
- **Solutions Implemented**:
  - Code splitting with dynamic imports
  - Bundle optimization with tree shaking
  - Lazy loading of heavy components
  - Suspense boundaries for better loading

#### 3. **Speed Index (SI): 2.5s → Target: <3.4s**
- **Problem**: Slow visual loading
- **Solutions Implemented**:
  - Skeleton loading states
  - Progressive image loading
  - Optimized CSS delivery

#### 4. **JavaScript Bundle Size: 1,471 KiB → Target: <500 KiB**
- **Problem**: Massive unused JavaScript
- **Solutions Implemented**:
  - Bundle analyzer integration
  - Tree shaking optimization
  - Code splitting strategies
  - Package import optimization

### **🔧 Optimizations Implemented**

#### **Next.js Configuration (`next.config.mjs`)**
```javascript
// Key optimizations:
- compress: true
- poweredByHeader: false
- generateEtags: false
- Image optimization with WebP/AVIF
- Bundle splitting for Radix UI components
- Tree shaking and side effects optimization
- Caching headers for static assets
```

#### **Font Optimization**
```javascript
const poppins = Poppins({
  display: "swap",        // Prevents layout shift
  preload: true,          // Preloads critical fonts
  fallback: ["system-ui", "arial"], // Fallback fonts
});
```

#### **Component Lazy Loading**
```javascript
// Non-critical components loaded dynamically
const ProfileCard = dynamic(() => import("@/components/ProfileCard"), {
  loading: () => <Skeleton />,
});
```

#### **Performance Monitoring**
- Core Web Vitals tracking
- Real-time performance metrics
- Bundle size monitoring

### **📊 Performance Monitoring**

#### **Core Web Vitals Tracking**
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay  
- **CLS**: Cumulative Layout Shift
- **TTFB**: Time to First Byte

#### **Performance Testing**
```bash
# Build with bundle analysis
npm run analyze

# Performance build and start
npm run performance

# Regular build
npm run build
```

### **🎨 UI/UX Improvements**

#### **Loading States**
- Skeleton components for better perceived performance
- Progressive loading with blur effects
- Smooth transitions and animations

#### **Image Optimization**
- Next.js Image component with WebP/AVIF
- Responsive image sizes
- Lazy loading with blur placeholders
- Error handling and fallbacks

### **📈 Expected Performance Improvements**

| Metric | Before | Target | Status |
|--------|--------|--------|--------|
| Performance Score | 45 | 90+ | 🚧 In Progress |
| LCP | 4.1s | <2.5s | 🚧 In Progress |
| TBT | 860ms | <200ms | 🚧 In Progress |
| SI | 2.5s | <3.4s | 🚧 In Progress |
| Bundle Size | 1,471 KiB | <500 KiB | 🚧 In Progress |

### **🔍 Testing Performance**

#### **Lighthouse Testing**
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Performance" category
4. Run audit on production build

#### **Bundle Analysis**
```bash
npm run analyze
# Opens bundle analyzer in browser
```

#### **Performance Monitoring**
- Check browser console for performance metrics
- Monitor Core Web Vitals in production
- Use Chrome DevTools Performance tab

### **🚀 Additional Recommendations**

#### **1. Server-Side Optimizations**
```javascript
// Backend improvements needed:
- Database query optimization
- API response caching
- CDN implementation
- Server response time < 200ms
```

#### **2. Content Optimization**
```javascript
// Content strategies:
- Implement virtual scrolling for large lists
- Pagination for feed content
- Image compression and optimization
- Critical CSS inlining
```

#### **3. Caching Strategy**
```javascript
// Caching implementation:
- Service Worker for offline support
- Browser caching headers
- API response caching
- Static asset optimization
```

#### **4. Monitoring & Analytics**
```javascript
// Performance monitoring:
- Real User Monitoring (RUM)
- Error tracking and reporting
- Performance budgets
- Automated performance testing
```

### **🛠️ Development Workflow**

#### **Before Committing**
1. Run `npm run build` to check bundle size
2. Test performance with Lighthouse
3. Verify Core Web Vitals are within targets
4. Check for any new performance regressions

#### **Performance Budgets**
- JavaScript: < 500 KiB
- CSS: < 50 KiB  
- Images: < 200 KiB total
- LCP: < 2.5s
- TBT: < 200ms

---

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (home)/            # Main application pages
│   ├── api/               # API routes
│   └── layout.js          # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   ├── Chat/             # Chat system components
│   └── ...               # Other feature components
├── hooks/                # Custom React hooks
├── providers/            # Context providers
├── stores/               # State management
├── utils/                # Utility functions
├── constants/            # Application constants
├── data/                 # Mock data and constants
└── public/               # Static assets
```

---

## 🎨 UI Components

### **shadcn/ui Integration**
This project uses shadcn/ui for consistent, accessible components:
- **Form Components**: Input, Button, Select, etc.
- **Layout Components**: Card, Dialog, Sheet, etc.
- **Navigation**: Tabs, Breadcrumb, etc.
- **Feedback**: Toast, Alert, Progress, etc.

### **Custom Components**
- **MobileBottomNavBar**: Mobile-first navigation
- **ShareBearFeed**: Optimized post feed
- **ProfileCard**: User profile display
- **OptimizedImage**: Performance-focused image component

---

## 🔧 Configuration

### **Next.js Configuration**
- **Image Optimization**: WebP/AVIF support
- **Bundle Optimization**: Tree shaking and code splitting
- **Performance**: Compression and caching headers
- **Security**: Security headers and CSP

### **Tailwind CSS**
- **Custom Theme**: Extended color palette
- **Responsive Design**: Mobile-first approach
- **Performance**: Purged unused styles

### **Performance Monitoring**
- **Core Web Vitals**: Real-time tracking
- **Bundle Analysis**: Size monitoring
- **Error Tracking**: Performance error reporting

---

## 🚀 Deployment

### **Production Build**
```bash
npm run build
npm run start
```

### **Environment Variables**
```env
# Required for production
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### **Performance Checklist**
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals within targets
- [ ] Bundle size < 500 KiB
- [ ] Image optimization enabled
- [ ] Caching headers configured

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Features](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance](https://developers.google.com/web/tools/lighthouse)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test performance impact
5. Submit a pull request

### **Performance Guidelines**
- Monitor bundle size changes
- Test Core Web Vitals impact
- Ensure accessibility compliance
- Follow mobile-first design

---

**Note**: Performance optimization is an ongoing process. Monitor metrics regularly and continue optimizing based on real user data.

---

<p align="center">
  Made with ❤️ for the ShareBear community
</p>
