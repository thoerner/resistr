-- Resistr Organizing Tool Database Schema
-- This file contains the complete database schema for the protest organizing tool

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'public' CHECK (role IN ('public', 'verified', 'admin')),
  encrypted_contact TEXT, -- Optional Signal handle or encrypted contact
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location VARCHAR(500),
  location_coords POINT, -- For map integration
  what_to_bring TEXT[],
  flyer_url TEXT,
  qr_code_url TEXT,
  purge_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RSVPs table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  role VARCHAR(50) NOT NULL,
  anonymous_name VARCHAR(100), -- Optional display name
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('need', 'have')),
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  claimed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  skill_tags TEXT[] NOT NULL,
  contact_method VARCHAR(100),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_user_id ON rsvps(user_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_event_id ON resources(event_id);
CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_skills_skill_tags ON skills USING GIN(skill_tags);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Events policies
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Verified users can create events" ON events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('verified', 'admin')
        )
    );

CREATE POLICY "Event creators can update their events" ON events
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Admins can update any event" ON events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete events" ON events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RSVPs policies
CREATE POLICY "Anyone can view RSVPs" ON rsvps
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create RSVPs" ON rsvps
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own RSVPs" ON rsvps
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own RSVPs" ON rsvps
    FOR DELETE USING (user_id = auth.uid());

-- Resources policies
CREATE POLICY "Anyone can view resources" ON resources
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create resources" ON resources
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Resource creators can update their resources" ON resources
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can update any resource" ON resources
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Skills policies
CREATE POLICY "Public skills are visible to everyone" ON skills
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own skills" ON skills
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all skills" ON skills
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can create their own skills" ON skills
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own skills" ON skills
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own skills" ON skills
    FOR DELETE USING (user_id = auth.uid());

-- Auto-purge function for events
CREATE OR REPLACE FUNCTION auto_purge_events()
RETURNS void AS $$
BEGIN
    -- Delete events that have passed their purge date
    DELETE FROM events 
    WHERE purge_at IS NOT NULL AND purge_at < NOW();
    
    -- Delete events older than 14 days if no purge_at is set
    DELETE FROM events 
    WHERE purge_at IS NULL AND created_at < NOW() - INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql;

-- Create a function to manually purge all data (admin only)
CREATE OR REPLACE FUNCTION manual_purge_all_data()
RETURNS void AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can purge all data';
    END IF;
    
    -- Delete all data in correct order (respecting foreign keys)
    DELETE FROM rsvps;
    DELETE FROM resources;
    DELETE FROM skills;
    DELETE FROM events;
    DELETE FROM users WHERE role != 'admin'; -- Keep admin users
END;
$$ LANGUAGE plpgsql;

-- Insert default admin user (you'll need to replace with actual admin email)
-- This should be done after setting up Supabase Auth
-- INSERT INTO users (email, role) VALUES ('admin@example.com', 'admin');
