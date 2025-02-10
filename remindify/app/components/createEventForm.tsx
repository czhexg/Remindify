"use client";

import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
    Grid2 as Grid,
    Button,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
    Category,
    EventData,
    NotificationData,
    RecurrenceData,
} from "@/api/types";
import { useRouter } from "next/navigation";

type FormValues = {
    eventData: EventData;
    recurrenceData: RecurrenceData;
    notificationData: NotificationData;
};

export default function CreateEventForm(props: { handleClose?: () => void }) {
    console.log("CreateEventForm");

    const [categories, setCategories] = useState<Category[]>([]);
    const [formValues, setFormValues] = useState<FormValues>({
        eventData: {
            user_id: localStorage.getItem("user_id") || "",
            category_id: "",
            name: "",
            start_date: dayjs().format("YYYY-MM-DD"),
            notes: "",
        },
        recurrenceData: {
            frequency: "once",
        },
        notificationData: {
            reminder_date: "",
            channel: "",
            message: "",
        },
    });
    const [toNotify, setToNotify] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch categories from API
        async function fetchCategories(): Promise<void> {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/categories"
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }

        fetchCategories();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        dataType: string
    ) => {
        const { name, value } = e.target;
        if (dataType === "eventData") {
            setFormValues((prevValues) => ({
                ...prevValues,
                eventData: {
                    ...prevValues.eventData,
                    [name]: value,
                },
            }));
        } else if (dataType === "recurrenceData") {
            setFormValues((prevValues) => ({
                ...prevValues,
                recurrenceData: {
                    ...prevValues.recurrenceData,
                    [name]: value,
                },
            }));
        } else if (dataType === "notificationData") {
            setFormValues((prevValues) => ({
                ...prevValues,
                notificationData: {
                    ...prevValues.notificationData,
                    [name]: value,
                },
            }));
        }
    };

    const handleDropdownChange = (
        e: SelectChangeEvent<unknown>,
        dataType: string
    ) => {
        const { name, value } = e.target;
        if (dataType === "eventData") {
            setFormValues((prevValues) => ({
                ...prevValues,
                eventData: {
                    ...prevValues.eventData,
                    [name]: value as string,
                },
            }));
        } else if (dataType === "recurrenceData") {
            setFormValues((prevValues) => ({
                ...prevValues,
                recurrenceData: {
                    ...prevValues.recurrenceData,
                    [name]: value as string,
                },
            }));
        } else if (dataType === "notificationData") {
            setFormValues((prevValues) => ({
                ...prevValues,
                notificationData: {
                    ...prevValues.notificationData,
                    [name]: value as string,
                },
            }));
        }
    };

    const handleDateTimeChange = (newValue: Dayjs | null, name: string) => {
        // Determine which date to update based on the name parameter
        if (name === "start_date") {
            setFormValues((prevValues) => ({
                ...prevValues,
                eventData: {
                    ...prevValues.eventData,
                    start_date:
                        newValue?.format("YYYY-MM-DD") ||
                        dayjs().format("YYYY-MM-DD"),
                },
            }));
        } else if (name === "end_date") {
            setFormValues((prevValues) => ({
                ...prevValues,
                recurrenceData: {
                    ...prevValues.recurrenceData,
                    end_date:
                        newValue?.format("YYYY-MM-DD") ||
                        dayjs().format("YYYY-MM-DD"),
                },
            }));
        } else if (name === "reminder_date") {
            setFormValues((prevValues) => ({
                ...prevValues,
                notificationData: {
                    ...prevValues.notificationData,
                    reminder_date:
                        newValue?.format("YYYY-MM-DD") ||
                        dayjs().format("YYYY-MM-DD"),
                },
            }));
        }
    };

    // refer to the types.ts file for the actual data types for the eventData, recurrenceData, and notificationData
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted:", formValues);
        // Perform your API call or logic to create the event
        const submitResponse = await fetch("api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        });
        if (!submitResponse.ok) {
            console.error("Error creating event:", submitResponse.statusText);
            return;
        }
        console.log("Event created successfully!");
        // Close the modal
        props.handleClose ? props.handleClose() : router.push("/events");
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Event Name"
                name="name"
                value={formValues.eventData.name}
                onChange={(e) => handleInputChange(e, "eventData")}
                fullWidth
                required
                margin="normal"
            />

            {/* Event Category */}
            <FormControl fullWidth required margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    name="category_id"
                    value={formValues.eventData.category_id}
                    onChange={(e) => handleDropdownChange(e, "eventData")}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Event DateTime */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Start Date"
                    value={dayjs(formValues.eventData.start_date)}
                    onChange={(newValue) =>
                        handleDateTimeChange(newValue, "start_date")
                    }
                    slotProps={{
                        textField: {
                            required: true,
                            error: !formValues.eventData.start_date, // Show error if end_date is not set
                            helperText: !formValues.eventData.start_date
                                ? "This field is required"
                                : "",
                        },
                    }}
                    sx={{ mt: 1 }}
                />
                <DatePicker
                    label="End Date (optional)"
                    value={
                        formValues.recurrenceData.end_date
                            ? dayjs(formValues.recurrenceData.end_date)
                            : null
                    }
                    onChange={(newValue) =>
                        handleDateTimeChange(newValue, "end_date")
                    }
                    sx={{ mt: 2 }}
                />
            </LocalizationProvider>

            {/* Frequency */}
            <FormControl fullWidth required margin="normal">
                <InputLabel id="frequency-label">Frequency</InputLabel>
                <Select
                    labelId="frequency-label"
                    name="frequency"
                    value={formValues.recurrenceData.frequency}
                    onChange={(e) => handleDropdownChange(e, "recurrenceData")}
                >
                    {/* The values for the frequency dropdown should be the same as the ones in the database */}
                    <MenuItem value="once">Once</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
            </FormControl>

            {/* Event Notes */}
            <TextField
                label="Notes (optional)"
                name="notes"
                value={formValues.eventData.notes}
                onChange={(e) => handleInputChange(e, "eventData")}
                fullWidth
                multiline
                rows={4}
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={toNotify}
                        onChange={(e) => setToNotify(e.target.checked)}
                    />
                }
                label="Enable Notifications"
            />
            {toNotify && (
                <>
                    {/* Notification Date */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Reminder Date"
                            value={dayjs(
                                formValues.notificationData.reminder_date
                            )}
                            onChange={(newValue) =>
                                handleDateTimeChange(newValue, "reminder_date")
                            }
                            slotProps={{
                                textField: {
                                    required: true,
                                    error: !formValues.notificationData
                                        .reminder_date, // Show error if reminder_date is not set
                                    helperText: !formValues.notificationData
                                        .reminder_date
                                        ? "This field is required"
                                        : "",
                                },
                            }}
                            sx={{ mt: 1 }}
                        />
                    </LocalizationProvider>

                    {/* Notification Channel */}
                    <FormControl fullWidth required margin="normal">
                        <InputLabel id="channel-label">Channel</InputLabel>
                        <Select
                            labelId="channel-label"
                            name="channel"
                            value={formValues.notificationData.channel}
                            onChange={(e) =>
                                handleDropdownChange(e, "notificationData")
                            }
                        >
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="sms">SMS</MenuItem>
                            <MenuItem value="push">Push Notification</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Notification Message */}
                    <TextField
                        label="Message (optional)"
                        name="message"
                        value={formValues.notificationData.message}
                        onChange={(e) =>
                            handleInputChange(e, "notificationData")
                        }
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                    />
                </>
            )}

            {/* Submit Button */}
            <Grid
                container
                justifyContent="flex-end"
                spacing={2}
                sx={{ mt: 2 }}
            >
                <Grid>
                    <Button
                        onClick={() => {
                            if (props.handleClose) {
                                props.handleClose();
                            } else {
                                router.push("/events");
                            }
                        }}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                </Grid>
                <Grid>
                    <Button type="submit" variant="contained" color="primary">
                        Create
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
