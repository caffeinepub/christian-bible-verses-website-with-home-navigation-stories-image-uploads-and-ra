# Specification

## Summary
**Goal:** Make uploaded story/verse images publicly viewable for everyone (including signed-out visitors) while keeping image uploads/replacements admin-only, and ensure the frontend recovers from prior image-load failures.

**Planned changes:**
- Update backend image/blob authorization so fetching uploaded story/verse images via direct URL is publicly readable (no auth required), while upload/replace remains restricted to admins.
- Ensure previously uploaded images become publicly readable after the change; add a safe Motoko upgrade migration only if needed to preserve and/or update existing stored image permissions/metadata.
- Update `frontend/src/components/story/PublicImage.tsx` to reset any prior error/fallback state when the `image` prop changes so newly-available images can render after re-render/navigation.

**User-visible outcome:** Uploaded images reliably load for all visitors (including logged-out users) without 401/403 errors; admins can still upload/replace images only; and images that previously showed “Image failed to load” can display after navigation/re-render without a full page refresh.
