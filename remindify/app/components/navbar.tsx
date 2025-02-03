import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

export default function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link
                        href="/"
                        style={{
                            textDecoration: "none",
                            color: "white",
                        }}
                    >
                        Event Manager
                    </Link>
                </Typography>
                <Link
                    href="/events"
                    style={{
                        textDecoration: "none",
                        color: "white",
                        marginRight: "20px",
                    }}
                >
                    Events
                </Link>
                <Link
                    href="/notifications"
                    style={{
                        textDecoration: "none",
                        color: "white",
                        marginRight: "20px",
                    }}
                >
                    Notifications
                </Link>
                <Link
                    href="/settings"
                    style={{
                        textDecoration: "none",
                        color: "white",
                    }}
                >
                    Settings
                </Link>
            </Toolbar>
        </AppBar>
    );
}
