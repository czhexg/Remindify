import React from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
} from "@mui/material";
import Link from "next/link";

import CreateEventModal from "@/components/createEventModal";
import withAuth from "@/components/hoc/withAuth";
import { Event } from "@/api/types";
import { cookies } from "next/headers";

async function EventsPage() {
    const cookieStore = await cookies();
    const eventsData = await fetch(`${process.env.BASE_URL}/api/events`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString(),
        },
        credentials: "include", // Ensures cookies are sent with the request
        cache: "no-store",
    });

    const events: Event[] = await eventsData.json();

    const convertDate = (date: string) => {
        // Parse the date string
        const dateObj = new Date(date);

        // Format the date as DD-MM-YYYY
        const formattedDate = dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        return formattedDate;
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Events
            </Typography>
            <CreateEventModal />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event) => (
                        <TableRow key={event.id}>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>
                                {convertDate(event.start_date)}
                            </TableCell>
                            <TableCell>{event.category.name}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ mr: 1 }}
                                >
                                    <Link
                                        href={`/events/${event.id}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        Edit
                                    </Link>
                                </Button>
                                <Button variant="outlined" color="secondary">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default withAuth(EventsPage);
