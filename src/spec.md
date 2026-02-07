# Specification

## Summary
**Goal:** Expand Bible Stories and Daily Verse content to King James Version (KJV), and present story pages as narrative scripture followed by a summary at the bottom.

**Planned changes:**
- Update the backend Stories dataset to include a non-empty set of major Bible stories using KJV text, with each story including only narrative verses (not full chapter ranges or non-narrative sections), while keeping existing story fields compatible with the current frontend.
- Update the backend curated Daily Verse set so all daily verse texts are KJV wording.
- Update the Story detail UI to display the narrative verse text as the primary story content and move the summary to the bottom; remove/replace any “Key Verses” labeling with a narrative-appropriate label, without changing story image upload/view behavior.

**User-visible outcome:** Users can browse Story details that read like continuous KJV narrative scripture with the story summary shown at the end, and Daily Verses consistently display KJV wording.
