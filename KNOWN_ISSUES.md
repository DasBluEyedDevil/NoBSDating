# NoBS Dating - Known Issues

**Last Updated**: 2025-11-13
**Current Beta Phase**: Pre-Launch / Setup
**App Version**: Beta v0.1.0

## Overview

This document tracks known issues, limitations, and planned improvements for NoBS Dating. We update this regularly as we discover and resolve issues. Before reporting a bug, please check if it's listed here.

---

## Critical Issues (P0)

> These are showstopper issues that severely impact core functionality. We're working on these with highest priority.

Currently: **None reported** ✅

---

## High Priority Issues (P1)

> These issues significantly impact the user experience but have workarounds or affect non-critical features.

### Authentication & Account

**None reported** ✅

### Profile Management

**None reported** ✅

### Discovery

**None reported** ✅

### Matches & Chat

**None reported** ✅

### Subscription & Paywall

**None reported** ✅

---

## Medium Priority Issues (P2)

> These are minor issues or edge cases that affect a small number of users.

### Performance

**None reported** ✅

### UI/UX

**None reported** ✅

---

## Low Priority Issues (P3)

> These are cosmetic issues, minor polish items, or enhancement requests.

**None reported** ✅

---

## Features Not Yet Implemented

> These are features that are planned but not yet available in the beta.

### Phase 1 Features (In Development)

1. **Profile Photo Uploads**
   - **Status**: Not yet implemented
   - **Planned**: Phase 2
   - **Current State**: Profile photos use placeholder avatars
   - **Workaround**: None - this is a core feature under development

2. **Advanced Discovery Filters**
   - **Status**: Basic filters only
   - **Planned**: Phase 2
   - **Missing Filters**:
     - Education level
     - Religion
     - Smoking/Drinking preferences
     - Height filter
   - **Workaround**: Use basic age/distance filters

3. **Push Notifications**
   - **Status**: Not yet implemented
   - **Planned**: Phase 3
   - **Impact**: Users won't receive notifications for new matches or messages
   - **Workaround**: Manually check the app for updates

4. **Video Chat**
   - **Status**: Not planned for initial launch
   - **Planned**: Post-launch feature
   - **Workaround**: Exchange contact info and use external video chat

5. **Voice Messages**
   - **Status**: Not planned for initial launch
   - **Planned**: Under consideration
   - **Workaround**: Send text messages

6. **Read Receipts**
   - **Status**: Not yet implemented
   - **Planned**: Phase 2
   - **Workaround**: None

7. **Typing Indicators**
   - **Status**: Not yet implemented
   - **Planned**: Phase 2
   - **Workaround**: None

8. **GIF/Sticker Support in Chat**
   - **Status**: Not planned for initial launch
   - **Planned**: Post-launch feature
   - **Workaround**: Use emoji or text

### Phase 2 Features (Planned)

1. **Profile Verification**
   - **Status**: Planned for Phase 2
   - **Description**: Photo verification to confirm identity

2. **Profile Prompts**
   - **Status**: Planned for Phase 2
   - **Description**: Question-based prompts to showcase personality

3. **Video Profile Intros**
   - **Status**: Under consideration
   - **Description**: Short video introductions on profiles

### Post-Launch Features (Roadmap)

1. **Events & Date Ideas**
   - Date planning features and local event suggestions

2. **Group Dating**
   - Double dates and group hangout features

3. **Compatibility Scoring**
   - Algorithm-based compatibility scores

4. **Icebreaker Suggestions**
   - AI-powered conversation starters

---

## Platform-Specific Issues

### iOS Issues

**None reported** ✅

### Android Issues

**None reported** ✅

---

## Device-Specific Issues

### Known Incompatibilities

**None reported** ✅

---

## Network & Performance Considerations

### Expected Behavior

1. **Slow Network Handling**
   - **Current State**: App may appear to hang on slow connections
   - **Planned**: Better loading indicators and timeout handling
   - **Workaround**: Ensure stable WiFi or good cellular connection

2. **Offline Mode**
   - **Status**: Limited offline support
   - **Current State**: Most features require internet connection
   - **Planned**: Better offline messaging and caching
   - **Workaround**: Use app when connected to internet

3. **Image Loading**
   - **Current State**: Profile images may load slowly on cellular
   - **Planned**: Image optimization and progressive loading
   - **Workaround**: Use WiFi for best experience

---

## Database & Backend Issues

### Known Limitations

1. **Migration Endpoint**
   - **Status**: Temporary migration endpoint exists for development
   - **Note**: Will be removed before production launch
   - **Impact**: None for end users

2. **Rate Limiting**
   - **Status**: Basic rate limiting in place
   - **Planned**: More sophisticated rate limiting for production
   - **Impact**: Heavy usage may occasionally be throttled

---

## Safety & Privacy

### Current State

1. **Block Feature**
   - **Status**: Implemented ✅
   - **Functionality**: Fully working

2. **Report Feature**
   - **Status**: Implemented ✅
   - **Functionality**: Fully working

3. **Emergency Contacts**
   - **Status**: Implemented ✅
   - **Functionality**: Fully working

### Planned Improvements

1. **AI Content Moderation**
   - **Status**: Planned for post-launch
   - **Description**: Automated detection of inappropriate content

2. **Background Checks**
   - **Status**: Under consideration
   - **Description**: Optional background check integration

---

## Subscription & Payment Issues

### Current State

1. **RevenueCat Integration**
   - **Status**: Implemented ✅
   - **Test Mode**: Currently using sandbox/test mode
   - **Note**: Real purchases not yet active

2. **Subscription Restoration**
   - **Status**: Implemented ✅
   - **Functionality**: Should work across devices

### Known Limitations

1. **Promo Codes**
   - **Status**: Not yet implemented
   - **Planned**: Phase 3
   - **Workaround**: Contact support for promotional access

2. **Referral Program**
   - **Status**: Not planned for initial launch
   - **Planned**: Post-launch feature

---

## Workarounds Summary

> Quick reference for common issues and their temporary solutions.

| Issue | Workaround | ETA for Fix |
|-------|-----------|-------------|
| No push notifications | Manually check app | Phase 3 |
| No photo uploads | Using placeholder avatars | Phase 2 |
| Limited filters | Use basic age/distance | Phase 2 |
| Slow image loading | Use WiFi connection | Phase 2 |
| No read receipts | Ask for confirmation | Phase 2 |

---

## Planned Improvements

### User Experience

1. **Onboarding Flow**
   - **Current**: Basic profile setup
   - **Planned**: Interactive tutorial and value proposition
   - **ETA**: Phase 2

2. **Empty States**
   - **Current**: Basic "no items" messages
   - **Planned**: Helpful, actionable empty states
   - **ETA**: Phase 2

3. **Loading States**
   - **Current**: Basic spinners
   - **Planned**: Skeleton screens and progress indicators
   - **ETA**: Phase 2

4. **Error Messages**
   - **Current**: Technical error messages
   - **Planned**: User-friendly, actionable error messages
   - **ETA**: Phase 2

### Performance

1. **App Startup Time**
   - **Current**: 2-4 seconds
   - **Target**: < 2 seconds
   - **ETA**: Phase 3

2. **Discovery Swipe Latency**
   - **Current**: ~500ms
   - **Target**: < 300ms
   - **ETA**: Phase 2

3. **Chat Message Latency**
   - **Current**: 500-1000ms
   - **Target**: < 500ms
   - **ETA**: Phase 2

### Design Polish

1. **Animations**
   - **Current**: Basic transitions
   - **Planned**: Smooth, delightful animations
   - **ETA**: Phase 2

2. **Dark Mode**
   - **Status**: Not yet implemented
   - **Planned**: Phase 3
   - **Workaround**: Use light mode

3. **Accessibility**
   - **Current**: Basic accessibility support
   - **Planned**: Full VoiceOver/TalkBack support, font scaling, color contrast
   - **ETA**: Ongoing improvements

---

## Fixed Issues

> Recently resolved issues from previous builds.

### Build v0.1.0 (Current)
- Initial beta release

---

## How to Report New Issues

If you encounter an issue not listed here:

1. **Check this document** to ensure it's not already known
2. **Use the in-app feedback widget** (Profile screen)
3. **Email us** at beta@nobsdating.app
4. **Create a GitHub issue** using our bug report template

### What to Include

- Device model and OS version
- App version/build number
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots or videos
- Any error messages

---

## Issue Resolution Timeline

| Priority | Response Time | Target Resolution |
|----------|--------------|-------------------|
| P0 (Critical) | < 4 hours | < 24 hours |
| P1 (High) | < 8 hours | < 3 days |
| P2 (Medium) | < 24 hours | < 1 week |
| P3 (Low) | < 48 hours | Post-launch |

---

## FAQ

**Q: Why isn't [feature] working?**
A: Check the "Features Not Yet Implemented" section above. Many features are still in development.

**Q: The app crashed. What should I do?**
A: The crash is automatically reported to us. You can help by emailing details about what you were doing when it crashed.

**Q: Will these issues be fixed before launch?**
A: P0 and P1 issues will definitely be fixed. P2 and P3 issues will be addressed based on priority and feedback.

**Q: Can I request a feature?**
A: Absolutely! Use the feature request template on GitHub or email us your ideas.

**Q: How do I know when an issue is fixed?**
A: We announce fixes in our weekly update emails and update this document.

---

## Contact

For questions about known issues or to report new ones:
- **Email**: beta@nobsdating.app
- **Discord/Slack**: [Link]
- **GitHub**: [Link to issues]

---

## Changelog

### 2025-11-13
- Initial known issues document created
- Documented features not yet implemented
- Established issue tracking structure
