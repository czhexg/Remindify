import { supabase } from "./createClient";
import { DueNotification, Notification } from "../types";

/**
 * Creates a notification for an event.
 *
 * @param {Object} options
 * @param {string} options.event_id - The UUID of the event.
 * @param {string} options.reminder_date - The date and time of the reminder.
 * @param {string} options.channel - The notification channel (e.g., "email", "telegram").
 * @param {string | undefined} options.message - The notification message (optional).
 * @returns {Promise<Notification>} - The created notification data or an error.
 */
export async function createNotificationUtil({
    event_id,
    reminder_date,
    channel,
    message,
}: {
    event_id: string;
    reminder_date: string;
    channel: string;
    message?: string;
}): Promise<Notification> {
    // Insert a new notification into the database
    const { data, error } = await supabase
        .from("notifications")
        .insert([{ event_id, reminder_date, channel, message }])
        .select()
        .returns<Notification[]>();

    if (error) {
        console.error("Error creating notification:", error);
        throw new Error("Failed to create notification");
    }

    if (!data || data.length === 0) {
        throw new Error("No data returned when creating notification");
    }

    return data[0]; // Return the created notification
}

/**
 * Updates a notification.
 *
 * @param {Object} options
 * @param {string} options.notification_id - The UUID of the notification.
 * @param {string} options.reminder_date - The date and time of the reminder.
 * @param {string} options.channel - The notification channel (e.g., "email", "telegram").
 * @param {string | undefined} options.message - The notification message (optional).
 * @returns {Promise<Notification>} - The updated notification data or an error.
 */
export async function updateNotificationUtil({
    notification_id,
    reminder_date,
    channel,
    message,
}: {
    notification_id: string;
    reminder_date: Date | string;
    channel: string;
    message?: string;
}): Promise<Notification> {
    // Update a notification in the database
    const { data, error } = await supabase
        .from("notifications")
        .update({ reminder_date, channel, message })
        .eq("id", notification_id)
        .select()
        .returns<Notification[]>();

    if (error) {
        console.error("Error updating notification:", error.message);
        throw new Error("Failed to update notification");
    }

    if (!data || data.length === 0) {
        throw new Error("No data returned when updating notification");
    }

    return data[0]; // Return the updated notification
}

/**
 * Gets all notifications that are due.
 *
 * @returns {Promise<DueNotification[]>} - The due notifications or an empty array.
 */
export async function getDueNotificationsUtil(): Promise<DueNotification[]> {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0); // Start of the day in UTC

    const todayEnd = new Date();
    todayEnd.setUTCHours(23, 59, 59, 999); // End of the day in UTC

    const { data: notifications, error } = await supabase
        .from("notifications")
        .select(
            "*, event: event_id(*, category: category_id(*), user: user_id(*), recurrence: recurrence(*))"
        )
        .gte("reminder_date", todayStart.toISOString()) // Greater than or equal to the start of today
        .lte("reminder_date", todayEnd.toISOString()) // Less than or equal to the end of today
        .returns<DueNotification[]>();

    if (error) {
        console.error("Error fetching notifications:", error.message);
        return [];
    }

    return notifications;
}
