export type BaseEvent = {
    id: string;
    user_id: string;
    category_id: string | null;
    name: string;
    start_date: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
};

export type Recurrence = {
    id: string;
    event_id: string | null;
    frequency: string;
    end_date?: string;
    created_at: string;
    updated_at: string;
};

export type Notification = {
    id: string;
    event_id: string;
    reminder_date: string;
    channel: string;
    message: string | null;
    created_at: string;
    updated_at: string;
};

export type Category = {
    id: string;
    name: string;
    description: string | null;
};

export type DueNotification = Notification & {
    event: BaseEvent & {
        category: Category;
        user: {
            id: string;
            email: string;
        };
        recurrence: Recurrence;
    };
};

export type Event = BaseEvent & {
    category: Category;
    notification: Notification;
    recurrence: Recurrence;
};

// data types for creating and updating events

export type EventData = {
    user_id: string;
    category_id: string | null;
    name: string;
    start_date: string;
    notes: string | null;
};

export type RecurrenceData = {
    frequency: string;
    end_date?: string;
};

export type NotificationData = {
    reminder_date: string;
    channel: string;
    message: string | null;
};
