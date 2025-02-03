import { NextResponse } from "next/server";
import { createNotificationUtil } from "../utils/notificationUtils";
import { Controller, handler } from "../middleware/handler";
import { verifyToken } from "../middleware/authMiddleware";

export const runtime = "edge";

const createNotificationHandler: Controller = async (request: Request) => {
    try {
        const { event_id, reminder_date, channel, message } =
            await request.json();

        try {
            const notification = await createNotificationUtil({
                event_id,
                reminder_date,
                channel,
                message,
            });

            // Return the created notification
            return NextResponse.json(notification, { status: 201 });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : error;
            console.error("Error creating notification:", errorMessage);
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};

export const POST = handler(verifyToken, createNotificationHandler);
