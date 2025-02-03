import nodemailer from "nodemailer";
import { getDueNotificationsUtil } from "./notificationUtils";

/**
 * Sends an email notification.
 *
 * @param to - Recipient's email address
 * @param subject - Subject of the email
 * @param message - Message body of the email
 */
export async function sendEmailNotification(
    to: string,
    subject: string,
    message: string
): Promise<void> {
    // Create a transporter using SMTP credentials
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10), // Default to 587 if not provided
        secure: false, // Use true for port 465 (SSL), false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.SMTP_USER, // Sender's email
        to, // Recipient's email
        subject, // Email subject
        text: message, // Plaintext email body
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}

/**
 * Sends due notifications to users.
 * This function is called by a scheduled task or cron job.
 * It fetches all due notifications from the database and sends them to users.
 *
 * @returns {Promise<void>}
 */
export async function sendDueNotifications(): Promise<void> {
    const notifications = await getDueNotificationsUtil();
    console.log("Due notifications:", notifications);

    for (const notification of notifications) {
        console.log("Sending notification:", notification);

        const { channel, message, reminder_date, event } = notification;
        const userEmail = event.user.email;

        // Write a custom message for the notification if message is not provided
        let newMessage = "";
        if (!message) {
            newMessage = `Hi ${event.user.email},\n\nthis is a reminder for your ${event.category.name} event "${event.name}" scheduled on ${reminder_date}.`;
        } else {
            newMessage = `${message}\n\n---\n\n${event.user.email}, just a reminder: Your ${event.category.name} event "${event.name}" is happening on ${reminder_date}.`;
        }

        if (channel === "email") {
            await sendEmailNotification(
                userEmail,
                `Reminder for ${event.category.name} event "${event.name}" on ${reminder_date}`,
                newMessage
            );
        }
    }

    console.log("Sent due notifications");
}
