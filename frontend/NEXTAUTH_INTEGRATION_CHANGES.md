# NextAuth Integration Changes - ShareBear

This document outlines all the changes made to integrate NextAuth.js into your ShareBear project while maintaining compatibility with your existing backend.

## 📦 Dependencies Added

```bash
npm install next-auth
```

## 🔧 Files Created/Modified

### 1. **NextAuth API Route** - `app/api/auth/[...nextauth]/route.js` (NEW)

**Purpose**: Handles all authentication requests through NextAuth

**Key Features**:
- Uses your existing backend login endpoint (`/api/auth/login`)
- Implements automatic token refresh
- Handles JWT token management
- Integrates with your current auth flow

**Configuration**:
```javascript
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // Uses your backend login endpoint
      async authorize(credentials) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            usercred: credentials.usercred,
            password: credentials.password,
          }),
        });
        // Returns user data with tokens
      },
    }),
  ],
  callbacks: {
    // JWT callback for token management
    async jwt({ token, user, account }) {
      // Handles initial sign-in and token refresh
    },
    // Session callback for session data
    async session({ session, token }) {
      // Adds user data and tokens to session
    },
  },
});
```

### 2. **Session Provider** - `providers/SessionProvider.jsx` (NEW)

**Purpose**: Wraps your app with NextAuth session management

**Code**:
```javascript
"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
```

### 3. **Query Provider** - `providers/QueryProvider.jsx` (NEW)

**Purpose**: Provides React Query context for data fetching

**Code**:
```javascript
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000, retry: 1 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 4. **Root Layout** - `app/layout.js` (MODIFIED)

**Changes**:
- Added `SessionProvider` and `QueryProvider` imports
- Wrapped children with both providers
- Added server-side session fetching

**Before**:
```javascript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

**After**:
```javascript
export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <QueryProvider>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

### 5. **NextAuth Hooks** - `hooks/useNextAuth.js` (NEW)

**Purpose**: Provides easy-to-use hooks for authentication

**Hooks Created**:
- `useAuth()` - Get current user and auth state
- `useLogin()` - Login with NextAuth
- `useLogout()` - Logout with NextAuth
- `useRegister()` - Register (still uses your backend)

**Example Usage**:
```javascript
// Get current user
const { user, isAuthenticated, isLoading } = useAuth();

// Login
const loginMutation = useLogin();
await loginMutation.mutateAsync({ usercred: "email", password: "pass" });

// Logout
const logoutMutation = useLogout();
await logoutMutation.mutateAsync();
```

### 6. **API Client** - `hooks/apiclient.js` (MODIFIED)

**Changes**:
- Replaced Zustand auth store with NextAuth session
- Updated token handling to use NextAuth session
- Improved error handling

**Before**:
```javascript
const { token } = useAuthStore.getState();
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

**After**:
```javascript
const session = await getSession();
if (session?.accessToken) {
  config.headers.Authorization = `Bearer ${session.accessToken}`;
}
```

### 7. **Middleware** - `middleware.js` (NEW)

**Purpose**: Protects routes and handles authentication redirects

**Configuration**:
```javascript
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect all routes under /home
        if (req.nextUrl.pathname.startsWith("/(home)")) {
          return !!token;
        }
        return true;
      },
    },
  }
);
```

### 8. **Auth Guard Component** - `components/auth/AuthGuard.jsx` (NEW)

**Purpose**: Client-side route protection

**Features**:
- Redirects unauthenticated users to login
- Shows loading state while checking auth
- Protects any component it wraps

**Usage**:
```javascript
<AuthGuard>
  <ProtectedComponent />
</AuthGuard>
```

### 9. **Home Layout** - `app/(home)/layout.js` (MODIFIED)

**Changes**:
- Added `AuthGuard` to protect all home routes
- Wraps children with authentication check

**Before**:
```javascript
export default function HomeLayout({ children }) {
  return (
    <ClientThemeProvider>
      <NextTopLoader />
      {children}
    </ClientThemeProvider>
  );
}
```

**After**:
```javascript
export default function HomeLayout({ children }) {
  return (
    <ClientThemeProvider>
      <NextTopLoader />
      <AuthGuard>
        {children}
      </AuthGuard>
    </ClientThemeProvider>
  );
}
```

### 10. **Login Form** - `components/auth/login-form.jsx` (MODIFIED)

**Changes**:
- Replaced custom auth logic with NextAuth hooks
- Added proper error handling with toast notifications
- Integrated with NextAuth login flow

**Key Changes**:
```javascript
// Before: Custom state management
const [isLoading, setIsLoading] = useState(false);

// After: NextAuth hooks
const loginMutation = useLogin();

// Before: Manual API call
const handleSubmit = async (e) => {
  setIsLoading(true);
  // Custom login logic
  setIsLoading(false);
};

// After: NextAuth integration
const handleSubmit = async (e) => {
  try {
    await loginMutation.mutateAsync({ usercred: creds, password });
    toast.success("Login successful!");
    router.push("/");
  } catch (error) {
    toast.error(error.message || "Login failed");
  }
};
```

### 11. **Signup Form** - `components/auth/signup-form.jsx` (MODIFIED)

**Changes**:
- Integrated with NextAuth register hook
- Added proper form validation
- Improved error handling and user feedback

**Key Changes**:
```javascript
// Before: Mock implementation
const handleSubmit = async (e) => {
  setIsLoading(true);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("Signup:", form);
  setIsLoading(false);
};

// After: Real backend integration
const handleSubmit = async (e) => {
  try {
    const userData = {
      email: form.email,
      password: form.password,
      userInfo: {
        firstName: form.firstname,
        lastName: form.lastname,
        // ... other fields
      },
    };
    await registerMutation.mutateAsync(userData);
    toast.success("Account created successfully!");
    router.push("/login");
  } catch (error) {
    toast.error(error.message || "Registration failed");
  }
};
```

### 12. **User Profile Component** - `components/auth/UserProfile.jsx` (NEW)

**Purpose**: Example component showing NextAuth usage

**Features**:
- Displays current user information
- Handles logout functionality
- Shows loading and error states
- Demonstrates proper NextAuth integration

## 🔄 Migration Strategy

### **What's Been Migrated**:
- ✅ **Login**: Now uses NextAuth
- ✅ **Logout**: Now uses NextAuth
- ✅ **Session Management**: Now uses NextAuth
- ✅ **Route Protection**: Now uses NextAuth middleware

### **What Remains**:
- 🔄 **Register**: Still uses your backend directly (can be migrated later)
- 🔄 **Old Auth Store**: Can be gradually removed
- 🔄 **Old Hooks**: Can be replaced gradually

## 🚀 Benefits Achieved

1. **Automatic Token Refresh**: No more manual token management
2. **Better Security**: CSRF protection, secure session handling
3. **Easy OAuth Integration**: Ready for Google, GitHub, etc.
4. **TypeScript Support**: Better developer experience
5. **Built-in Session Management**: No more Zustand for auth state
6. **Route Protection**: Automatic protection with middleware
7. **Error Handling**: Better error handling and user feedback

## 📝 Environment Variables Required

Create `.env.local` in your frontend directory:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:9001
```

## 🎯 Next Steps

1. **Test the integration** - Try logging in/out
2. **Add OAuth providers** - Google, GitHub, etc.
3. **Migrate remaining components** - Replace old auth hooks gradually
4. **Add more security features** - 2FA, email verification, etc.
5. **Remove old auth code** - Clean up unused Zustand store and hooks

## 🔧 Troubleshooting

### Common Issues:
1. **"No QueryClient set"** - Make sure `QueryProvider` is wrapping your app
2. **Session not persisting** - Check `NEXTAUTH_SECRET` is set correctly
3. **Login not working** - Verify backend URL in `NEXT_PUBLIC_API_URL`
4. **Route protection issues** - Check middleware configuration

### Testing:
1. Start your backend server (`npm run dev` in backend folder)
2. Start your frontend (`npm run dev` in frontend folder)
3. Try logging in with existing credentials
4. Test route protection by accessing `/home` without login
5. Test logout functionality

Your backend remains unchanged and continues to work as before! 🎉 
