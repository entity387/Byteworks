# ByteWorks Hub V2.7: Parts Sources

Deploy the contents of this folder to your existing Vercel site. Back up the current app first. No new Firebase settings are needed.

In Jobs → Edit job → Required part, select **Order from supplier**, **Customer supplied**, or **Workshop stock**. Product URL is optional. Customer-supplied and stock parts are not included in Orders to place. If a non-order part is marked Needed or Awaiting Approval when saved, it is instead marked Arrived, ready for installation. Existing records default to Order from supplier so they remain compatible.

Source is included in parts CSV exports. No customer payment is charged automatically. This release has been checked for JS syntax but still requires a deployed browser test.
