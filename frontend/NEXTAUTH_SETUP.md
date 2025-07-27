# NextAuth Setup Guide

## Environment Variables

Create a `.env.local` file in your frontend directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:9001
```

## Generate NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use any secure random string generator.

## How It Works

1. **NextAuth API Route**: `/api/auth/[...nextauth]/route.js` handles all auth requests
2. **Credentials Provider**: Uses your existing backend login endpoint
3. **Session Management**: NextAuth handles JWT tokens and refresh tokens
4. **Route Protection**: Middleware protects routes automatically
5. **Hooks**: `useNextAuth.js` provides easy-to-use hooks

## Migration from Old Auth

Your old auth system is still there but can be gradually replaced:

- ✅ `useAuth()` - Now uses NextAuth session
- ✅ `useLogin()` - Uses NextAuth signIn
- ✅ `useLogout()` - Uses NextAuth signOut
- ✅ `useRegister()` - Still uses your backend directly

## Benefits

- **Automatic token refresh**
- **Better security** with CSRF protection
- **Easy OAuth integration** (Google, GitHub, etc.)
- **Built-in session management**
- **TypeScript support**

## Adding OAuth Providers

To add Google OAuth, update your NextAuth config:

```javascript
import GoogleProvider from "next-auth/providers/google";

// In your NextAuth config
providers: [
  CredentialsProvider({...}),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
]
``` 
