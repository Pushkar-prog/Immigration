import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  tourists: defineTable({
    fullName: v.string(),
    nationality: v.string(),
    passportNumber: v.string(),
    visaNumber: v.string(),
    visaType: v.string(),
    visaExpirationDate: v.string(),
    dateOfEntry: v.string(),
    durationOfStay: v.number(), // in days
    intendedLocation: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    status: v.union(
      v.literal("Active"),
      v.literal("Expired"),
      v.literal("Alert Sent"),
      v.literal("Left"),
      v.literal("Renewed")
    ),
    reminderSent: v.boolean(),
    lastReminderDate: v.optional(v.string()),
    exitDate: v.optional(v.string()),
    renewalDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_nationality", ["nationality"])
    .index("by_visa_expiration", ["visaExpirationDate"])
    .index("by_passport", ["passportNumber"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
