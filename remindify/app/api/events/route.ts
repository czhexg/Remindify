import { NextResponse } from "next/server";
import { supabase } from "../utils/createClient";
import { createRecurrenceUtil } from "../utils/recurrenceUtils";
import { createNotificationUtil } from "../utils/notificationUtils";
import { EventData, NotificationData, RecurrenceData } from "../types";
import { Controller, handler } from "../middleware/handler";
import { verifyToken } from "../middleware/authMiddleware";

export const runtime = "edge";

const getAllEvents: Controller = async (request: Request) => {
    try {
        // Extract the X-User-Id from the headers
        const userId = request.headers.get("X-User-Id");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID not provided" },
                { status: 400 }
            );
        }
        // Fetch events from the database filtered by user_id
        const { data: events, error } = await supabase
            .from("events")
            .select("*, recurrence (*), notifications (*)")
            .eq("user_id", userId);

        if (error) {
            console.error("Error fetching events:", error);
            return NextResponse.json({ error: error }, { status: 500 });
        }

        // Return the events
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};

const createEvent: Controller = async (request: Request) => {
    try {
        const { eventData, recurrenceData, notificationData } =
            (await request.json()) as {
                eventData: EventData;
                recurrenceData: RecurrenceData;
                notificationData: NotificationData;
            };

        console.log(eventData, recurrenceData, notificationData);
        const { user_id, category_id, name, start_date, notes } = eventData;

        // Insert a new event into the database
        const { data, error } = await supabase
            .from("events")
            .insert([{ user_id, category_id, name, start_date, notes }])
            .select();

        if (error) {
            console.error("Error creating event:", error);
            return NextResponse.json({ error: error }, { status: 500 });
        }

        const event = data[0];
        const event_id = event.id;
        const { frequency, end_date } = recurrenceData;

        try {
            const recurrence = await createRecurrenceUtil({
                event_id,
                frequency,
                end_date,
            });

            // combine the event and recurrence data
            event.recurrence = recurrence;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : error;
            console.error("Error creating recurrence:", errorMessage);
            // return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

        const { reminder_date, channel, message } = notificationData;

        try {
            const notification = await createNotificationUtil({
                event_id,
                reminder_date,
                channel,
                message: message ?? undefined,
            });

            // combine the event and notification data
            event.notification = notification;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : error;
            console.error("Error creating notification:", errorMessage);
            // return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

        // Return the created event
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};

export const POST = handler(verifyToken, createEvent);
export const GET = handler(verifyToken, getAllEvents);
