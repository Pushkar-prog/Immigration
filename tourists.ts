import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

// Helper function to check if user is authenticated
async function requireAuth(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

// Helper function to calculate visa status
function calculateVisaStatus(visaExpirationDate: string, reminderSent: boolean, exitDate?: string, renewalDate?: string): "Active" | "Expired" | "Alert Sent" | "Left" | "Renewed" {
  if (exitDate) return "Left";
  if (renewalDate) return "Renewed";
  
  const today = new Date();
  const expirationDate = new Date(visaExpirationDate);
  const daysDiff = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
  if (daysDiff < 0) return "Expired";
  if (daysDiff <= 3 && reminderSent) return "Alert Sent";
  return "Active";
}

// Add a new tourist
export const addTourist = mutation({
  args: {
    fullName: v.string(),
    nationality: v.string(),
    passportNumber: v.string(),
    visaNumber: v.string(),
    visaType: v.string(),
    visaExpirationDate: v.string(),
    dateOfEntry: v.string(),
    durationOfStay: v.number(),
    intendedLocation: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    
    const status = calculateVisaStatus(args.visaExpirationDate, false);
    
    const touristId = await ctx.db.insert("tourists", {
      ...args,
      status,
      reminderSent: false,
    });

    // Schedule reminder check
    await ctx.scheduler.runAfter(0, internal.tourists.checkAndScheduleReminders, {});
    
    return touristId;
  },
});

// Get all tourists
export const getAllTourists = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    
    const tourists = await ctx.db.query("tourists").collect();
    
    // Update status for each tourist based on current date
    return tourists.map(tourist => ({
      ...tourist,
      status: calculateVisaStatus(
        tourist.visaExpirationDate, 
        tourist.reminderSent, 
        tourist.exitDate, 
        tourist.renewalDate
      )
    }));
  },
});

// Get tourists by status
export const getTouristsByStatus = query({
  args: { status: v.union(v.literal("Active"), v.literal("Expired"), v.literal("Alert Sent"), v.literal("Left"), v.literal("Renewed")) },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    
    const tourists = await ctx.db
      .query("tourists")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
    
    return tourists;
  },
});

// Mark tourist as exited
export const markAsExited = mutation({
  args: {
    touristId: v.id("tourists"),
    exitDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    
    await ctx.db.patch(args.touristId, {
      status: "Left",
      exitDate: args.exitDate,
      notes: args.notes,
    });
  },
});

// Mark visa as renewed
export const markAsRenewed = mutation({
  args: {
    touristId: v.id("tourists"),
    renewalDate: v.string(),
    newExpirationDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    
    await ctx.db.patch(args.touristId, {
      status: "Renewed",
      renewalDate: args.renewalDate,
      visaExpirationDate: args.newExpirationDate,
      reminderSent: false,
      notes: args.notes,
    });
  },
});

// Send reminder manually
export const sendReminder = mutation({
  args: {
    touristId: v.id("tourists"),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    
    const tourist = await ctx.db.get(args.touristId);
    if (!tourist) {
      throw new Error("Tourist not found");
    }
    
    // Simulate sending reminder (in real app, this would send email/SMS)
    console.log(`Reminder sent to ${tourist.fullName} (${tourist.email}) - Visa expires on ${tourist.visaExpirationDate}`);
    
    await ctx.db.patch(args.touristId, {
      reminderSent: true,
      lastReminderDate: new Date().toISOString().split('T')[0],
      status: "Alert Sent",
    });
    
    return { success: true, message: `Reminder sent to ${tourist.fullName}` };
  },
});

// Internal function to check and schedule reminders
export const checkAndScheduleReminders = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tourists = await ctx.db.query("tourists").collect();
    const today = new Date();
    
    for (const tourist of tourists) {
      if (tourist.exitDate || tourist.renewalDate) continue;
      
      const expirationDate = new Date(tourist.visaExpirationDate);
      const daysDiff = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      // Send reminder if visa expires in 3 days or less and reminder not sent
      if (daysDiff <= 3 && daysDiff >= 0 && !tourist.reminderSent) {
        console.log(`Auto-reminder: ${tourist.fullName}'s visa expires in ${daysDiff} days`);
        
        await ctx.db.patch(tourist._id, {
          reminderSent: true,
          lastReminderDate: today.toISOString().split('T')[0],
          status: "Alert Sent",
        });
      }
      
      // Update status for expired visas
      if (daysDiff < 0 && tourist.status !== "Expired") {
        await ctx.db.patch(tourist._id, {
          status: "Expired",
        });
      }
    }
  },
});

// Get dashboard statistics
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    
    const tourists = await ctx.db.query("tourists").collect();
    
    const stats = {
      total: tourists.length,
      active: 0,
      expired: 0,
      alertSent: 0,
      left: 0,
      renewed: 0,
    };
    
    tourists.forEach(tourist => {
      const status = calculateVisaStatus(
        tourist.visaExpirationDate, 
        tourist.reminderSent, 
        tourist.exitDate, 
        tourist.renewalDate
      );
      
      switch (status) {
        case "Active":
          stats.active++;
          break;
        case "Expired":
          stats.expired++;
          break;
        case "Alert Sent":
          stats.alertSent++;
          break;
        case "Left":
          stats.left++;
          break;
        case "Renewed":
          stats.renewed++;
          break;
      }
    });
    
    return stats;
  },
});
