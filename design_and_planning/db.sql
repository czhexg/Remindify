-- for use with supabase.io
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.events (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    user_id uuid NOT NULL,
    category_id uuid NULL,
    name character varying(255) NOT NULL,
    start_date timestamp WITH time zone NOT NULL,
    notes text NULL,
    created_at timestamp WITH time zone NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc' :: text),
    updated_at timestamp WITH time zone NULL DEFAULT (NOW() AT TIME ZONE 'utc' :: text),
    CONSTRAINT event_pkey PRIMARY KEY (id),
    CONSTRAINT event_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT event_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE trigger handle_updated_at BEFORE
UPDATE
    ON EVENTS FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime ('updated_at');

CREATE TABLE public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    event_id uuid NOT NULL,
    reminder_date timestamp WITH time zone NOT NULL,
    channel character varying(50) NOT NULL,
    message text NULL,
    created_at timestamp WITH time zone NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc' :: text),
    updated_at timestamp WITH time zone NULL DEFAULT (NOW() AT TIME ZONE 'utc' :: text),
    CONSTRAINT notification_pkey PRIMARY KEY (id),
    CONSTRAINT notification_event_id_fkey FOREIGN KEY (event_id) REFERENCES EVENTS (id) ON DELETE CASCADE,
    CONSTRAINT notification_channel_check CHECK (
        (
            (channel) :: text = any (
                array [
          ('email'::character varying)::text,
          ('telegram'::character varying)::text
        ]
            )
        )
    )
) TABLESPACE pg_default;

CREATE trigger handle_updated_at BEFORE
UPDATE
    ON notifications FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime ('updated_at');

CREATE TABLE public.categories (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    name character varying(255) NOT NULL,
    description text NULL,
    CONSTRAINT category_pkey PRIMARY KEY (id),
    CONSTRAINT category_name_key UNIQUE (name)
) TABLESPACE pg_default;

CREATE TABLE public.recurrence (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    event_id uuid NOT NULL,
    frequency character varying(50) NOT NULL,
    end_date timestamp WITH time zone NULL,
    created_at timestamp WITH time zone NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc' :: text),
    updated_at timestamp WITH time zone NULL DEFAULT (NOW() AT TIME ZONE 'utc' :: text),
    CONSTRAINT recurrence_pkey PRIMARY KEY (id),
    CONSTRAINT recurrence_event_id_fkey FOREIGN KEY (event_id) REFERENCES EVENTS (id) ON DELETE CASCADE,
    CONSTRAINT recurrence_frequency_check CHECK (
        (
            (frequency) :: text = any (
                (
                    array [
            'once'::character varying,
            'daily'::character varying,
            'weekly'::character varying,
            'monthly'::character varying,
            'yearly'::character varying
          ]
                ) :: text []
            )
        )
    )
) TABLESPACE pg_default;

CREATE trigger handle_updated_at BEFORE
UPDATE
    ON recurrence FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime ('updated_at');