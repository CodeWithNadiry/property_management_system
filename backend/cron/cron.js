import cron from "node-cron";
import {
  sendCheckInReminderEmails,
  sendCheckOutReminderEmails,
} from "../jobs/check_in.job.js";

export function startCronJobs() {
  console.log("Cron jobs started");

  cron.schedule("* * * * *", async () => {
    console.log("Cron triggered for check-in emails after every 1 minute");
    await sendCheckInReminderEmails();
  });

  cron.schedule("0 9 * * *", async () => {
    console.log("Cron triggered for check-out emails at 9 AM");
    await sendCheckOutReminderEmails();
  });
}
