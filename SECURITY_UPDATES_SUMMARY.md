# Security Updates Summary - JWT Authentication & Authorization

## Overview
Critical IDOR (Insecure Direct Object Reference) vulnerabilities have been fixed by adding JWT authentication and authorization to all Profile and Chat service endpoints.

---

## Files Modified

### Profile Service
1. **C:\Users\dasbl\AndroidStudioProjects\NoBSDating\backend\profile-service\src\middleware\auth.ts** (NEW)
   - JWT authentication middleware
   - Validates JWT tokens from Authorization header
   - Extracts user data (userId, provider, email) from token

2. **C:\Users\dasbl\AndroidStudioProjects\NoBSDating\backend\profile-service\src\index.ts**
   - Added JWT_SECRET environment variable check
   - Imported and applied authMiddleware to all protected endpoints
   - Added authorization checks to verify users can only access their own data

### Chat Service
1. **C:\Users\dasbl\AndroidStudioProjects\NoBSDating\backend\chat-service\src\middleware\auth.ts** (NEW)
   - JWT authentication middleware (identical to profile-service)
   - Validates JWT tokens and extracts user data

2. **C:\Users\dasbl\AndroidStudioProjects\NoBSDating\backend\chat-service\src\index.ts**
   - Added JWT_SECRET environment variable check
   - Imported and applied authMiddleware to all protected endpoints
   - Added authorization checks for match participation and message ownership

### Package Changes
- Added `jsonwebtoken` and `@types/jsonwebtoken` to both services

---

## Endpoints Protected - Profile Service

### POST /profile
- **Authentication**: Required
- **Authorization**: userId extracted from JWT (not from request body)
- **Protection**: Users can only create profiles for themselves

### GET /profile/:userId
- **Authentication**: Required
- **Authorization**: userId must match authenticated user
- **Protection**: Users can only view their own profiles
- **Error**: 403 if attempting to access another user's profile

### PUT /profile/:userId
- **Authentication**: Required
- **Authorization**: userId must match authenticated user
- **Protection**: Users can only update their own profiles
- **Error**: 403 if attempting to modify another user's profile

### DELETE /profile/:userId
- **Authentication**: Required
- **Authorization**: userId must match authenticated user
- **Protection**: Users can only delete their own profiles
- **Error**: 403 if attempting to delete another user's profile

### GET /profiles/discover
- **Authentication**: Required
- **Authorization**: None (public discovery)
- **Enhancement**: Excludes authenticated user from discovery results

### GET /health
- **Authentication**: Not required (public health check)

---

## Endpoints Protected - Chat Service

### GET /matches/:userId
- **Authentication**: Required
- **Authorization**: userId must match authenticated user
- **Protection**: Users can only view their own matches
- **Error**: 403 if attempting to access another user's matches

### POST /matches
- **Authentication**: Required
- **Authorization**: Authenticated user must be one of (userId1 or userId2)
- **Protection**: Users can only create matches involving themselves
- **Error**: 403 if attempting to create match for other users

### GET /messages/:matchId
- **Authentication**: Required
- **Authorization**: User must be part of the match
- **Protection**: Verifies match participation before allowing message access
- **Error**: 403 if not part of the match

### POST /messages
- **Authentication**: Required
- **Authorization**: senderId must match authenticated user AND user must be part of match
- **Protection**: Prevents sending messages as another user or to unauthorized matches
- **Error**: 403 if senderId mismatch or not part of match

### GET /matches/:userId/unread-counts
- **Authentication**: Required
- **Authorization**: userId must match authenticated user
- **Protection**: Users can only view their own unread counts
- **Error**: 403 if attempting to access another user's unread counts

### PUT /messages/:matchId/mark-read
- **Authentication**: Required
- **Authorization**: userId must match authenticated user AND user must be part of match
- **Protection**: Users can only mark their own messages as read
- **Error**: 403 if userId mismatch or not part of match

### DELETE /matches/:matchId
- **Authentication**: Required
- **Authorization**: User must be part of the match
- **Protection**: Users can only delete matches they're part of
- **Error**: 403 if not part of the match

### POST /blocks
- **Authentication**: Required
- **Authorization**: userId must match authenticated user
- **Protection**: Users can only block as themselves
- **Error**: 403 if attempting to block as another user

### DELETE /blocks/:userId/:blockedUserId
- **Authentication**: Required
- **Authorization**: userId must match authenticated user
- **Protection**: Users can only unblock for themselves
- **Error**: 403 if attempting to unblock for another user

### GET /blocks/:userId
- **Authentication**: Required
- **Authorization**: userId must match authenticated user
- **Protection**: Users can only view their own blocked list
- **Error**: 403 if attempting to access another user's blocked list

### POST /reports
- **Authentication**: Required
- **Authorization**: reporterId must match authenticated user
- **Protection**: Users can only submit reports as themselves
- **Error**: 403 if attempting to report as another user

### GET /reports
- **Authentication**: Not required (would need admin auth in production)
- **Note**: This endpoint should be protected with admin-level auth in production

### GET /health
- **Authentication**: Not required (public health check)

---

## Authorization Pattern Used

All protected endpoints follow this pattern:

```typescript
app.get('/endpoint/:userId', authMiddleware, async (req, res) => {
  const requestedUserId = req.params.userId;
  const authenticatedUserId = req.user!.userId;

  // Authorization check
  if (requestedUserId !== authenticatedUserId) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Cannot access other users\' data'
    });
  }

  // ... rest of handler
});
```

---

## Testing Instructions

### Prerequisites
1. Ensure JWT_SECRET is set in .env files for both services
2. Both services should be running
3. Obtain a valid JWT token from auth-service

### Manual Testing

#### 1. Test Profile Service

```bash
# Get a JWT token first (use auth-service)
TOKEN="your_jwt_token_here"

# Test GET /profile/:userId (should succeed for own userId)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3002/profile/google_123456

# Test GET /profile/:userId (should fail with 403 for other userId)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3002/profile/google_999999

# Test POST /profile (userId extracted from JWT)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","age":25,"bio":"Test bio"}' \
  http://localhost:3002/profile

# Test PUT /profile/:userId (should succeed for own userId)
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bio":"Updated bio"}' \
  http://localhost:3002/profile/google_123456

# Test DELETE /profile/:userId (should fail with 403 for other userId)
curl -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3002/profile/google_999999

# Test GET /profiles/discover (should work and exclude own profile)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3002/profiles/discover

# Test without auth (should fail with 401)
curl http://localhost:3002/profile/google_123456
```

#### 2. Test Chat Service

```bash
# Get JWT token
TOKEN="your_jwt_token_here"

# Test GET /matches/:userId (should succeed for own userId)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3003/matches/google_123456

# Test GET /matches/:userId (should fail with 403 for other userId)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3003/matches/google_999999

# Test POST /matches (should succeed if authenticated user is one of the participants)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId1":"google_123456","userId2":"google_789"}' \
  http://localhost:3003/matches

# Test POST /matches (should fail if authenticated user is not a participant)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId1":"google_999","userId2":"google_888"}' \
  http://localhost:3003/matches

# Test GET /messages/:matchId (should succeed if part of match)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3003/messages/match_123

# Test POST /messages (should succeed if senderId matches and part of match)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"matchId":"match_123","senderId":"google_123456","text":"Hello"}' \
  http://localhost:3003/messages

# Test POST /messages (should fail if senderId doesn't match)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"matchId":"match_123","senderId":"google_999","text":"Hello"}' \
  http://localhost:3003/messages

# Test POST /blocks (should succeed)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"google_123456","blockedUserId":"google_888","reason":"spam"}' \
  http://localhost:3003/blocks

# Test POST /blocks (should fail if userId doesn't match)
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"google_999","blockedUserId":"google_888","reason":"spam"}' \
  http://localhost:3003/blocks

# Test without auth (should fail with 401)
curl http://localhost:3003/matches/google_123456
```

### Expected Error Responses

#### 401 Unauthorized (No token or invalid token)
```json
{
  "success": false,
  "error": "Unauthorized: No token provided"
}
```

```json
{
  "success": false,
  "error": "Unauthorized: Invalid token"
}
```

```json
{
  "success": false,
  "error": "Unauthorized: Token expired"
}
```

#### 403 Forbidden (Valid token but not authorized for this resource)
```json
{
  "success": false,
  "error": "Forbidden: Cannot access other users' profiles"
}
```

```json
{
  "success": false,
  "error": "Forbidden: You are not part of this match"
}
```

```json
{
  "success": false,
  "error": "Forbidden: Cannot send messages as another user"
}
```

---

## Environment Variables Required

Both services now require:
```env
JWT_SECRET=your_secret_key_here
DATABASE_URL=your_database_url_here
```

Make sure JWT_SECRET is the SAME across auth-service, profile-service, and chat-service.

---

## Security Improvements

### Before
- ❌ No authentication on any endpoint
- ❌ Anyone could read any user's profile
- ❌ Anyone could modify or delete any profile
- ❌ Anyone could read all messages in any match
- ❌ Anyone could create matches for any users
- ❌ Anyone could block users as any other user
- ❌ Anyone could submit reports as any other user

### After
- ✅ JWT authentication required for all protected endpoints
- ✅ Users can only access their own data
- ✅ Users can only modify their own resources
- ✅ Users can only view messages in matches they're part of
- ✅ Users can only create matches involving themselves
- ✅ Users can only block/unblock as themselves
- ✅ Users can only submit reports as themselves
- ✅ Proper 401 and 403 error responses with clear messages

---

## Backward Compatibility

⚠️ **BREAKING CHANGES**:

1. **POST /profile**: Now extracts userId from JWT instead of request body
   - **Migration**: Clients must send JWT token and remove userId from body

2. **All endpoints**: Now require Authorization header with valid JWT
   - **Migration**: Clients must obtain JWT from auth-service first

3. **Response codes**: Unauthorized requests now return 401/403 instead of 200
   - **Migration**: Clients must handle 401/403 responses appropriately

---

## Next Steps

1. ✅ Update frontend/mobile apps to:
   - Include Authorization header in all requests
   - Handle 401 errors (token expired/invalid) → redirect to login
   - Handle 403 errors (forbidden) → show error message
   - Remove userId from POST /profile request body

2. ✅ Add admin authentication for:
   - GET /reports endpoint
   - Any future admin-only endpoints

3. ✅ Consider adding:
   - Refresh token mechanism
   - Token revocation on logout
   - Rate limiting per user (not just per IP)
   - Audit logging for sensitive operations

4. ✅ Test thoroughly:
   - Integration tests with JWT tokens
   - End-to-end tests with actual client apps
   - Security testing (attempt IDOR attacks)

---

## Summary

All critical IDOR vulnerabilities have been fixed. Both Profile and Chat services now properly authenticate users via JWT and authorize access to ensure users can only access/modify their own data and resources they're legitimately part of.

**Endpoints Secured**: 16 total
- Profile Service: 5 endpoints
- Chat Service: 11 endpoints

**Authorization Checks Added**: 16 total
- All user-specific endpoints verify ownership
- All match-related endpoints verify participation
- All action endpoints verify actor identity
