import { NextResponse } from "next/server";
import { createRecurrenceUtil } from "../utils/recurrenceUtils";
import { Controller, handler } from "../middleware/handler";
import { verifyToken } from "../middleware/authMiddleware";

export const runtime = "edge";

const createRecurrence: Controller = async (request: Request) => {
    try {
        const { event_id, frequency, end_date } = await request.json();

        try {
            const recurrence = await createRecurrenceUtil({
                event_id,
                frequency,
                end_date,
            });

            // Return the created recurrence
            return NextResponse.json(recurrence, { status: 201 });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : error;
            console.error("Error creating recurrence:", errorMessage);
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

export const POST = handler(verifyToken, createRecurrence);
