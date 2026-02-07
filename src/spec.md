# Specification

## Summary
**Goal:** Ensure the Stories tab reliably shows Bible stories (not an empty list) on fresh installs and after upgrades, and clearly communicates when no stories are available.

**Planned changes:**
- Seed the backend’s initial stories dataset so `getStories()` returns a non-empty list on a fresh install (each story includes `title`, `summary`, and at least 1 verse with reference + text).
- Update canister upgrade/migration logic to preserve existing persisted stories across upgrades, and seed the starter set during upgrade if the persisted stories array is currently empty.
- Update the Stories page UI to display a clear English empty-state message when `getStories()` succeeds but returns an empty array.

**User-visible outcome:** The Stories tab shows story cards by default on new deployments and remains populated after upgrades; if no stories exist, users see a clear empty-state message instead of a header-only page.
