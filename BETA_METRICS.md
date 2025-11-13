# NoBS Dating - Beta Metrics & Analytics

**Last Updated**: 2025-11-13
**Current Phase**: Pre-Launch Setup

## Overview

This document defines the key metrics we'll track during beta testing to measure app health, user engagement, and readiness for launch. These metrics inform our go/no-go decisions at each phase gate.

---

## Critical Success Metrics

### 1. Stability Metrics

#### Crash-Free Rate
**Definition**: Percentage of user sessions without crashes

**Measurement**:
```
Crash-Free Rate = (Sessions without crashes / Total sessions) × 100
```

**Targets**:
- Closed Alpha: > 95%
- Private Beta: > 98%
- Public Beta (Launch Ready): > 99%

**Tools**:
- Firebase Crashlytics or Sentry
- Native platform crash reporting

**How to Track**:
- Dashboard: Real-time crash monitoring
- Alerts: Automated alerts when crash rate exceeds threshold
- Review: Daily review of crash logs and stack traces

---

#### Error Rate
**Definition**: Percentage of API calls or operations that result in errors

**Measurement**:
```
Error Rate = (Failed operations / Total operations) × 100
```

**Targets**:
- Closed Alpha: < 5%
- Private Beta: < 2%
- Public Beta: < 1%

**Tracked Operations**:
- Authentication attempts
- Profile loads
- Discovery feed loads
- Message sends
- Match creations
- Subscription checks

---

#### ANR Rate (Android-Specific)
**Definition**: Application Not Responding events per 1,000 sessions

**Target**: < 5 ANRs per 1,000 sessions

---

### 2. Engagement Metrics

#### Daily Active Users (DAU)
**Definition**: Number of unique users who open the app each day

**Measurement**: Unique user IDs with at least one session per day

**Targets**:
- Closed Alpha: 8-10 daily active (out of 10-15 total)
- Private Beta: 35-50 daily active (out of 50-100 total)
- Public Beta: 120-200 daily active (out of 200-500 total)

**Target Engagement Rate**: > 60% of enrolled testers active daily

---

#### Weekly Active Users (WAU)
**Definition**: Number of unique users who open the app at least once per week

**Target Engagement Rate**: > 80% of enrolled testers active weekly

---

#### Monthly Active Users (MAU)
**Definition**: Number of unique users who open the app at least once per month

**Target Engagement Rate**: > 90% of enrolled testers active monthly

---

#### Sessions Per User
**Definition**: Average number of app sessions per user per day

**Measurement**:
```
Sessions Per User = Total sessions / Active users
```

**Targets**:
- Closed Alpha: > 3 sessions/day
- Private Beta: > 3 sessions/day
- Public Beta: > 4 sessions/day

---

#### Average Session Duration
**Definition**: Mean time spent in app per session

**Measurement**: Time from app foreground to background

**Targets**:
- Closed Alpha: > 5 minutes
- Private Beta: > 6 minutes
- Public Beta: > 8 minutes

**Benchmark**: Typical dating app session duration is 8-12 minutes

---

### 3. Retention Metrics

#### Day 1 Retention
**Definition**: Percentage of users who return the day after first use

**Measurement**:
```
Day 1 Retention = (Users active on Day 1 / New users on Day 0) × 100
```

**Targets**:
- Closed Alpha: > 40%
- Private Beta: > 50%
- Public Beta: > 60%

**Benchmark**: Good dating apps achieve 50-60% Day 1 retention

---

#### Day 7 Retention
**Definition**: Percentage of users who return on Day 7 after first use

**Targets**:
- Closed Alpha: > 25%
- Private Beta: > 30%
- Public Beta: > 40%

**Benchmark**: Good dating apps achieve 30-40% Day 7 retention

---

#### Day 30 Retention
**Definition**: Percentage of users who return on Day 30 after first use

**Targets**:
- Public Beta: > 20%
- Post-Launch: > 25%

**Benchmark**: Good dating apps achieve 20-30% Day 30 retention

---

#### Cohort Retention Table

| Day | Closed Alpha Target | Private Beta Target | Public Beta Target |
|-----|-------------------|-------------------|------------------|
| Day 0 | 100% | 100% | 100% |
| Day 1 | > 40% | > 50% | > 60% |
| Day 3 | > 35% | > 40% | > 50% |
| Day 7 | > 25% | > 30% | > 40% |
| Day 14 | > 20% | > 25% | > 30% |
| Day 30 | N/A | N/A | > 20% |

---

### 4. Performance Metrics

#### App Startup Time
**Definition**: Time from app icon tap to first interactive screen

**Measurement**: Cold start time (app not in memory)

**Targets**:
- Closed Alpha: < 4 seconds
- Private Beta: < 3 seconds
- Public Beta: < 2 seconds

**P95 Target**: 95% of startups < target time

---

#### Discovery Swipe Latency
**Definition**: Time from swipe gesture to next profile display

**Targets**:
- Closed Alpha: < 800ms
- Private Beta: < 500ms
- Public Beta: < 300ms

**P95 Target**: 95% of swipes < target time

---

#### Message Send Latency
**Definition**: Time from send button tap to message appearing in chat

**Targets**:
- Closed Alpha: < 1500ms
- Private Beta: < 1000ms
- Public Beta: < 500ms

**P95 Target**: 95% of messages < target time

---

#### API Response Times

| Endpoint | P50 Target | P95 Target | P99 Target |
|----------|-----------|-----------|-----------|
| Authentication | < 200ms | < 500ms | < 1000ms |
| Profile Load | < 150ms | < 300ms | < 600ms |
| Discovery Feed | < 200ms | < 400ms | < 800ms |
| Match List | < 150ms | < 300ms | < 600ms |
| Message History | < 200ms | < 400ms | < 800ms |
| Send Message | < 300ms | < 600ms | < 1200ms |

---

#### Image Load Times
**Definition**: Time to load and display profile images

**Targets**:
- Thumbnail: < 500ms
- Full-size: < 1500ms

---

### 5. Feature Adoption Metrics

#### Profile Completion Rate
**Definition**: Percentage of users who complete their profile

**Measurement**: Users with name, age, bio, and at least 3 interests

**Targets**:
- Closed Alpha: > 80%
- Private Beta: > 70%
- Public Beta: > 60%

---

#### Discovery Engagement Rate
**Definition**: Percentage of active users who swipe on profiles

**Target**: > 80% of active users swipe daily

**Secondary Metrics**:
- Average swipes per session: > 10
- Like rate: 20-40% of swipes
- Pass rate: 60-80% of swipes

---

#### Match Rate
**Definition**: Percentage of likes that result in matches

**Measurement**:
```
Match Rate = (Matches created / Total likes given) × 100
```

**Target**: 5-15% (depends on user base size)

---

#### Chat Initiation Rate
**Definition**: Percentage of matches where at least one message is sent

**Target**: > 50% of matches result in conversation

---

#### Reply Rate
**Definition**: Percentage of first messages that receive a reply

**Target**: > 40% reply rate

---

### 6. Conversion Metrics

#### Subscription Rate
**Definition**: Percentage of users who subscribe to premium

**Targets**:
- Closed Alpha: Not prioritized (testing mode)
- Private Beta: > 5%
- Public Beta: > 5-10%

**Note**: Beta incentives (free premium) may affect this metric

---

#### Paywall Conversion Rate
**Definition**: Percentage of users who subscribe after seeing paywall

**Measurement**:
```
Paywall Conversion = (Subscriptions / Paywall views) × 100
```

**Target**: > 10% conversion from paywall view

---

#### Free-to-Paid Conversion Time
**Definition**: Median time from signup to subscription

**Target**: < 7 days for early adopters

---

### 7. Feedback & Quality Metrics

#### Bug Report Rate
**Definition**: Number of bugs reported per 100 active users

**Measurement**:
```
Bug Rate = (Bugs reported / Active users) × 100
```

**Expected Ranges**:
- Closed Alpha: 50-100 bugs per 100 users (high expected)
- Private Beta: 20-50 bugs per 100 users
- Public Beta: 5-20 bugs per 100 users

---

#### Feedback Response Rate
**Definition**: Percentage of users who provide feedback

**Targets**:
- Closed Alpha: > 80%
- Private Beta: > 40%
- Public Beta: > 20%

---

#### Net Promoter Score (NPS)
**Definition**: Likelihood to recommend on 0-10 scale

**Measurement**:
```
NPS = % Promoters (9-10) - % Detractors (0-6)
```

**Targets**:
- Closed Alpha: > 20 (acceptable)
- Private Beta: > 30 (good)
- Public Beta: > 40 (excellent)

**Benchmark**:
- NPS < 0: Poor
- NPS 0-30: Good
- NPS 30-70: Great
- NPS > 70: World-class

---

#### Feature Request Rate
**Definition**: Number of feature requests per 100 active users

**Target**: 10-30 requests per 100 users (shows engagement)

---

### 8. Safety & Moderation Metrics

#### Block Rate
**Definition**: Percentage of users who block at least one other user

**Expected Range**: 5-15% of active users

**Alert Threshold**: If >25%, investigate for abuse or UX issues

---

#### Report Rate
**Definition**: Percentage of users who report content or users

**Expected Range**: 2-10% of active users

**Alert Threshold**: If >15%, investigate for abuse or UX issues

---

#### Average Reports Per Reported User
**Definition**: How many times a user is reported on average

**Alert Threshold**: If >3 reports for same user, investigate immediately

---

---

## Metric Tracking Infrastructure

### Recommended Tools

#### Analytics Platforms
1. **Firebase Analytics** (Primary)
   - Free tier suitable for beta
   - Easy Flutter integration
   - Real-time dashboard
   - Event tracking

2. **Mixpanel** (Alternative)
   - More advanced cohort analysis
   - Funnel visualization
   - A/B testing support

3. **Amplitude** (Alternative)
   - User behavior analytics
   - Retention analysis
   - Behavioral cohorts

#### Crash Reporting
1. **Firebase Crashlytics** (Recommended)
   - Free
   - Easy integration
   - Real-time alerts
   - Stack trace analysis

2. **Sentry** (Alternative)
   - More detailed error tracking
   - Release tracking
   - Performance monitoring

#### Performance Monitoring
1. **Firebase Performance Monitoring**
   - App startup time
   - Network request performance
   - Custom traces

2. **New Relic Mobile** (Enterprise alternative)

#### Backend Monitoring
1. **Grafana + Prometheus** (Self-hosted)
2. **Railway Metrics** (Built-in)
3. **DataDog** (Enterprise)

---

## Event Tracking Schema

### User Events

#### Authentication Events
```
Event: user_signed_in
Properties:
  - method: "apple" | "google"
  - is_new_user: boolean
  - timestamp: ISO 8601
```

```
Event: user_signed_out
Properties:
  - session_duration: seconds
  - timestamp: ISO 8601
```

#### Profile Events
```
Event: profile_completed
Properties:
  - fields_filled: number
  - time_to_complete: seconds
  - has_bio: boolean
  - interests_count: number
```

```
Event: profile_edited
Properties:
  - fields_changed: [string]
  - timestamp: ISO 8601
```

#### Discovery Events
```
Event: discovery_swipe
Properties:
  - action: "like" | "pass"
  - profile_viewed_id: string
  - swipe_duration: milliseconds
  - timestamp: ISO 8601
```

```
Event: match_created
Properties:
  - matched_user_id: string
  - initiator: boolean
  - timestamp: ISO 8601
```

#### Chat Events
```
Event: message_sent
Properties:
  - match_id: string
  - is_first_message: boolean
  - message_length: number
  - latency: milliseconds
  - timestamp: ISO 8601
```

```
Event: message_received
Properties:
  - match_id: string
  - latency: milliseconds
  - timestamp: ISO 8601
```

#### Subscription Events
```
Event: paywall_viewed
Properties:
  - trigger: "discovery" | "matches" | "manual"
  - timestamp: ISO 8601
```

```
Event: subscription_purchased
Properties:
  - plan: string
  - price: number
  - time_since_signup: seconds
  - timestamp: ISO 8601
```

#### Safety Events
```
Event: user_blocked
Properties:
  - blocked_user_id: string
  - reason: string (optional)
  - timestamp: ISO 8601
```

```
Event: user_reported
Properties:
  - reported_user_id: string
  - reason: string
  - timestamp: ISO 8601
```

---

## Dashboard Views

### Executive Dashboard (Weekly Review)
- Crash-free rate (trend)
- DAU/WAU/MAU (trend)
- Day 1/7/30 retention
- NPS score
- Top 5 bugs
- Feature adoption rates

### Engineering Dashboard (Daily Review)
- Crash rate by device/OS
- Error rate by endpoint
- Performance metrics (P50, P95, P99)
- API response times
- Database query performance

### Product Dashboard (Daily Review)
- User engagement metrics
- Feature adoption
- Funnel drop-off points
- Feedback themes
- Feature requests priority

### QA Dashboard (Real-time)
- New bugs reported
- Bug triage status
- Test coverage
- Critical issues count

---

## Alerting Thresholds

### Critical Alerts (Immediate Response)
- Crash-free rate < 95%
- Any P0 bug reported
- API error rate > 10%
- Subscription purchase failures
- Security issues reported

### High Priority Alerts (< 4 hours)
- Crash-free rate < 98%
- API error rate > 5%
- Performance degradation > 50%
- Retention drop > 20% week-over-week

### Medium Priority Alerts (< 24 hours)
- Feature adoption < 50% of target
- NPS score drop > 10 points
- Unusual spike in reports/blocks

---

## Weekly Metrics Report Template

```markdown
# Beta Metrics - Week [X]

## Summary
[Brief overview of the week]

## Key Metrics

### Stability
- Crash-free rate: [X]% (Target: [Y]%)
- Error rate: [X]% (Target: [Y]%)

### Engagement
- DAU: [X] users
- Sessions per user: [X]
- Avg session duration: [X] minutes

### Retention
- Day 1: [X]% (Target: [Y]%)
- Day 7: [X]% (Target: [Y]%)

### Performance
- App startup: [X]ms (P95)
- Swipe latency: [X]ms (P95)

### Feature Adoption
- Profile completion: [X]%
- Discovery engagement: [X]%
- Chat initiation: [X]%

### Feedback
- NPS: [X]
- Bugs reported: [X]
- Feature requests: [X]

## Trends
- [Metric] increased/decreased by [X]%
- [Notable pattern or insight]

## Concerns
- [Any metrics below target]
- [Any unusual patterns]

## Action Items
1. [Action based on metrics]
2. [Action based on metrics]
```

---

## Phase Gate Metrics

### Closed Alpha Exit Criteria
- [ ] Crash-free rate > 95%
- [ ] Error rate < 5%
- [ ] Day 1 retention > 40%
- [ ] NPS > 20
- [ ] < 5 P1 bugs

### Private Beta Exit Criteria
- [ ] Crash-free rate > 98%
- [ ] Error rate < 2%
- [ ] Day 1 retention > 50%
- [ ] Day 7 retention > 30%
- [ ] NPS > 30
- [ ] App startup < 3s (P95)
- [ ] Zero P0 bugs, < 3 P1 bugs

### Public Beta Exit Criteria (Launch Ready)
- [ ] Crash-free rate > 99%
- [ ] Error rate < 1%
- [ ] Day 1 retention > 60%
- [ ] Day 7 retention > 40%
- [ ] Day 30 retention > 20%
- [ ] NPS > 40
- [ ] App startup < 2s (P95)
- [ ] Zero P0/P1 bugs
- [ ] All core features > 50% adoption

---

## Appendix

### Useful Queries

#### Firebase Analytics Query: Day 1 Retention
```sql
-- Pseudocode
SELECT
  COUNT(DISTINCT user_id) AS day_1_returned
FROM events
WHERE
  event_name = 'session_start'
  AND event_date = signup_date + 1
```

#### Crashlytics Query: Top Crashes
```
-- View in Firebase Console
Crashlytics > Issues > Sort by Impacted Users
```

### Metric Definitions Source
- Industry benchmarks from Localytics, Mixpanel, and Amplitude reports
- Dating app benchmarks from public research and competitor analysis

---

## Revision History

- v1.0 (2025-11-13): Initial metrics framework created
