# Firebase Analytics Implementation Guide

This guide documents all analytics events, user properties, and screen tracking implemented in the NoBS Dating app.

## Table of Contents
- [Overview](#overview)
- [Setup](#setup)
- [Authentication Events](#authentication-events)
- [Profile Events](#profile-events)
- [Discovery Events](#discovery-events)
- [Match Events](#match-events)
- [Messaging Events](#messaging-events)
- [Safety Events](#safety-events)
- [Subscription Events](#subscription-events)
- [User Properties](#user-properties)
- [Screen Tracking](#screen-tracking)
- [Viewing Analytics in Firebase Console](#viewing-analytics-in-firebase-console)
- [Custom Funnel Analysis](#custom-funnel-analysis)

## Overview

Firebase Analytics has been integrated throughout the NoBS Dating app to track user behavior, engagement, and conversion metrics. All analytics are handled through a centralized `AnalyticsService` that provides type-safe methods for logging events.

**Key Features:**
- Automatic screen view tracking via FirebaseAnalyticsObserver
- Comprehensive event tracking for all major user actions
- User property tracking for segmentation
- Graceful error handling (analytics failures never crash the app)
- Debug logging in development mode

## Setup

### Prerequisites

1. **Firebase Project**: Ensure you have a Firebase project with Analytics enabled
2. **Configuration Files**:
   - iOS: `GoogleService-Info.plist` in `ios/Runner/`
   - Android: `google-services.json` in `android/app/`

### Initialization

Analytics is automatically initialized in `main.dart`:

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp();
  // Analytics is initialized automatically with Firebase

  runApp(const MyApp());
}
```

The `AnalyticsService.getObserver()` is added to MaterialApp's `navigatorObservers` to enable automatic screen tracking.

## Authentication Events

### login_success
**Tracked when:** User successfully logs in
**Method:** `AnalyticsService.logLogin(String method)`
**Parameters:**
- `loginMethod`: "apple" | "google"

**Example:**
```dart
await AnalyticsService.logLogin('apple');
```

### login_failed
**Tracked when:** Login attempt fails
**Method:** `AnalyticsService.logLoginFailed(String method, String reason)`
**Parameters:**
- `method`: "apple" | "google"
- `reason`: Error description (e.g., "user_cancelled", "backend_error_401")

**Example:**
```dart
await AnalyticsService.logLoginFailed('google', 'user_cancelled');
```

### signup_started
**Tracked when:** User begins signup process
**Method:** `AnalyticsService.logSignupStarted()`
**Parameters:** None

### signup_completed
**Tracked when:** User completes signup
**Method:** `AnalyticsService.logSignupCompleted(String method)`
**Parameters:**
- `signUpMethod`: Authentication method used

## Profile Events

### profile_created
**Tracked when:** User creates their profile for the first time
**Method:** `AnalyticsService.logProfileCreated()`
**Parameters:** None

**Note:** This event also triggers user property updates (age group, gender, signup date).

### profile_updated
**Tracked when:** User updates their existing profile
**Method:** `AnalyticsService.logProfileUpdated({Map<String, dynamic>? fields})`
**Parameters:**
- `fields` (optional): Map of field names that were updated

**Example:**
```dart
await AnalyticsService.logProfileUpdated(
  fields: {'bio': true, 'interests': true}
);
```

### profile_viewed (own)
**Tracked when:** User views their own profile
**Method:** `AnalyticsService.logOwnProfileViewed()`
**Parameters:** None

### profile_viewed (other)
**Tracked when:** User views another user's profile
**Method:** `AnalyticsService.logProfileViewed(String profileId)`
**Parameters:**
- `profile_id`: ID of the viewed profile

## Discovery Events

### profile_liked
**Tracked when:** User likes a profile in discovery
**Method:** `AnalyticsService.logProfileLiked(String profileId)`
**Parameters:**
- `profile_id`: ID of the liked profile

### profile_passed
**Tracked when:** User passes on a profile in discovery
**Method:** `AnalyticsService.logProfilePassed(String profileId)`
**Parameters:**
- `profile_id`: ID of the passed profile

### profile_undo
**Tracked when:** User undoes their last action (like/pass)
**Method:** `AnalyticsService.logProfileUndo(String action)`
**Parameters:**
- `action`: "like" | "pass"

### filters_applied
**Tracked when:** User applies discovery filters
**Method:** `AnalyticsService.logFiltersApplied(Map<String, dynamic> filters)`
**Parameters:**
- `min_age`: Minimum age filter
- `max_age`: Maximum age filter
- `max_distance`: Maximum distance in miles
- `interests_count`: Number of selected interests
- `has_active_filters`: Boolean indicating if filters are active

**Example:**
```dart
await AnalyticsService.logFiltersApplied({
  'min_age': 25,
  'max_age': 35,
  'max_distance': 25.0,
  'interests_count': 3,
  'has_active_filters': true,
});
```

## Match Events

### match_created
**Tracked when:** A new match is created
**Method:** `AnalyticsService.logMatchCreated(String matchId)`
**Parameters:**
- `match_id`: Unique identifier for the match

### match_opened
**Tracked when:** User opens a match to view/chat
**Method:** `AnalyticsService.logMatchOpened(String matchId)`
**Parameters:**
- `match_id`: Unique identifier for the match

### unmatch
**Tracked when:** User unmatches with another user
**Method:** `AnalyticsService.logUnmatch(String matchId)`
**Parameters:**
- `match_id`: Unique identifier for the match

## Messaging Events

### message_sent
**Tracked when:** User sends a message
**Method:** `AnalyticsService.logMessageSent(String conversationId)`
**Parameters:**
- `conversation_id`: Match ID / conversation identifier

**Note:** Message content is NOT tracked for privacy reasons.

### conversation_opened
**Tracked when:** User opens a conversation
**Method:** `AnalyticsService.logConversationOpened(String conversationId)`
**Parameters:**
- `conversation_id`: Match ID / conversation identifier

## Safety Events

### user_reported
**Tracked when:** User reports another user
**Method:** `AnalyticsService.logUserReported(String reportedUserId, String reason)`
**Parameters:**
- `reported_user_id`: ID of the reported user
- `reason`: Report reason (e.g., "inappropriate_content", "harassment")

**Example:**
```dart
await AnalyticsService.logUserReported(userId, 'inappropriate_content');
```

### user_blocked
**Tracked when:** User blocks another user
**Method:** `AnalyticsService.logUserBlocked(String blockedUserId)`
**Parameters:**
- `blocked_user_id`: ID of the blocked user

## Subscription Events

### paywall_viewed
**Tracked when:** User views the premium subscription paywall
**Method:** `AnalyticsService.logPaywallViewed({String? source})`
**Parameters:**
- `source` (optional): Where the paywall was triggered from (e.g., "likes_limit", "discovery")

**Example:**
```dart
await AnalyticsService.logPaywallViewed(source: 'likes_limit');
```

### subscription_started
**Tracked when:** User starts a premium subscription
**Method:** `AnalyticsService.logSubscriptionStarted(String productId, double price)`
**Parameters:**
- `product_id`: RevenueCat product identifier
- `price`: Subscription price

**Example:**
```dart
await AnalyticsService.logSubscriptionStarted('premium_monthly', 9.99);
```

### subscription_cancelled
**Tracked when:** User cancels their subscription
**Method:** `AnalyticsService.logSubscriptionCancelled(String productId)`
**Parameters:**
- `product_id`: RevenueCat product identifier

## User Properties

User properties are set for segmentation and cohort analysis.

### Setting User ID
**When:** After successful authentication
**Method:** `AnalyticsService.setUserId(String userId)`

### Setting User Properties
**Method:** `AnalyticsService.setUserProperties({...})`

**Available Properties:**

| Property | Type | Description | Example Values |
|----------|------|-------------|----------------|
| `age_group` | String | User's age range | "18_24", "25_34", "35_44", "45_54", "55_64", "65_plus" |
| `gender` | String | User's gender | "male", "female", "non_binary", "other" |
| `has_premium` | String | Premium subscription status | "true", "false" |
| `signup_date` | String | Date user signed up | "2025-11-13" (ISO 8601 date) |

**Example:**
```dart
await AnalyticsService.setUserProperties(
  ageGroup: '25_34',
  gender: 'female',
  hasPremium: true,
  signupDate: DateTime.now(),
);
```

### Age Group Calculation
Use the helper method to calculate age group from date of birth:

```dart
final ageGroup = AnalyticsService.calculateAgeGroup(dateOfBirth);
// Returns: "18_24", "25_34", "35_44", "45_54", "55_64", or "65_plus"
```

## Screen Tracking

### Automatic Screen Tracking
Screen views are automatically tracked for all named routes via `FirebaseAnalyticsObserver`.

**Tracked Screens:**
- AuthScreen
- MainScreen
- DiscoveryScreen
- MatchesScreen
- ChatScreen
- ProfileScreen
- ProfileSetupScreen
- ProfileEditScreen
- DiscoveryFiltersScreen
- PaywallScreen
- SafetySettingsScreen

### Manual Screen Tracking
For screens not using named routes:

```dart
await AnalyticsService.logScreenView('custom_screen_name');
```

## Viewing Analytics in Firebase Console

### Accessing Analytics

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Analytics** in the left sidebar

### Key Reports

#### Events Report
**Path:** Analytics > Events

View all tracked events, their count, and parameters:
- See which events are most common
- Identify drop-off points
- Monitor event parameters

#### User Properties
**Path:** Analytics > User Properties

Segment users by custom properties:
- Age group distribution
- Premium vs free users
- Gender breakdown

#### Audiences
**Path:** Analytics > Audiences

Create custom audiences based on events and properties:
- **Example:** Users who viewed paywall but didn't subscribe
- **Example:** Active matchers (3+ matches in last 7 days)
- **Example:** Premium trial users nearing expiration

#### Real-time
**Path:** Analytics > Realtime

Monitor events as they happen in real-time:
- Active users
- Events in last 30 minutes
- Top events and screens

### Debug View

To see analytics events in real-time during development:

**iOS:**
```bash
# Enable debug mode
adb shell setprop debug.firebase.analytics.app <package_name>

# Disable debug mode
adb shell setprop debug.firebase.analytics.app .none.
```

**Android:**
```bash
# Enable debug mode
adb shell setprop debug.firebase.analytics.app com.yourdomain.nobsdating

# Disable debug mode
adb shell setprop debug.firebase.analytics.app .none.
```

Then go to Firebase Console > Analytics > DebugView

## Custom Funnel Analysis

### User Acquisition Funnel

**Steps:**
1. `login_success` - User authenticates
2. `profile_created` - User creates profile
3. `profile_liked` - User engages with discovery
4. `match_created` - User gets first match
5. `message_sent` - User sends first message

**How to View:**
1. Go to Analytics > Events
2. Create custom funnel with above events
3. Monitor conversion rates at each step

### Premium Conversion Funnel

**Steps:**
1. `paywall_viewed` - User sees paywall
2. `subscription_started` - User subscribes

**Segments to Analyze:**
- Source of paywall view (likes_limit vs discovery)
- Time since signup
- Number of matches

### Engagement Funnel

**Daily Active Users (DAU) Events:**
- `login_success`
- `profile_viewed`
- `profile_liked` OR `profile_passed`
- `match_opened`
- `message_sent`

**How to Track:**
Create audience: Users with any of these events in last 24 hours

### Retention Analysis

**Cohort Metrics:**
- Day 1 retention: Users who return after signup
- Day 7 retention: Users active 7 days after signup
- Day 30 retention: Users active 30 days after signup

**Key Events for Retention:**
- `login_success` (return visits)
- `match_created` (engagement)
- `message_sent` (active communication)

## Best Practices

### Event Naming
- Use lowercase with underscores: `profile_liked`
- Be specific but concise
- Group related events with prefixes when logical

### Parameter Usage
- Keep parameter keys consistent
- Use descriptive names
- Avoid PII (personally identifiable information)
- Limit to most important data

### Privacy Considerations
- **Never track**: Message content, personal data, passwords
- **Always anonymize**: User IDs should be opaque identifiers
- **Be transparent**: Update privacy policy to mention analytics

### Performance
- Analytics events are async and don't block UI
- Failures are silently caught to prevent crashes
- Events are batched and sent periodically

### Testing
1. Enable debug view in development
2. Test each critical user flow
3. Verify events appear in Firebase Console
4. Check parameter values are correct

## Custom Events

For tracking app-specific events not covered by the predefined methods:

```dart
await AnalyticsService.logCustomEvent(
  'custom_event_name',
  {
    'param1': 'value1',
    'param2': 123,
  },
);
```

**Use sparingly** - prefer predefined events for consistency.

## Troubleshooting

### Events Not Appearing

1. **Check Firebase Configuration**
   - Verify `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) is present
   - Ensure correct package name/bundle ID

2. **Check Debug Logs**
   - Look for "Analytics:" prefix in console
   - Errors will be logged with "Analytics error" prefix

3. **Wait for Processing**
   - Events can take 24-48 hours to appear in standard reports
   - Use DebugView for real-time validation

4. **Verify App is Connected**
   - Go to Firebase Console > Analytics > Events
   - Check if app is listed as "Connected"

### User Properties Not Updating

- Properties can take up to 24 hours to process
- Use DebugView to verify properties are being set
- Check that `setUserId()` was called before `setUserProperties()`

## Additional Resources

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [Firebase Console](https://console.firebase.google.com/)
- [RevenueCat Analytics Integration](https://www.revenuecat.com/docs/integrations/firebase-integration)
- [Privacy Best Practices](https://firebase.google.com/support/privacy)

---

**Last Updated:** 2025-11-13
**Analytics Service Version:** 1.0
**Firebase Analytics Version:** 11.0.0
