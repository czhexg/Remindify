import { NextRequest, NextResponse } from "next/server";
import { Middleware } from "./handler";
import { supabase } from "@/api/utils/createClient";
import {
    refreshAccessToken,
    setAuthCookies,
    verifyAccessToken,
} from "../utils/utils";

export const verifyToken: Middleware = async (request: NextRequest, next) => {
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, getAccessTokenError } = await verifyAccessToken(accessToken);

    if (getAccessTokenError) {
        console.log("Error verifying token:", getAccessTokenError);
        console.log("Token expired or invalid. Attempting to refresh...");

        // Try to refresh the token using a refresh token
        const refreshToken = request.cookies.get("refresh_token")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { error: "Unauthorized: No refresh token provided" },
                { status: 401 }
            );
        }

        const { refreshedSession, refreshSessionError } =
            await refreshAccessToken(refreshToken);

        if (
            refreshSessionError ||
            !refreshedSession ||
            !refreshedSession.session
        ) {
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
    }

    // Add headers to the request
    request.headers.set("X-User-Id", data.user!.id);

    next();
};
