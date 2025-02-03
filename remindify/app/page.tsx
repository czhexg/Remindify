import React from "react";
import { Typography, Grid2 as Grid, Card, CardContent } from "@mui/material";
import withAuth from "./components/hoc/withAuth";

function Dashboard() {
    const events = [
        { id: 1, name: "Meeting", date: "2024-01-10", time: "10:00 AM" },
        { id: 2, name: "Birthday Party", date: "2024-01-15", time: "7:00 PM" },
    ];

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {event.name}
                                </Typography>
                                <Typography variant="body2">
                                    Date: {event.date}
                                </Typography>
                                <Typography variant="body2">
                                    Time: {event.time}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default withAuth(Dashboard);
