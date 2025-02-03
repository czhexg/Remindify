import { NextResponse } from "next/server";
import { supabase } from "./createClient";

// function to set httpOnly cookies in the response object. This function will be used in the sign-in and sign-up route to set the access_token and refresh_token cookies in the response object.
export const setAuthCookies = (
    response: NextResponse,
    access_token: any,
    refresh_token: any
) => {
    response.cookies.set("access_token", access_token, {
        httpOnly: true, // Prevents access from JavaScript
        secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
        sameSite: "strict", // Prevent CSRF
        maxAge: 60 * 60 * 24, // 1 day expiration
    });

    response.cookies.set("refresh_token", refresh_token, {
        httpOnly: true, // Prevents access from JavaScript
        secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
        sameSite: "strict", // Prevent CSRF
        maxAge: 60 * 60 * 24 * 7, // 7 days expiration
    });
};

export const verifyAccessToken = async (accessToken: string) => {
    // Validate the token
    const { data, error: getAccessTokenError } = await supabase.auth.getUser(
        accessToken
    );

    return { data, getAccessTokenError };
};
export const refreshAccessToken = async (refreshToken: string) => {
    const { data: refreshedSession, error: refreshSessionError } =
        await supabase.auth.refreshSession({ refresh_token: refreshToken });

    return { refreshedSession, refreshSessionError };
};
