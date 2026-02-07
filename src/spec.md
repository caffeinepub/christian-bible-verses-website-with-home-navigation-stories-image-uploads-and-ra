# Specification

## Summary
**Goal:** Restrict story/verse image uploads so only the single site owner (admin) can upload/replace images, while keeping image viewing available to everyone.

**Planned changes:**
- Enforce backend authorization on story/verse image upload/replace methods so non-admin callers are rejected and no image data is modified.
- Add a backend query endpoint that returns whether the current caller is the admin (boolean), callable by guests and signed-in users.
- Update the frontend image upload UI to render upload controls only when the caller is the admin; guests and non-admin users can still view existing images.
- Add a React Query hook to fetch admin status and wire it into image upload components, with refetch/invalidation on login/logout.

**User-visible outcome:** Everyone (including guests) can view stories/verses and any existing images, but only the admin sees upload controls and can upload or replace story/verse images.
