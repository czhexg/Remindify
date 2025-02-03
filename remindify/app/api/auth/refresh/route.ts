import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken, setAuthCookies } from "@/api/utils/utils";

export const runtime = "edge";

export async function POST(request: NextRequest) {
    // Try to refresh the token using a refresh token
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
        return NextResponse.json(
            { error: "Unauthorized: No refresh token provided" },
            { status: 401 }
        );
    }

    const { refreshedSession, refreshSessionError } = await refreshAccessToken(
        refreshToken
    );

    if (refreshSessionError || !refreshedSession || !refreshedSession.session) {
        return NextResponse.json(
            { error: "Unable to refresh token. Please log in again." },
            { status: 401 }
        );
    }

    const response = NextResponse.next(); // Create a response to modify cookies
    const newAccessToken = refreshedSession.session.access_token;
    const newRefreshToken = refreshedSession.session.refresh_token;

    // Set the new tokens in the response
    setAuthCookies(response, newAccessToken, newRefreshToken);

    return response;
}
