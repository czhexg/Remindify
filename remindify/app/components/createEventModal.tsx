"use client";

import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import CreateEventForm from "./createEventForm";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#FFF",
    border: "2px solid #000",
    boxShadow: 24,
    padding: "0px 32px 32px 32px",
    maxHeight: "calc(100vh - 100px)", // Added to prevent modal from going off-screen
    overflowY: "auto", // Allows scrolling if content exceeds maxHeight
};

const headerStyle = {
    position: "sticky",
    top: 0,
    background: "#FFF", // Match the modal's background
    zIndex: 10, // Keep header above content
    // borderBottom: "1px solid #000", // Optional, for visual separation
    paddingTop: "32px", // Optional, for better spacing
    paddingBottom: "16px", // Optional, for better spacing
    marginBottom: "8px", // Optional, for better spacing
};

const contentStyle = {
    maxHeight: "calc(100% - 50px)", // Adjust for header height
    overflowY: "auto", // Enable vertical scrolling for content
};

export default function CreateEventModal() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Button
                onClick={handleOpen}
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
            >
                Create Event
            </Button>
            <Modal
                open={open}
                aria-labelledby="create-event-modal"
                aria-describedby="create-event-modal-description"
                sx={{ overflow: "hidden" }}
            >
                <Box sx={style}>
                    <Box sx={headerStyle}>
                        <Typography variant="h6">Create Event</Typography>
                    </Box>

                    <Box sx={contentStyle}>
                        <CreateEventForm handleClose={handleClose} />
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
