import { NextRequest, NextResponse } from "next/server";
import { updateNotificationUtil } from "../../utils/notificationUtils";
import { Controller, handler } from "@/api/middleware/handler";
import { verifyToken } from "@/api/middleware/authMiddleware";

export const runtime = "edge";

const updateNotificationHandler: Controller = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const notification_id = (await params).id;
        const { reminder_date, channel, message } = await request.json();

        try {
            const notification = await updateNotificationUtil({
                notification_id,
                reminder_date,
                channel,
                message,
            });

            // Return the updated notification
            return NextResponse.json(notification, { status: 201 });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : error;
            console.error("Error updating notification:", errorMessage);
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

export const PUT = handler(verifyToken, updateNotificationHandler);
