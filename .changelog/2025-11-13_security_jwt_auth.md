# Changelog - JWT Authentication & Authorization Security Update

**Date**: 2025-11-13
**Type**: Security Fix (Critical)
**Affected Services**: profile-service, chat-service

---

## Summary

Fixed critical IDOR (Insecure Direct Object Reference) vulnerabilities by implementing JWT authentication and authorization across all Profile and Chat service endpoints. Users can now only access and modify their own data.

---

## Changes Made

### New Files Created

#### Profile Service
- `backend/profile-service/src/middleware/auth.ts` - JWT authentication middleware
  - Validates Bearer tokens from Authorization header
  - Extracts user data (userId, provider, email) from JWT
  - Returns 401 for missing/invalid/expired tokens

#### Chat Service
- `backend/chat-service/src/middleware/auth.ts` - JWT authentication middleware (identical to profile-service)

### Modified Files

#### Profile Service
- `backend/profile-service/src/index.ts`
  - Added JWT_SECRET environment variable validation on startup
  - Imported authMiddleware
  - Applied authentication to all protected endpoints
  - Added authorization checks to verify user ownership
  - Enhanced `/profiles/discover` to exclude authenticated user

#### Chat Service
- `backend/chat-service/src/index.ts`
  - Added JWT_SECRET environment variable validation on startup
  - Imported authMiddleware
  - Applied authentication to all protected endpoints
  - Added authorization checks for match participation and ownership
  - Verified user identity for all actions (blocks, reports, messages)

#### Package Files
- `backend/profile-service/package.json` - Added jsonwebtoken dependencies
- `backend/chat-service/package.json` - Added jsonwebtoken dependencies

---

## Endpoints Modified

### Profile Service (5 endpoints)
1. `POST /profile` - Now extracts userId from JWT (breaking change)
2. `GET /profile/:userId` - Requires auth, userId must match token
3. `PUT /profile/:userId` - Requires auth, userId must match token
4. `DELETE /profile/:userId` - Requires auth, userId must match token
5. `GET /profiles/discover` - Requires auth, excludes own profile

### Chat Service (11 endpoints)
1. `GET /matches/:userId` - Requires auth, userId must match token
2. `POST /matches` - Requires auth, user must be participant
3. `GET /messages/:matchId` - Requires auth, user must be in match
4. `POST /messages` - Requires auth, senderId must match token and user must be in match
5. `GET /matches/:userId/unread-counts` - Requires auth, userId must match token
6. `PUT /messages/:matchId/mark-read` - Requires auth, userId must match token and user must be in match
7. `DELETE /matches/:matchId` - Requires auth, user must be in match
8. `POST /blocks` - Requires auth, userId must match token
9. `DELETE /blocks/:userId/:blockedUserId` - Requires auth, userId must match token
10. `GET /blocks/:userId` - Requires auth, userId must match token
11. `POST /reports` - Requires auth, reporterId must match token

---

## Breaking Changes

⚠️ **CLIENT UPDATES REQUIRED**

1. **Authorization Header Required**
   - All protected endpoints now require: `Authorization: Bearer <jwt_token>`
   - Requests without valid token will receive 401 Unauthorized

2. **POST /profile Endpoint Changed**
   - **Before**: `{ userId: "...", name: "...", ... }`
   - **After**: `{ name: "...", ... }` (userId extracted from JWT)

3. **Error Response Codes**
   - Missing/invalid token: 401 Unauthorized
   - Valid token but unauthorized access: 403 Forbidden
   - Clients must handle these new error codes

---

## Authorization Logic

All endpoints follow this security pattern:

```typescript
// 1. Authenticate (via authMiddleware)
// 2. Extract authenticated user ID from JWT
// 3. Verify authorization (user can only access their own data)

const authenticatedUserId = req.user!.userId;
if (requestedUserId !== authenticatedUserId) {
  return res.status(403).json({
    success: false,
    error: 'Forbidden: Cannot access other users\' data'
  });
}
```

---

## Security Improvements

| Vulnerability | Status |
|--------------|--------|
| Users can read any profile | ✅ FIXED |
| Users can modify any profile | ✅ FIXED |
| Users can delete any profile | ✅ FIXED |
| Users can read any match | ✅ FIXED |
| Users can create matches for others | ✅ FIXED |
| Users can read all messages | ✅ FIXED |
| Users can send messages as others | ✅ FIXED |
| Users can block as other users | ✅ FIXED |
| Users can report as other users | ✅ FIXED |

---

## Environment Variables

Both services now require:
```env
JWT_SECRET=<must_match_auth_service>
```

⚠️ The `JWT_SECRET` must be identical across auth-service, profile-service, and chat-service.

---

## Testing Performed

- ✅ TypeScript compilation successful for both services
- ✅ All endpoints properly protected with authMiddleware
- ✅ Authorization checks in place for all user-specific operations
- ✅ Match participation verified for chat operations
- ✅ Error responses provide clear feedback

---

## Migration Guide for Frontend/Mobile

### 1. Obtain JWT Token
```typescript
// Login with auth-service first
const { token } = await authService.login(credentials);
// Store token securely
```

### 2. Add Authorization Header
```typescript
// Add to all API requests
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### 3. Handle New Error Codes
```typescript
try {
  const response = await api.get('/profile/123');
} catch (error) {
  if (error.status === 401) {
    // Token expired or invalid - redirect to login
    redirectToLogin();
  } else if (error.status === 403) {
    // Forbidden - show error message
    showError('You do not have permission to access this resource');
  }
}
```

### 4. Update POST /profile Call
```typescript
// BEFORE
await api.post('/profile', {
  userId: currentUserId,
  name: 'John',
  age: 25
});

// AFTER (userId extracted from JWT)
await api.post('/profile', {
  name: 'John',
  age: 25
});
```

---

## Next Steps

1. ✅ **Complete** - Backend security implementation
2. ⏳ **Pending** - Update mobile app to use Authorization headers
3. ⏳ **Pending** - Update web app to use Authorization headers
4. ⏳ **Pending** - Add integration tests with JWT tokens
5. ⏳ **Pending** - Security audit/penetration testing
6. ⏳ **Pending** - Add admin auth for GET /reports endpoint

---

## Rollback Plan

If issues arise:

1. Revert commits for both services
2. Remove authMiddleware imports
3. Remove authorization checks
4. Remove JWT_SECRET requirement
5. Redeploy previous versions

**Git Commands**:
```bash
# Revert profile-service
cd backend/profile-service
git checkout HEAD~1 src/index.ts
rm src/middleware/auth.ts

# Revert chat-service
cd backend/chat-service
git checkout HEAD~1 src/index.ts
rm src/middleware/auth.ts
```

---

## Documentation

Full security update documentation available at:
- `SECURITY_UPDATES_SUMMARY.md` - Comprehensive details and testing guide

---

## Impact

- **Security**: Critical vulnerabilities fixed
- **Performance**: Minimal overhead (JWT verification is fast)
- **User Experience**: Requires re-authentication if tokens expired
- **Development**: Clients must update to include Authorization headers

---

## Most Recent Task Performed

Successfully implemented JWT authentication and authorization across Profile and Chat services, securing 16 endpoints against IDOR attacks. All endpoints now properly verify user identity and authorization before granting access to resources.
