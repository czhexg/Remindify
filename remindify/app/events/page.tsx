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
import { withAuth } from "@/components/hoc/withAuth";

function EventsPage() {
    const events = [
        { id: 1, name: "Meeting", date: "2024-01-10", category: "Work" },
        {
            id: 2,
            name: "Birthday Party",
            date: "2024-01-15",
            category: "Personal",
        },
    ];

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
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.category}</TableCell>
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
