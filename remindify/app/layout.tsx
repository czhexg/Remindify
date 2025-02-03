import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { Box, CssBaseline, Container } from "@mui/material";
import Navbar from "@/components/navbar";

export const metadata = {
    title: "Event Manager",
    description: "Manage events and notifications effortlessly.",
};

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <InitColorSchemeScript attribute="class" />
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Navbar />
                        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                            <Container>{props.children}</Container>
                        </Box>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
