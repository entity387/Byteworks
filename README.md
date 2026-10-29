# ByteWorks Hub V2.8 · Minimal digital intake

This update keeps the V2.7 Firebase configuration, approved-device setup, parts logistics, receipts, appointments and PWA install support.

## Intake form
1. Open an existing job and choose **Intake form**, or go to **Intake Forms → New intake form**.
2. Confirm the selected job, customer name, device condition and accessories.
3. Show the customer the clearly separated Australian Consumer Law repair notice **before accepting their device**. The notice includes the prescribed refurbished goods/parts text; review your actual refurbishment practices.
4. The customer checks acknowledgement and signs on the screen with a finger or mouse. Press **Save signed form**.
5. Use **Print / Save PDF** to provide the customer a copy (print, or securely send the generated PDF). Viewing the notice only on your device is not sufficient to meet the obligation to give it to the consumer.

There is NO waiting-for-signature job status. Each submitted signed form is stored in the shared ByteWorks data and linked to a Job ID. Previously signed versions are retained. Reopening a job does not change past signed approvals.

## Important deployment and storage notes
- Back up your current data as JSON before deploying. Update the files in your Vercel project, keeping the package directory structure.
- This uses the existing single Firestore shared document. Base64 signature images increase its size; Firestore documents have a 1 MiB limit. Move signed forms to a separate document collection or secure object storage before accumulating many real signatures. Do not use this version for large volumes of real customer forms without that change.
- Authentication remains based on your current anonymous device-approval workflow. Keep Firestore security rules restrictive. Test with fictional customer information first.
- The PDF copy is produced with the browser's Print → Save as PDF workflow; there is no automatic customer email delivery.
- Digital intake forms are not payment receipts. Consumer rights cannot be excluded by an intake signature.
