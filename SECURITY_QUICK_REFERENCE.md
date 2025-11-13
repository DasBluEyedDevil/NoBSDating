# Security Quick Reference - JWT Authentication

## Quick Start

### Environment Setup
```bash
# Add to .env files for both profile-service and chat-service
JWT_SECRET=your_secret_key_here  # MUST match auth-service
```

### Making Authenticated Requests

```bash
# 1. Get JWT token from auth-service
curl -X POST http://localhost:3001/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken":"<google_id_token>"}'

# Response: { "token": "eyJhbGc...", "userId": "google_123", ... }

# 2. Use token in subsequent requests
curl -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:3002/profile/google_123
```

---

## Endpoint Security Matrix

| Endpoint | Auth Required | Authorization Check | Can Access |
|----------|--------------|---------------------|------------|
| **Profile Service** |
| `POST /profile` | ✅ Yes | userId from JWT | Own profile only |
| `GET /profile/:userId` | ✅ Yes | :userId = JWT userId | Own profile only |
| `PUT /profile/:userId` | ✅ Yes | :userId = JWT userId | Own profile only |
| `DELETE /profile/:userId` | ✅ Yes | :userId = JWT userId | Own profile only |
| `GET /profiles/discover` | ✅ Yes | None (public) | All profiles except own |
| `GET /health` | ❌ No | N/A | Public |
| **Chat Service** |
| `GET /matches/:userId` | ✅ Yes | :userId = JWT userId | Own matches only |
| `POST /matches` | ✅ Yes | JWT userId in {userId1, userId2} | Matches involving self |
| `GET /messages/:matchId` | ✅ Yes | User in match | Messages in own matches |
| `POST /messages` | ✅ Yes | senderId = JWT userId & user in match | Can send as self only |
| `GET /matches/:userId/unread` | ✅ Yes | :userId = JWT userId | Own unread counts |
| `PUT /messages/:matchId/mark-read` | ✅ Yes | userId = JWT userId & user in match | Mark own messages |
| `DELETE /matches/:matchId` | ✅ Yes | User in match | Delete own matches |
| `POST /blocks` | ✅ Yes | userId = JWT userId | Block as self only |
| `DELETE /blocks/:userId/:id` | ✅ Yes | :userId = JWT userId | Unblock own blocks |
| `GET /blocks/:userId` | ✅ Yes | :userId = JWT userId | Own blocked list |
| `POST /reports` | ✅ Yes | reporterId = JWT userId | Report as self only |
| `GET /reports` | ❌ No | None (needs admin) | All reports |
| `GET /health` | ❌ No | N/A | Public |

---

## Error Responses

### 401 Unauthorized - No/Invalid/Expired Token
```json
{
  "success": false,
  "error": "Unauthorized: No token provided"
}
```

### 403 Forbidden - Valid Token, Unauthorized Access
```json
{
  "success": false,
  "error": "Forbidden: Cannot access other users' profiles"
}
```

---

## Common Authorization Patterns

### Pattern 1: Own Resource Access
```typescript
// GET /profile/:userId, PUT /profile/:userId, DELETE /profile/:userId
if (req.params.userId !== req.user!.userId) {
  return res.status(403).json({ error: 'Forbidden: Cannot access other users\' data' });
}
```

### Pattern 2: Match Participation
```typescript
// GET /messages/:matchId, POST /messages
const matchCheck = await pool.query(
  'SELECT id FROM matches WHERE id = $1 AND (user_id_1 = $2 OR user_id_2 = $2)',
  [matchId, req.user!.userId]
);

if (matchCheck.rows.length === 0) {
  return res.status(403).json({ error: 'Forbidden: You are not part of this match' });
}
```

### Pattern 3: Action Identity Verification
```typescript
// POST /messages, POST /blocks, POST /reports
if (req.body.userId !== req.user!.userId) {
  return res.status(403).json({ error: 'Forbidden: Can only perform actions as yourself' });
}
```

---

## Testing Checklist

### Profile Service Tests
- [ ] `POST /profile` - Creates profile for authenticated user
- [ ] `GET /profile/:userId` - Returns 403 for other userId
- [ ] `PUT /profile/:userId` - Returns 403 for other userId
- [ ] `DELETE /profile/:userId` - Returns 403 for other userId
- [ ] `GET /profiles/discover` - Excludes authenticated user
- [ ] All protected endpoints - Return 401 without token

### Chat Service Tests
- [ ] `GET /matches/:userId` - Returns 403 for other userId
- [ ] `POST /matches` - Returns 403 if user not participant
- [ ] `GET /messages/:matchId` - Returns 403 if not in match
- [ ] `POST /messages` - Returns 403 if senderId mismatch
- [ ] `POST /messages` - Returns 403 if not in match
- [ ] `POST /blocks` - Returns 403 if userId mismatch
- [ ] `DELETE /blocks/:userId/:id` - Returns 403 for other userId
- [ ] `GET /blocks/:userId` - Returns 403 for other userId
- [ ] `POST /reports` - Returns 403 if reporterId mismatch
- [ ] All protected endpoints - Return 401 without token

---

## Client Integration Checklist

### Mobile App / Web App
- [ ] Store JWT token securely after login
- [ ] Add `Authorization: Bearer <token>` header to all API calls
- [ ] Handle 401 errors → redirect to login
- [ ] Handle 403 errors → show permission denied message
- [ ] Remove `userId` from `POST /profile` request body
- [ ] Refresh token mechanism (if implemented)
- [ ] Clear token on logout
- [ ] Test all endpoints with authenticated user
- [ ] Test all endpoints verify authorization (can't access others' data)

---

## Files to Review

### Authentication Middleware
- `backend/profile-service/src/middleware/auth.ts`
- `backend/chat-service/src/middleware/auth.ts`

### Main Service Files
- `backend/profile-service/src/index.ts`
- `backend/chat-service/src/index.ts`

### Documentation
- `SECURITY_UPDATES_SUMMARY.md` - Full details
- `.changelog/2025-11-13_security_jwt_auth.md` - Changelog

---

## Troubleshooting

### Issue: 401 Unauthorized
**Cause**: Missing, invalid, or expired token
**Solution**:
1. Verify token is included in Authorization header
2. Check token format: `Bearer <token>`
3. Verify JWT_SECRET matches across services
4. Get new token from auth-service

### Issue: 403 Forbidden
**Cause**: Valid token but user not authorized for resource
**Solution**:
1. Verify userId in request matches authenticated user
2. For matches: verify user is participant
3. For messages: verify user is in the match
4. Check request parameters match JWT payload

### Issue: "JWT_SECRET is not configured"
**Cause**: Missing JWT_SECRET environment variable
**Solution**:
1. Add JWT_SECRET to .env file
2. Ensure value matches auth-service
3. Restart service

---

## Production Deployment

### Pre-deployment Checklist
- [ ] JWT_SECRET set in production environment for all services
- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] JWT_SECRET matches across auth/profile/chat services
- [ ] Client apps updated to send Authorization headers
- [ ] Error handling implemented for 401/403 responses
- [ ] Integration tests passing with JWT auth
- [ ] Load testing completed
- [ ] Security audit completed

### Deployment Steps
1. Deploy profile-service with new auth
2. Deploy chat-service with new auth
3. Update mobile app version
4. Update web app version
5. Monitor error rates (401/403)
6. Monitor authentication success rates

---

## Support

For issues or questions:
1. Check `SECURITY_UPDATES_SUMMARY.md` for detailed information
2. Review `.changelog/2025-11-13_security_jwt_auth.md` for changes
3. Test endpoints using examples in this guide
4. Verify JWT_SECRET configuration

---

**Last Updated**: 2025-11-13
**Version**: 1.0.0
**Status**: ✅ Complete and Ready for Testing
