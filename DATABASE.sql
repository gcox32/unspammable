-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for common statuses
CREATE TYPE gender_type AS ENUM ('Male', 'Female');
CREATE TYPE experience_level_type AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');
CREATE TYPE completion_status_type AS ENUM ('Completed', 'Skipped', 'In Progress', 'Failed');
CREATE TYPE unit_system_type AS ENUM ('Metric', 'Imperial');

-- Base tables
CREATE TABLE exercises (
    exercise_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    video_url VARCHAR(255),
    category VARCHAR(50),
    equipment TEXT[], -- PostgreSQL array type for equipment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercise_measures (
    measure_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workout_part_templates (
    part_template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workout_part_template_exercises (
    part_template_id UUID REFERENCES workout_part_templates(part_template_id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    custom_measures JSONB, -- Store custom measure overrides as JSON
    PRIMARY KEY (part_template_id, exercise_id)
);

CREATE TABLE workout_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workout_template_parts (
    template_id UUID REFERENCES workout_templates(template_id) ON DELETE CASCADE,
    part_template_id UUID REFERENCES workout_part_templates(part_template_id) ON DELETE CASCADE,
    sequence_order INTEGER NOT NULL,
    PRIMARY KEY (template_id, part_template_id)
);

CREATE TABLE athletes (
    athlete_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    crm_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL UNIQUE REFERENCES athletes(athlete_id) ON DELETE CASCADE,
    age INTEGER,
    gender gender_type,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,1),
    goals TEXT,
    experience_level experience_level_type,
    resting_heart_rate INTEGER,
    preferred_units unit_system_type DEFAULT 'Metric',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workouts (
    workout_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES workout_templates(template_id),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workout_athletes (
    workout_id UUID REFERENCES workouts(workout_id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES athletes(athlete_id) ON DELETE CASCADE,
    PRIMARY KEY (workout_id, athlete_id)
);

CREATE TABLE workout_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID NOT NULL REFERENCES workouts(workout_id),
    athlete_id UUID NOT NULL REFERENCES athletes(athlete_id),
    completion_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workout_part_logs (
    part_log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_id UUID NOT NULL REFERENCES workout_logs(log_id) ON DELETE CASCADE,
    part_template_id UUID NOT NULL REFERENCES workout_part_templates(part_template_id),
    status completion_status_type NOT NULL DEFAULT 'In Progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercise_logs (
    exercise_log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_log_id UUID NOT NULL REFERENCES workout_part_logs(part_log_id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(exercise_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercise_measure_logs (
    measure_log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_log_id UUID NOT NULL REFERENCES exercise_logs(exercise_log_id) ON DELETE CASCADE,
    measure_id UUID NOT NULL REFERENCES exercise_measures(measure_id),
    actual_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tracking_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(athlete_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tracking_metric_entries (
    entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_id UUID NOT NULL REFERENCES tracking_metrics(metric_id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    notes TEXT,
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_workout_templates_name ON workout_templates(name);
CREATE INDEX idx_athletes_email ON athletes(email);
CREATE INDEX idx_workouts_date ON workouts(scheduled_date);
CREATE INDEX idx_workout_logs_completion ON workout_logs(completion_date);
CREATE INDEX idx_tracking_metrics_type ON tracking_metrics(type);
CREATE INDEX idx_tracking_entries_date ON tracking_metric_entries(date);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- (Repeat for other tables with updated_at columns)
