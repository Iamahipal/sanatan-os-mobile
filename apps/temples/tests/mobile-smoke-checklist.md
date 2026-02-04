# Temples Mobile Production Smoke Checklist

Run this checklist on a real mobile browser before release.

1. Load app home at `apps/temples` and confirm latest UI appears.
2. Add app to home screen and launch in standalone mode.
3. Open 3 temple detail pages and verify hero image + map link.
4. Toggle language, text size, and high contrast and reload app.
5. Save and mark visited temples; confirm planner progress updates.
6. Go offline and verify previously visited pages still open.
7. Reconnect network and confirm fresh data loads.
8. Trigger service-worker update and verify update banner appears.
9. Tap `Update now` and confirm app reloads to new version.
10. Confirm no console errors in mobile remote debugging.
