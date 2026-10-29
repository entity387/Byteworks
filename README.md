# ByteWorks Hub V2.2 — Installable App + Notifications

## Deploy (Vercel)
Upload the **contents** of this folder to your existing Vercel project via GitHub deployment (recommended), or upload a new project via Vercel Drop. Keep `index.html`, `app.js`, `firebase-sync.js`, `sw.js`, `manifest.webmanifest`, and `icons/` at the same project root. No build command needed.

## Install
- Edge or Chrome (Windows/Android): visit the HTTPS Vercel URL, select **Install app** in the browser, or Settings → Install app in ByteWorks Hub.
- iPhone/iPad Safari: Share → **Add to Home Screen**. Notification permission on iOS requires a Home Screen installed PWA and supported iOS.
- The browser may not display an install prompt until its criteria are satisfied.

## Notifications included now
- In-app notification centre: bell icon lists today's appointments, jobs awaiting parts, and collection balances.
- On-device browser notifications: Settings → **Enable notifications**. Supports a test notification, and an appointment reminder 30 minutes before an appointment **while the app is running**. When reopened, it can catch an appointment up to 10 minutes late.
- Notification permission is per-device. Do the setup on each device.
- These are **not closed-app server push notifications**. The service worker has a push event handler, but there is no push subscription storage nor authenticated sender. To notify when the app is closed, a secure Vercel server endpoint or Firebase Cloud Function plus subscriptions/FCM setup is required. Never embed Firebase server credentials in client-side JS.

## Existing Firebase integration
Same Firebase project, anonymously authenticated approved-device gate, same shared `workspaces/main` document, same Firestore rules as V2.1.1. No new Firestore configuration is necessary for on-device notifications. The manifest and service worker don't store customer data in offline caches. Cloud connectivity remains required for records.

## Safety
Use fictitious data until rules, backups, and authorization are reviewed. Do not treat the profile chooser as authentication. Devices must still be approved through Firestore. Export a backup before updating. Test deployment on desktop and mobile.


## Version 2.3: Parts tracker
Open **Parts Tracker** from the sidebar. Add parts linked to existing repair jobs, record supplier, part/SKU, quantity, purchase unit cost, customer charge, status, order reference and expected arrival. Edit parts and export CSV. Job editors also have a + Part shortcut. Data is saved to the existing shared Firestore workshop document; no new Firestore collection or rules change is needed.

**Pricing:** Parts tracking totals are informational. They never automatically alter job.parts billed, payment records or receipts. Update the job quote separately after approval. Use a test part first and confirm syncing on a second device.

**Deployment:** Redeploy the complete contents of this directory to the same Vercel project. Ensure app.js, firebase-sync.js and sw.js all update. Back up your current records before deployment.


## V2.4: Parcel tracking
In Parts Tracker, edit a part and provide its courier, tracking number and official HTTPS tracking URL. The Track button opens a preview of the courier's own website plus a reliable **Open tracking site** link. Some carrier websites block embedded display: that is normal and not a ByteWorks error. This is **not** a paid shipment-tracking API and does not automatically fetch event history, actual location or updated delivery dates. Tracking links are supplied by the operator. Avoid inserting URLs from suspicious delivery messages.

## Record retention
No automatic deletion is enabled. Do not delete business/financial records after 30 days. For most Australian business records a five-year retention period applies, sometimes longer. Archive old completed jobs at the UI level in a future release, while retaining records and backups. The existing app still stores all records in a single Firestore document, so it will eventually need a database restructure as it grows.
