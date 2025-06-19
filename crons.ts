import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Check for visa expiration reminders daily at 9 AM
crons.cron("check visa reminders", "0 9 * * *", internal.tourists.checkAndScheduleReminders, {});

export default crons;
