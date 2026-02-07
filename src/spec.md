# Specification

## Summary
**Goal:** Roll back the live production deployment from Version 6 to the previously deployed Version 5 without changing the draft/codebase.

**Planned changes:**
- Re-point/restore the production deployment to the Version 5 build following the documented deployment procedure.
- Verify after rollback that core pages (Home, Daily Verse, Stories, Testament pages) load successfully while signed out.

**User-visible outcome:** The public production site serves Version 5 (not Version 6), and core pages load successfully for anonymous visitors.
