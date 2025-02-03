import { ComponentType, JSX } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/api/utils/utils";

export function withAuth<P extends JSX.IntrinsicAttributes>(
    WrappedComponent: ComponentType<P>
) {
    // The returned component is async because we await the session.
    const ComponentWithAuth = async (props: P) => {
        // Retrieve the cookie store
        const cookieStore = cookies();

        // Get the access token in HTTP-only cookie
        const accessToken = (await cookieStore).get("access_token")?.value;
        console.log("Access Token: ", accessToken);
        if (!accessToken) {
            console.log("No access token found. Redirecting to login...");
            redirect("/auth/login");
        }

        // Validate the token
        const { data, getAccessTokenError } = await verifyAccessToken(
            accessToken
        );

        if (getAccessTokenError) {
            console.log("Error verifying token:", getAccessTokenError);
            console.log("Token expired or invalid. Attempting to refresh...");

            // prettier-ignore
            // Call api to refresh the token.
            const response = await fetch("/api/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error(
                    "Failed to refresh token. Redirecting to login..."
                );
                redirect("/auth/login");
            }

            // Get the new access token from the response
            const newAccessToken = (await cookieStore).get(
                "access_token"
            )?.value;
            console.log("New Access Token: ", newAccessToken);

            if (!newAccessToken) {
                console.log("No access token found. Redirecting to login...");
                redirect("/auth/login");
            }

            // Validate the new token
            const { data, getAccessTokenError: getNewAccessTokenError } =
                await verifyAccessToken(newAccessToken);

            if (getNewAccessTokenError) {
                console.error(
                    "Failed to verify new access token. Redirecting to login..."
                );
                redirect("/auth/login");
            }
        }

        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
}

export default withAuth;
