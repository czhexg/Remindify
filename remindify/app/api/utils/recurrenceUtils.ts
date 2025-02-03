import { supabase } from "./createClient";
import { Recurrence } from "../types";

/**
 * Creates a recurrence for an event.
 *
 * @param {Object} options
 * @param {string} options.event_id - The UUID of the event.
 * @param {string} options.frequency - The recurrence frequency (e.g., "once", "daily").
 * @param {string | undefined} options.end_date - The end date of the recurrence (optional).
 * @returns {Promise<Recurrence>} - The created recurrence data or an error.
 */
export async function createRecurrenceUtil({
    event_id,
    frequency,
    end_date,
}: {
    event_id: string;
    frequency: string;
    end_date?: Date | string;
}): Promise<Recurrence> {
    // Insert a new recurrence into the database
    const { data, error } = await supabase
        .from("recurrence")
        .insert([{ event_id, frequency, end_date }])
        .select()
        .returns<Recurrence[]>();

    if (error) {
        console.error("Error creating recurrence:", error.message);
        throw new Error("Failed to create recurrence");
    }

    if (!data || data.length === 0) {
        throw new Error("No data returned when creating recurrence");
    }

    return data[0]; // Return the created recurrence
}

/**
 * Updates a recurrence.
 *
 * @param {Object} options
 * @param {string} options.recurrence_id - The UUID of the recurrence.
 * @param {string} options.frequency - The recurrence frequency (e.g., "once", "daily").
 * @param {string} options.end_date - The end date of the recurrence.
 * @returns {Promise<Recurrence>} - The updated recurrence data or an error.
 */
export async function updateRecurrenceUtil({
    recurrence_id,
    frequency,
    end_date,
}: {
    recurrence_id: string;
    frequency: string;
    end_date: Date | string;
}): Promise<Recurrence> {
    // Update a recurrence in the database
    const { data, error } = await supabase
        .from("recurrence")
        .update({ frequency, end_date })
        .eq("id", recurrence_id)
        .select()
        .returns<Recurrence[]>();

    if (error) {
        console.error("Error updating recurrence:", error.message);
        throw new Error("Failed to update recurrence");
    }

    if (!data || data.length === 0) {
        throw new Error("No data returned when updating recurrence");
    }

    return data[0]; // Return the updated recurrence
}
