# ByteWorks Hub V2.9 — Archives

- Archives tab shows jobs not updated for seven days and manually archived jobs.
- Archived jobs are hidden from the active jobs listing and recent dashboard jobs, but are **not deleted**. Linked customer, payments, receipts, intake forms and parts remain in the shared data.
- Restoring a job resets its last-touched timestamp. Editing a job or part updates its last-touched timestamp.
- Automatic archiving runs only while the web app is open, when cloud data loads and periodically while open. It does not require scheduled Firebase functions.
- **Existing jobs:** For records without an edit timestamp, the original job date is used, so old jobs may immediately move to Archives on first load. You can restore them.
- The database uses the existing shared Firestore document, so its 1 MiB document limit still applies.
- Back up JSON before redeploying; redeploy the entire directory to Vercel. No Firestore rule changes.
- Syntax checks cannot guarantee all interactive flows; test two-device sync and archive/restore with fictional jobs before real customer data.
