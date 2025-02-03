import { NextResponse } from "next/server";
import { supabase } from "../../utils/createClient";
import { updateRecurrenceUtil } from "../../utils/recurrenceUtils";
import { updateNotificationUtil } from "../../utils/notificationUtils";
import { Controller, handler } from "@/api/middleware/handler";
import { verifyToken } from "@/api/middleware/authMiddleware";

export const runtime = "edge";

const getEvent: Controller = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    // Extract the X-User-Id from the headers
    const userId = request.headers.get("X-User-Id");

    if (!userId) {
        return NextResponse.json(
            { error: "User ID not provided" },
            { status: 400 }
        );
    }

    try {
        const event_id = (await params).id;

        // Fetch event with specific id from the database
        const { data: events, error } = await supabase
            .from("events")
            .select("*, recurrence (*), notifications (*)")
            .eq("user_id", userId)
            .eq("id", event_id);

        if (error) {
            console.error(
                `Error fetching event with id ${event_id}: `,
                error.message
            );
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Return the event
        return NextResponse.json(events[0], { status: 200 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};

const updateEvent: Controller = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    // Extract the X-User-Id from the headers
    const userId = request.headers.get("X-User-Id");

    if (!userId) {
        return NextResponse.json(
            { error: "User ID not provided" },
            { status: 400 }
        );
    }

    try {
        const event_id = (await params).id;
        const { eventData, recurrenceData, notificationData } =
            await request.json();
        const { category_id, name, start_date, notes } = eventData;

        // Update an event in the database
        const { data, error } = await supabase
            .from("events")
            .update({ category_id, name, start_date, notes })
            .eq("user_id", userId)
            .eq("id", event_id)
            .select("*, recurrence (*), notifications (*)");

        if (error) {
            console.error("Error updating event:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const event = data[0];
        const { frequency, end_date } = recurrenceData;

        // Update the recurrence if changes are made
        if (event.recurrence?.length) {
            const oldRecurrence = event.recurrence[0];
            if (
                oldRecurrence.frequency !== frequency ||
                oldRecurrence.end_date !== end_date
            ) {
                try {
                    const updatedRecurrence = await updateRecurrenceUtil({
                        recurrence_id: oldRecurrence.id,
                        frequency,
                        end_date,
                    });

                    // Combine the event and recurrence data
                    event.recurrence = updatedRecurrence;
                } catch (error) {
                    const errorMessage =
                        error instanceof Error ? error.message : error;
                    console.error("Error updating recurrence:", errorMessage);
                    return NextResponse.json(
                        { error: errorMessage },
                        { status: 500 }
                    );
                }
            }
        }

        const { reminder_date, channel, message } = notificationData;

        // Update the notification if changes are made
        if (event.notifications?.length) {
            const oldNotification = event.notifications[0];
            if (
                oldNotification.reminder_date !== reminder_date ||
                oldNotification.channel !== channel ||
                oldNotification.message !== message
            ) {
                try {
                    const updatedNotification = await updateNotificationUtil({
                        notification_id: oldNotification.id,
                        reminder_date,
                        channel,
                        message,
                    });

                    // Combine the event and notification data
                    event.notification = updatedNotification;
                } catch (error) {
                    const errorMessage =
                        error instanceof Error ? error.message : error;
                    console.error("Error updating notification:", errorMessage);
                    return NextResponse.json(
                        { error: errorMessage },
                        { status: 500 }
                    );
                }
            }
        }

        // Return the updated event
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};

const deleteEvent: Controller = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const event_id = (await params).id;

        // Delete an event from the database
        const { data, error } = await supabase
            .from("events")
            .delete()
            .eq("id", event_id)
            .select();

        if (error) {
            console.error("Error creating event:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Return the deleted event
        return NextResponse.json(data[0], { status: 201 });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};

export const GET = handler(verifyToken, getEvent);
export const PUT = handler(verifyToken, updateEvent);
export const DELETE = handler(verifyToken, deleteEvent);
