# Production Release Checklist

Use this checklist for every production deployment to ensure a smooth, verified release process.

## Pre-Deployment

### Draft Build Verification
- [ ] Draft build version/commit identified and documented
- [ ] All features tested in draft environment
- [ ] No known critical bugs or issues
- [ ] Performance acceptable (page load < 3s)
- [ ] Mobile/responsive design verified
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari)

### Code Review
- [ ] Code changes reviewed (if applicable)
- [ ] No debug/console.log statements in production code
- [ ] Environment variables configured correctly
- [ ] API endpoints point to production backend

### Deployment Scope Confirmation
- [ ] **CRITICAL:** Confirm this is a deployment-only request (no code changes)
- [ ] If code changes included, ensure they are intentional and approved
- [ ] Backend changes identified (if any)
- [ ] Frontend changes identified (if any)

## Deployment Execution

### Environment Setup
- [ ] DFX CLI version verified (0.15.0+)
- [ ] Network set to `ic` (mainnet)
- [ ] Sufficient cycles in canister wallet
- [ ] Admin access confirmed

### Build Process
- [ ] Backend bindings generated (`pnpm run prebuild`)
- [ ] Frontend build completed successfully (`pnpm run build:skip-bindings`)
- [ ] No build errors or warnings
- [ ] Build output size reasonable (< 10MB)

### Deployment Commands
- [ ] Backend deployed (if needed): `dfx deploy backend --network ic`
- [ ] Frontend deployed: `dfx deploy frontend --network ic`
- [ ] Deployment completed without errors
- [ ] Canister IDs recorded

## Post-Deployment Verification

### Functional Testing
- [ ] Home page loads and displays correctly
- [ ] Navigation menu works (all links functional)
- [ ] Daily Verse page displays today's verse
- [ ] Bible Stories page shows story list
- [ ] Story detail pages render with verses
- [ ] Old Testament page displays verses
- [ ] New Testament page displays verses
- [ ] Verse detail pages render correctly

### Authentication & Authorization
- [ ] Login button visible and functional
- [ ] Internet Identity login flow works
- [ ] User profile setup appears for new users
- [ ] Logout clears session and cached data
- [ ] Admin features accessible to admin users only

### Data & Images
- [ ] All images load correctly (no broken images)
- [ ] Story images display when present
- [ ] Verse images display when present
- [ ] Image upload works (admin only)
- [ ] ExternalBlob URLs resolve correctly

### Technical Verification
- [ ] No JavaScript errors in browser console
- [ ] No failed network requests (check Network tab)
- [ ] Backend API calls succeed
- [ ] Page load performance acceptable
- [ ] Mobile responsiveness maintained

### Content Verification
- [ ] All text content displays correctly
- [ ] No placeholder or Lorem Ipsum text
- [ ] Footer attribution present and correct
- [ ] Branding consistent with design

## Deployment Confirmation

### Behavior Match
- [ ] **CRITICAL:** Live site behavior matches draft build exactly
- [ ] No unexpected changes or regressions
- [ ] All features work as expected
- [ ] User experience consistent with draft

### Documentation
- [ ] Deployment timestamp recorded
- [ ] Git commit/version documented
- [ ] Any issues encountered documented
- [ ] Rollback plan confirmed available

## Sign-Off

- **Deployed By:** _________________
- **Date/Time:** _________________
- **Draft Build Version:** _________________
- **Git Commit:** _________________
- **Production URL:** _________________
- **Verification Status:** ☐ PASS  ☐ FAIL

### Notes
_Document any issues, warnings, or observations:_

---

## Rollback Criteria

Initiate rollback immediately if:
- [ ] Critical functionality broken (login, navigation, data loading)
- [ ] JavaScript errors preventing app usage
- [ ] Backend connection failures
- [ ] Data corruption or loss
- [ ] Security vulnerability exposed

## Post-Release Monitoring

Monitor for 15-30 minutes after deployment:
- [ ] No error reports from users
- [ ] Server logs clean (no repeated errors)
- [ ] Performance metrics stable
- [ ] Cycle consumption normal

---

**Checklist Version:** 1.0  
**Last Updated:** February 7, 2026
