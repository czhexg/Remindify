const accessToken = request.cookies.get("access_token")?.value;

        console.log("Access token:", accessToken);

        if (!accessToken) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Validate the token
        const { data: user, error: authError } = await supabase.auth.getUser(
            accessToken
        );

        if (authError) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        console.log("User:", user);