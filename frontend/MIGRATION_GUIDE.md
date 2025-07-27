# Migration Guide: Removing Old Auth Store

## 🗑️ How to Remove the Old Auth Store

### 1. **Files to Delete:**
```bash
# Remove old auth store
rm frontend/stores/authStore.js

# Remove old auth hooks (optional - if you want to use only NextAuth hooks)
rm frontend/hooks/useAuth.js
```

### 2. **Update Components Using Old Auth Store:**

**Before (using old auth store):**
```javascript
import useAuthStore from "@/stores/authStore";

function MyComponent() {
  const { user, token, isAuthenticated } = useAuthStore();
  const { logout } = useAuthStore();
  
  // ...
}
```

**After (using NextAuth):**
```javascript
import { useAuth, useLogout } from "@/hooks/useNextAuth";

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  
  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  // ...
}
```

### 3. **Update API Client (Already Done):**
The `apiclient.js` has already been updated to use NextAuth sessions instead of the Zustand store.

### 4. **Check for Other References:**
Search your codebase for any remaining references to `useAuthStore`:
```bash
grep -r "useAuthStore" frontend/
```

## ✅ Benefits of Removing Old Auth Store:

1. **Simplified State Management** - One source of truth for auth
2. **Better Performance** - No duplicate state
3. **Automatic Token Refresh** - NextAuth handles this
4. **Better Security** - NextAuth has built-in security features
5. **Less Code** - Fewer files to maintain

## 🔄 Alternative: Keep for Additional Data

If you want to keep Zustand for other purposes, see `stores/userStore.js` for an example of how to use it alongside NextAuth for:
- User preferences
- UI state
- Cached data
- App-specific state

## 🎯 Recommended Approach:

1. **Phase 1**: Use both systems temporarily
2. **Phase 2**: Gradually migrate components to NextAuth
3. **Phase 3**: Remove old auth store completely
4. **Phase 4**: Use new user store for additional data if needed

This ensures a smooth transition without breaking existing functionality. 
