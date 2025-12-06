# NoBS Dating (VLVT) - Implementation Details

## Overview

This document provides detailed information about the implementation of the NoBS Dating app, including architecture decisions, technologies used, and how different components interact.

## Architecture

### Backend Architecture (Microservices)

The backend is built using a microservices architecture with three independent services, all deployed on Railway with a shared PostgreSQL database.

#### 1. Auth Service (Port 3001)

**Purpose**: Handles user authentication and authorization

**Technology**: Node.js, TypeScript, Express

**Authentication Methods**:
- Sign in with Apple (verified via `apple-signin-auth` library)
- Sign in with Google (verified via `google-auth-library`)
- Email/Password (bcrypt hashing, email verification)

**Token Management**:
- Access tokens: JWT with 7-day expiration
- Refresh tokens: Stored in database with revocation support
- Tokens contain: userId, provider, email

**Security Features**:
- Rate limiting (`authLimiter`, `generalLimiter`)
- Helmet security headers
- Token revocation tracking (`revoked_at` column)

**Key Endpoints**:
- `POST /auth/apple` - Apple OAuth sign-in
- `POST /auth/google` - Google OAuth sign-in
- `POST /auth/register` - Email/password registration
- `POST /auth/login` - Email/password login
- `POST /auth/verify` - Verify JWT token
- `POST /auth/refresh` - Refresh access token
- `POST /auth/revoke` - Revoke refresh token
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset completion

#### 2. Profile Service (Port 3002)

**Purpose**: Manages user profiles, discovery, and swipes

**Technology**: Node.js, TypeScript, Express, Sharp (image processing)

**Storage**:
- Profile data: PostgreSQL
- Images: Cloudflare R2 (private bucket with presigned URLs)

**Features**:
- Full CRUD for profiles
- Photo upload with automatic resizing and EXIF stripping
- Location-based discovery using Haversine formula
- Swipe/like/pass with mutual match detection
- Block and report functionality

**Key Endpoints**:
- `POST /profile` - Create profile
- `GET /profile/:userId` - Get profile (resolves photo URLs)
- `PUT /profile/:userId` - Update profile
- `DELETE /profile/:userId` - Delete profile
- `PUT /profile/:userId/location` - Update location
- `POST /profile/photos/upload` - Upload photo to R2
- `DELETE /profile/photos/:photoId` - Delete photo
- `PUT /profile/photos/reorder` - Reorder photos
- `GET /profiles/discover` - Discovery with filters (age, distance, interests)
- `POST /swipes` - Record like/pass, detect mutual matches
- `GET /swipes/received` - Users who liked me
- `GET /swipes/sent` - Users I liked

**Image Processing**:
- Accepts: JPEG, PNG, HEIC, HEIF, WebP
- Converts to: JPEG (progressive)
- Sizes: Large (1200x1200), Thumbnail (200x200)
- Privacy: All EXIF metadata stripped (including GPS)
- Storage: Cloudflare R2 with presigned URLs (1-hour expiry)

#### 3. Chat Service (Port 3003)

**Purpose**: Handles matches and real-time messaging

**Technology**: Node.js, TypeScript, Express, Socket.io, Firebase Admin

**Storage**: PostgreSQL

**Features**:
- Match management
- Real-time messaging via WebSocket
- Push notifications via Firebase Cloud Messaging
- Typing indicators
- Read receipts

**Key Endpoints**:
- `GET /matches/:userId` - Get all matches
- `POST /matches` - Create match (typically automatic on mutual like)
- `GET /messages/:matchId` - Get conversation messages
- `POST /messages` - Send message

**Socket.io Events**:
- `join` - Join a match room
- `message` - Send/receive messages
- `typing` - Typing indicators
- `read` - Read receipts

### Database Schema

PostgreSQL with 6 migration files covering:

1. **users** - Authentication info (id, provider, email, password_hash)
2. **profiles** - Profile data (user_id, name, age, bio, photos[], interests[], latitude, longitude)
3. **matches** - Match relationships
4. **messages** - Chat messages with timestamps
5. **swipes** - Like/pass records for match detection
6. **blocks** - Block relationships for safety
7. **reports** - User reports for moderation
8. **refresh_tokens** - Token tracking with revocation

### Frontend Architecture (Flutter)

#### State Management

Provider pattern with dependency injection:

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => AuthService()),
    ChangeNotifierProxyProvider<AuthService, ProfileApiService>(...),
    ChangeNotifierProxyProvider<AuthService, ChatApiService>(...),
    ChangeNotifierProxyProvider<ProfileApiService, LocationService>(...),
    ChangeNotifierProvider(create: (_) => SubscriptionService()),
  ],
)
```

#### Services

- **AuthService** - Authentication state, JWT token management
- **ProfileApiService** - Profile CRUD, photo uploads
- **ChatApiService** - Matches, messaging
- **SocketService** - Real-time WebSocket connection
- **LocationService** - GPS location with permission handling
- **SubscriptionService** - RevenueCat integration
- **NotificationService** - Push notification handling

#### Authentication Flow

1. User opens app → AuthWrapper checks token
2. If no valid token → AuthScreen
3. User taps OAuth button → Native SDK handles auth
4. App sends identity token to backend
5. Backend verifies with provider, returns JWT
6. Token stored in flutter_secure_storage
7. App navigates to MainScreen

#### Subscription Gating

1. After auth, SubscriptionService checks RevenueCat
2. Checks for "premium_access" entitlement
3. If active → Full access to Discovery, Matches, Profile
4. If inactive → PaywallScreen blocks premium features
5. Purchase via RevenueCat → Entitlement updates
6. App unlocks features

### Security Implementation

#### Backend Security

| Feature | Implementation |
|---------|----------------|
| OAuth Verification | Real verification via apple-signin-auth, google-auth-library |
| Password Hashing | bcrypt with cost factor 10 |
| JWT Tokens | HS256 algorithm, 7-day expiry |
| Refresh Tokens | Database-tracked with revocation support |
| Rate Limiting | express-rate-limit (auth: 5/min, general: 100/min) |
| Headers | Helmet (hides X-Powered-By, sets security headers) |
| Input Validation | express-validator on all endpoints |
| SQL Injection | Parameterized queries ($1, $2 placeholders) |
| Image Privacy | EXIF stripping, presigned URLs |

#### Frontend Security

| Feature | Implementation |
|---------|----------------|
| Token Storage | flutter_secure_storage (Keychain/Keystore) |
| Network | HTTPS only in production |
| Sensitive Data | Never logged, never in state dumps |

### RevenueCat Integration

#### Configuration

1. RevenueCat dashboard → Create project
2. Configure products (subscriptions)
3. Create "premium_access" entitlement
4. Link entitlement to products
5. Get API keys for iOS/Android
6. Configure in `app_config.dart`

#### Usage

```dart
// Check entitlement
final customerInfo = await Purchases.getCustomerInfo();
final hasPremium = customerInfo.entitlements.all['premium_access']?.isActive ?? false;

// Purchase
final offerings = await Purchases.getOfferings();
final package = offerings.current!.availablePackages.first;
await Purchases.purchasePackage(package);

// Restore
await Purchases.restorePurchases();
```

### Cloudflare R2 Integration

#### Configuration

Required environment variables for profile-service:
```
R2_ACCOUNT_ID=<cloudflare account id>
R2_ACCESS_KEY_ID=<r2 api token access key>
R2_SECRET_ACCESS_KEY=<r2 api token secret>
R2_BUCKET_NAME=vlvt-images
R2_URL_EXPIRY_SECONDS=3600
```

#### Flow

1. **Upload**: Client → Profile Service → Sharp processing → R2 bucket
2. **Storage**: R2 object key stored in PostgreSQL (not URL)
3. **Retrieval**: API generates presigned URL on-demand (1-hour expiry)
4. **Security**: URLs can't be guessed, expire automatically

### Deployment

#### Railway Services

- **auth-service** - Dockerfile deployment
- **profile-service** - Dockerfile deployment
- **chat-service** - Dockerfile deployment
- **PostgreSQL** - Railway managed database

#### Environment Variables

Each service requires:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Shared secret for JWT verification
- `NODE_ENV=production` - Disables test endpoints
- Service-specific variables (R2, Firebase, OAuth)

### Testing

#### Backend Testing

- Jest test suites in `backend/*/tests/`
- Supertest for HTTP endpoint testing
- Test database configuration in `tests/setup.ts`

```bash
cd backend/auth-service && npm test
cd backend/profile-service && npm test
cd backend/chat-service && npm test
```

#### Frontend Testing

- Widget tests in `frontend/test/`
- Integration tests for critical flows

```bash
cd frontend
flutter analyze
flutter test
```

#### Test Users

For beta testing, 20 test users available (google_test001 - google_test020):
- Enable with `ENABLE_TEST_ENDPOINTS=true`
- Seed via `POST /auth/seed-test-users`
- Login via `POST /auth/test-login { "userId": "google_test001" }`

---

**Last Updated**: December 2025
