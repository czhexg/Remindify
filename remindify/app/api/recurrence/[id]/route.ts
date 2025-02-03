import { NextResponse } from "next/server";
import { updateRecurrenceUtil } from "../../utils/recurrenceUtils";
import { Controller, handler } from "@/api/middleware/handler";
import { verifyToken } from "@/api/middleware/authMiddleware";

export const runtime = "edge";

const updateRecurrence: Controller = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const recurrence_id = (await params).id;
        const { frequency, end_date } = await request.json();

        try {
            const recurrence = await updateRecurrenceUtil({
                recurrence_id,
                frequency,
                end_date,
            });

            // Return the updated recurrence
            return NextResponse.json(recurrence, { status: 201 });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : error;
            console.error("Error updating recurrence:", errorMessage);
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

export const PUT = handler(verifyToken, updateRecurrence);
