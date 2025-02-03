"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/auth/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to register");
                setLoading(false);
                return;
            }

            // redirect the user to the login page after successful registration
            router.push("/auth/login");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                bgcolor: "background.default",
                color: "text.primary",
                p: 3,
            }}
        >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Register
            </Typography>
            <Box
                component="form"
                onSubmit={handleRegister}
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Register"
                    )}
                </Button>
                <Typography variant="body2" align="center">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        style={{ textDecoration: "none", color: "#1976d2" }}
                    >
                        Login
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}
