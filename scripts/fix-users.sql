-- SQL script to fix existing users and ensure they have proper records
-- Run this in your Supabase SQL editor

-- First, let's see what users exist in auth vs database
SELECT 'Auth Users' as source, count(*) as count FROM auth.users
UNION ALL
SELECT 'Database Users' as source, count(*) as count FROM users;

-- Create a function to sync a specific user
CREATE OR REPLACE FUNCTION sync_user(user_id UUID, user_email TEXT, user_role TEXT DEFAULT 'admin')
RETURNS TEXT AS $$
DECLARE
    existing_user users%ROWTYPE;
BEGIN
    -- Check if user exists in database
    SELECT * INTO existing_user FROM users WHERE id = user_id;
    
    IF existing_user IS NULL THEN
        -- User doesn't exist, create them
        INSERT INTO users (id, email, role, created_at, updated_at)
        VALUES (user_id, user_email, user_role, NOW(), NOW());
        
        RETURN 'Created user: ' || user_email;
    ELSE
        -- User exists, update if needed
        IF existing_user.email != user_email OR existing_user.role != user_role THEN
            UPDATE users 
            SET email = user_email, role = user_role, updated_at = NOW()
            WHERE id = user_id;
            
            RETURN 'Updated user: ' || user_email;
        ELSE
            RETURN 'User already up to date: ' || user_email;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Sync all auth users to database
DO $$
DECLARE
    auth_user RECORD;
    result TEXT;
BEGIN
    -- Loop through all auth users and sync them
    FOR auth_user IN 
        SELECT id, email FROM auth.users
    LOOP
        SELECT sync_user(auth_user.id, auth_user.email, 'admin') INTO result;
        RAISE NOTICE '%', result;
    END LOOP;
END $$;

-- Show final results
SELECT 'Final Users in Database:' as status;
SELECT id, email, role, created_at FROM users ORDER BY created_at;

-- Clean up the function
DROP FUNCTION sync_user(UUID, TEXT, TEXT);