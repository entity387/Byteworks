# ByteWorks Hub V2.1.1 — Firebase + Vercel (blank-screen fix)

**Fix:** The previous ZIP accidentally included an extra opening `<script>` tag before `app.js`. This version corrects the tag and displays a startup message if the scripts cannot load. Redeploy the whole extracted folder so `index.html`, `app.js`, and `firebase-sync.js` are siblings in the site root.

## What this package contains
- `index.html`, `app.js`, `firebase-sync.js`: ByteWorks Hub with your Firebase project configuration.
- `firestore.rules`: **required** restricted Firestore rules.
- `vercel.json`: Vercel static hosting headers.
- `firebase-config.json`: your public Firebase **web** configuration, supplied for reference.

No Node.js required for this deployment if you use the Vercel browser upload or connect a Git repository through Vercel. The app must run on HTTPS, not a `file://` URL. The JavaScript modules load from Google's Firebase CDN, so internet is required.

## Setup in the browser

1. Go to https://console.firebase.google.com/ and select the existing **byteworks-5b5fb** project.
2. Go to **Authentication → Sign-in method → Add new provider → Anonymous → Enable**. No usernames/passwords are requested by the app.
3. Go to **Firestore Database → Create database** if necessary. Choose the location intentionally. During setup, NEVER publish the `allow read, write: if true` test rules.
4. Go to **Firestore Database → Rules**. Replace the rules with the complete contents of `firestore.rules` and **Publish** them. This MUST be done before you enter real customer information.
5. Deploy the folder's `index.html`, `app.js`, `firebase-sync.js` and `vercel.json` through Vercel. You can upload the extracted folder with Vercel's browser deployment flow, or put the files in a Git repository and connect it to Vercel. Choose a **static/Other** framework preset and **no build command**. The site must serve `/app.js` and `/firebase-sync.js` as JavaScript files.
6. Open your Vercel URL. It will silently authenticate the browser and display its Firebase device UID, and it will say **Approve this device**.
7. In Firebase Console → Firestore Database → **Data**, start collection `approvedDevices`. Add a document whose **Document ID** exactly matches that UID; add a Boolean field named `enabled` with value `true`. (You are creating this document using Firebase's administrative console, not through the website.) Reload the website.
8. Choose **Hardware** or **Software**. Both enter the same shared dashboard. Repeat step 6–7 for your phone and Peyton's browser. Each different browser profile / private window generally gets a different UID.
9. Test on two devices: create a fictional customer on one and check the other. Always verify receipts, forms, backups, and payments before real use.

## Moving your existing V1.7 data

**Back up V1.7 FIRST**: open the old HTML in the same browser/context where its records exist, then Settings → Export JSON backup. Save a copy safely.

After the new site is approved, go to Settings and **Import JSON backup**. This replaces the shared cloud workspace data, so do this once **before** either technician creates any new real jobs. Confirm the cloud data appears on the second device.

The old local HTML and new Vercel URL have separate browser storage. Existing local data will not magically migrate. Keep a separate backup even after importing.

## Security and limitations

- The Hardware/Software picker **labels activity only**. Anyone with access to a previously approved browser profile can select either role. It is not strong identity verification.
- Firebase anonymous sign-in **does not itself secure data**. The `approvedDevices/<UID>` allowlist in the rules prevents unapproved devices accessing the workspace. Never replace these rules with broad access for `request.auth != null`.
- Revoke access by changing that device's `approvedDevices/<UID>.enabled` to `false` or deleting the document in Firebase Console. The device may still retain its last locally cached data; do not use shared/untrusted computers.
- Clearing browser data or using a different browser creates a different anonymous UID; approve it again manually.
- This starter sync stores the workshop in a **single Firestore document**. It is suited to a small, lightly used workshop, subject to Firestore's 1 MiB document limit. It detects simultaneous write conflicts and stores the unsynced attempted state in that browser's `localStorage` under `byteworks_hub_conflict_backup`. It does **not** automatically merge edits. If you see a conflict, preserve both versions and reconcile manually before continuing.
- Work offline is **not guaranteed**. If a save fails, export a JSON backup before closing.
- For heavier or production use, migrate to one Firestore document per customer, job, payment, and appointment, with proper migrations and automated backups.
- The backend has no server-side individual technician identity or granular permissions. Treat the app as a small trusted-device prototype until security is assessed and tested. Do not store customers' login passwords or sensitive credentials.
- Receipt and intake template content should be independently checked for your business and Australian Consumer Law compliance before use.

## Debugging

- **Permission denied**: verify Anonymous auth enabled, the UID was copied exactly, `enabled` is Boolean `true`, and the rules were published.
- **Network error**: verify HTTPS, internet, and that scripts are served correctly.
- **Blank screen**: check the browser console. Do not use the ChatGPT inline HTML preview because CSP restrictions may block scripts.
- **Missing old jobs**: import a JSON backup from the previous local version.
- **Wrong technician shown**: use the Switch button; the chosen role is remembered per browser.

Firebase docs:
- https://firebase.google.com/docs/auth/web/anonymous-auth
- https://firebase.google.com/docs/firestore/security/rules-conditions
- https://firebase.google.com/docs/firestore/manage-data/transactions
