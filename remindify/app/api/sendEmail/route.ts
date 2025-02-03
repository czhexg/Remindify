import { NextResponse } from "next/server";
import { sendDueNotifications } from "../utils/sendEmail";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        await sendDueNotifications();

        // Return a success message
        return NextResponse.json({ message: "Email sent" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
