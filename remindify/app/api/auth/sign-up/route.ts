import { NextResponse } from "next/server";
import { supabase } from "../../utils/createClient";
import { setAuthCookies } from "@/api/utils/utils";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            console.error(error);
            return NextResponse.json(
                { error: error.message },
                {
                    status: 400,
                }
            );
        }

        let response = NextResponse.json(
            {
                user: data.user,
            },
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );

        // const access_token = data.session?.access_token;
        // const refresh_token = data.session?.refresh_token;

        // setAuthCookies(response, access_token, refresh_token);

        return response;
    } catch (err) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
