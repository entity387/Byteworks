# ByteWorks Hub V2.8.1 Startup Fix

This fixes stale installable-app caches and makes JavaScript startup problems visible instead of leaving a blank screen. The Firebase configuration, data schema, signatures, and rules are unchanged.

1. **Back up your records** from the last working deployment before updating.
2. Replace ALL files in the same Vercel project. Keep `index.html`, `app.js`, `firebase-sync.js`, `sw.js`, `manifest.webmanifest` and the `icons` folder at the deployment root.
3. Open the site in a browser and press Ctrl+Shift+R (on phone, close/reopen the app). The updated service worker uses cache version `bw-shell-v2.8.1`.
4. If it still fails, test the site in a fresh private tab and share the exact visible error or DevTools Console error. A private browser may require reauthorising a new Firebase anonymous UID.

This is a compatibility/startup patch, not proof the Firebase configuration or deployed site is operational. Customer forms should be tested using fictional information first. Signed forms still live in the single shared Firestore document and can hit the 1 MiB document size limit; migrate to separate documents before routine real customer signatures.
