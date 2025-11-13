# Beta Launch Checklist

Quick reference checklist for launching the NoBS Dating beta program.

---

## Pre-Launch Setup (1-2 Days)

### Code & Dependencies
- [ ] Run `flutter pub get` to install device_info_plus and package_info_plus
- [ ] Test app builds successfully on iOS and Android
- [ ] Test feedback widget appears on Profile screen
- [ ] Verify feedback form opens and closes properly
- [ ] Test feedback submission (check error handling)

### Firebase Setup
- [ ] Create Firebase project (or use existing)
- [ ] Add iOS app to Firebase project
- [ ] Download GoogleService-Info.plist
- [ ] Add GoogleService-Info.plist to iOS project
- [ ] Add Android app to Firebase project
- [ ] Download google-services.json
- [ ] Add google-services.json to Android project
- [ ] Enable Firebase Analytics
- [ ] Enable Firebase Crashlytics
- [ ] Test Firebase connection (check debug console)

### Feedback Backend Configuration
**Choose one or more:**

- [ ] **Option A - Slack Webhook** (Recommended - Fastest)
  - [ ] Create Slack workspace or use existing
  - [ ] Create #beta-feedback channel
  - [ ] Create incoming webhook for channel
  - [ ] Copy webhook URL
  - [ ] Update FeedbackService in profile_screen.dart with webhook URL
  - [ ] Test webhook submission

- [ ] **Option B - Discord Webhook**
  - [ ] Create Discord server or use existing
  - [ ] Create #beta-feedback channel
  - [ ] Server Settings → Integrations → Webhooks → New Webhook
  - [ ] Copy webhook URL
  - [ ] Update FeedbackService with webhook URL
  - [ ] Test webhook submission

- [ ] **Option C - Backend API Endpoint**
  - [ ] Create /feedback endpoint in backend
  - [ ] Add database table for feedback storage
  - [ ] Test endpoint with Postman/curl
  - [ ] Update FeedbackService with API URL
  - [ ] Test API submission

- [ ] **Option D - Email Only** (Requires backend email service)
  - [ ] Set up email service (SendGrid, AWS SES, etc.)
  - [ ] Create /send-feedback-email endpoint
  - [ ] Configure email templates
  - [ ] Update FeedbackService with endpoint URL
  - [ ] Send test email

### TestFlight Setup (iOS)
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Create App ID in Apple Developer Console
- [ ] Configure app in App Store Connect
- [ ] Add app icon and metadata
- [ ] Archive app in Xcode
- [ ] Upload build to App Store Connect
- [ ] Complete Beta App Information
- [ ] Add Beta App Description
- [ ] Add Beta Tester Instructions
- [ ] Submit for Beta App Review (1-2 days)
- [ ] Create external test group
- [ ] Add testers or generate public link

### Google Play Early Access Setup (Android)
- [ ] Enroll in Google Play Developer Console ($25 one-time)
- [ ] Create app in Play Console
- [ ] Fill out store listing (basic info)
- [ ] Build signed release APK/AAB
- [ ] Upload to Internal Testing track
- [ ] Create test group and add testers
- [ ] Or create Open Testing track for public beta
- [ ] Publish to testing track

### Communication Setup
- [ ] Create beta email address (beta@nobsdating.app)
- [ ] Set up email forwarding/monitoring
- [ ] Create Discord/Slack beta community
- [ ] Create invite link for community
- [ ] Prepare welcome message for community

### Documentation Preparation
- [ ] Review BETA_TESTING_PLAN.md
- [ ] Customize email templates in BETA_COMMUNICATION_PLAN.md
- [ ] Update KNOWN_ISSUES.md with current app state
- [ ] Review BETA_METRICS.md targets
- [ ] Prepare monitoring dashboard (Firebase Console)

---

## Closed Alpha Launch (Week 1)

### Recruitment (Day -7 to Day 0)
- [ ] Identify 10-15 potential testers (friends, family, colleagues)
- [ ] Reach out with personal messages
- [ ] Collect email addresses
- [ ] Add to TestFlight/Play Store test group
- [ ] Send calendar invites for kickoff (optional)

### Day 0 - Alpha Launch Day
- [ ] Double-check build is available in TestFlight/Play Store
- [ ] Send welcome email (use template from BETA_COMMUNICATION_PLAN.md)
- [ ] Include TestFlight/Play Store links
- [ ] Share Discord/Slack invite link
- [ ] Post welcome message in community channel
- [ ] Enable monitoring alerts
- [ ] Be available for immediate support

### Week 1 - Daily Monitoring
**Every Day:**
- [ ] Check Firebase Crashlytics for crashes (morning)
- [ ] Review feedback submissions (Slack/Discord/Firebase)
- [ ] Triage new bugs in GitHub Issues
- [ ] Respond to tester questions (< 12 hours)
- [ ] Acknowledge bug reports (< 8 hours)
- [ ] Update KNOWN_ISSUES.md as needed

**Monday:**
- [ ] Send weekly update email (use template)
- [ ] Review metrics vs. targets
- [ ] Prioritize fixes for the week

**Friday:**
- [ ] Send mid-phase survey (use BETA_FEEDBACK_FORM.md)
- [ ] Compile weekly metrics report
- [ ] Plan improvements for Week 2

### Week 2 - Refinement
- [ ] Deploy hotfixes for critical bugs
- [ ] Continue daily monitoring
- [ ] Send weekly update email (Monday)
- [ ] Send end-of-phase survey (Friday)
- [ ] Compile alpha phase report
- [ ] Evaluate exit criteria (see below)

### Alpha Exit Criteria Evaluation
- [ ] Crash-free rate > 95%
- [ ] All core features functional
- [ ] Zero P0 bugs
- [ ] < 5 P1 bugs
- [ ] Positive feedback from testers
- [ ] Team consensus to proceed

**If criteria met:** Proceed to Private Beta
**If not met:** Extend alpha by 1 week, address gaps

---

## Private Beta Launch (Week 3)

### Recruitment (Day -3 to Day 0)
- [ ] Create beta signup form (Google Forms, Typeform)
- [ ] Prepare social media posts
- [ ] Post on Product Hunt Ship / BetaList
- [ ] Post on Reddit (r/SampleSize, r/dating, relevant subs)
- [ ] Post on Twitter/X with #beta #datingapp
- [ ] Post on Instagram/Facebook
- [ ] Email personal network for referrals
- [ ] Target: 50-100 new testers

### Day 0 - Private Beta Launch
- [ ] Deploy updated build with alpha fixes
- [ ] Send phase transition email to alpha testers
- [ ] Send welcome email to new beta testers
- [ ] Update TestFlight/Play Store with new build
- [ ] Monitor for sudden influx of feedback
- [ ] Be extra responsive on launch day

### Week 3-4 - Monitoring
**Daily:**
- [ ] All Daily Monitoring tasks from Week 1
- [ ] Scale support based on tester volume

**Weekly:**
- [ ] Monday: Weekly update email
- [ ] Review metrics dashboard
- [ ] Triage issues by priority
- [ ] Update KNOWN_ISSUES.md

**Surveys:**
- [ ] Mid-phase survey (end of Week 3)
- [ ] End-of-phase survey (end of Week 4)

### Private Beta Exit Criteria Evaluation
- [ ] Crash-free rate > 98%
- [ ] Day 1 retention > 50%
- [ ] Day 7 retention > 30%
- [ ] Zero P0 bugs
- [ ] < 3 P1 bugs
- [ ] 60%+ user satisfaction
- [ ] NPS > 30

**If criteria met:** Proceed to Public Beta
**If not met:** Extend private beta, address gaps

---

## Public Beta Launch (Week 5)

### Pre-Launch
- [ ] Create TestFlight public link
- [ ] Create Play Store open testing track
- [ ] Prepare press release (optional)
- [ ] Reach out to tech/dating blogs
- [ ] Prepare social media campaign
- [ ] Set up monitoring alerts for scale

### Day 0 - Public Beta Launch
- [ ] Deploy production-ready build
- [ ] Make TestFlight link public
- [ ] Make Play Store testing public
- [ ] Send phase transition email to existing testers
- [ ] Post public announcement on social media
- [ ] Share on Product Hunt
- [ ] Share on relevant subreddits
- [ ] Post on Hacker News (Show HN)
- [ ] Monitor closely for first 24 hours

### Week 5-6 - Launch Prep
**Daily:**
- [ ] Intensive monitoring (multiple times per day)
- [ ] Rapid response to critical issues
- [ ] Daily metrics review

**Weekly:**
- [ ] Monday: Weekly update
- [ ] Performance optimization
- [ ] Final polish based on feedback

**End of Week 6:**
- [ ] Send final comprehensive survey
- [ ] Compile launch readiness report
- [ ] Go/No-Go meeting

### Public Beta Exit Criteria (Launch Ready)
- [ ] Crash-free rate > 99%
- [ ] Day 1 retention > 60%
- [ ] Day 7 retention > 40%
- [ ] Day 30 retention > 20%
- [ ] NPS > 40
- [ ] Zero P0 bugs
- [ ] Zero P1 bugs (or acceptable with workarounds)
- [ ] Performance targets met
- [ ] Subscription flow working end-to-end
- [ ] App Store/Play Store submission ready
- [ ] Customer support process defined
- [ ] Marketing assets ready

**If criteria met:** Launch! 🚀
**If not met:** Extend public beta, address critical gaps

---

## Post-Beta / Pre-Launch

### Final Preparations
- [ ] Fix remaining P2/P3 bugs
- [ ] Finalize App Store/Play Store metadata
- [ ] Create app preview video
- [ ] Take screenshots for store listings
- [ ] Write app description and keywords
- [ ] Set up customer support email
- [ ] Prepare privacy policy and terms of service
- [ ] Set up app analytics for production
- [ ] Configure RevenueCat for production
- [ ] Set subscription pricing
- [ ] Plan launch marketing campaign

### App Store Submission (iOS)
- [ ] Archive final production build
- [ ] Upload to App Store Connect
- [ ] Complete all app information
- [ ] Add screenshots and preview video
- [ ] Set pricing and availability
- [ ] Submit for App Review
- [ ] Wait for approval (1-7 days)

### Play Store Submission (Android)
- [ ] Build signed production AAB
- [ ] Upload to Production track
- [ ] Complete store listing
- [ ] Add screenshots and video
- [ ] Set pricing and countries
- [ ] Submit for review
- [ ] Wait for approval (few hours to few days)

### Launch Day Prep
- [ ] Schedule launch date
- [ ] Prepare launch email to beta testers
- [ ] Prepare social media posts
- [ ] Set up monitoring for launch day
- [ ] Prepare support resources
- [ ] Brief team on launch procedures
- [ ] Plan launch day activities

---

## Ongoing (Throughout Beta)

### Weekly Tasks
- [ ] Monday: Send weekly update email
- [ ] Review Firebase Analytics dashboard
- [ ] Compile metrics report
- [ ] Triage new issues
- [ ] Update KNOWN_ISSUES.md
- [ ] Review and respond to feedback

### Bi-Weekly Tasks
- [ ] Host tester feedback call (optional)
- [ ] Review NPS trends
- [ ] Analyze feature adoption rates
- [ ] Plan upcoming improvements

### Monthly Tasks
- [ ] Review retention cohorts
- [ ] Analyze long-term trends
- [ ] Evaluate roadmap priorities
- [ ] Thank active contributors

---

## Emergency Procedures

### Critical Bug Discovered
1. [ ] Immediately acknowledge in all channels
2. [ ] Assess impact and affected users
3. [ ] Send critical issue email (use template)
4. [ ] Prioritize fix
5. [ ] Deploy hotfix as soon as possible
6. [ ] Send resolution update
7. [ ] Post-mortem: What happened? How to prevent?

### Negative Feedback Spike
1. [ ] Identify root cause
2. [ ] Acknowledge the issue publicly
3. [ ] Explain what you're doing
4. [ ] Rapid iteration to address
5. [ ] Follow up with affected users
6. [ ] Document lessons learned

### Low Engagement
1. [ ] Send re-engagement email
2. [ ] Offer incentives (extended premium)
3. [ ] Survey inactive users (why?)
4. [ ] Simplify onboarding
5. [ ] Add more value (new features)

---

## Success Metrics Quick Reference

| Metric | Closed Alpha | Private Beta | Public Beta |
|--------|-------------|-------------|-------------|
| Crash-Free Rate | > 95% | > 98% | > 99% |
| Day 1 Retention | > 40% | > 50% | > 60% |
| Day 7 Retention | > 25% | > 30% | > 40% |
| Day 30 Retention | N/A | N/A | > 20% |
| NPS | > 20 | > 30 | > 40 |
| P0 Bugs | 0 | 0 | 0 |
| P1 Bugs | < 5 | < 3 | 0 |

---

## Resources Quick Links

- **Full Plan**: BETA_TESTING_PLAN.md
- **Email Templates**: BETA_COMMUNICATION_PLAN.md
- **Feedback Form**: BETA_FEEDBACK_FORM.md
- **Known Issues**: KNOWN_ISSUES.md
- **Metrics**: BETA_METRICS.md
- **Quick Start**: BETA_TESTING_README.md
- **Summary**: BETA_INFRASTRUCTURE_SUMMARY.md

---

## Contact Info Template

Fill this out and keep handy:

**Beta Email**: beta@nobsdating.app
**Discord/Slack**: [Your invite link]
**TestFlight Link**: [iOS beta link]
**Play Store Link**: [Android beta link]
**Feedback Webhook**: [Slack/Discord webhook]
**Firebase Project**: [Project ID]

---

**Print this checklist and check off items as you complete them!**

Good luck with your beta launch! 🚀
