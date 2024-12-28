CREATE TABLE User (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Event (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    category_id UUID,
    name VARCHAR(255) NOT NULL,
    datetime TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category (id)
);

CREATE TABLE Notification (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL,
    reminder_date TIMESTAMP NOT NULL,
    channel VARCHAR(50) CHECK (channel IN ('email', 'telegram')),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Event (id) ON DELETE CASCADE
);

CREATE TABLE Category (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE Recurrence (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL,
    frequency VARCHAR(50) CHECK (
        frequency IN ('daily', 'weekly', 'monthly', 'yearly')
    ),
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Event (id) ON DELETE CASCADE
);