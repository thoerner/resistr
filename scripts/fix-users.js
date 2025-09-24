#!/usr/bin/env node

/**
 * Script to fix existing users and ensure they have proper records
 * This will sync Supabase Auth users with the users table
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixUsers() {
  console.log('🔧 Starting user sync process...')
  
  try {
    // Get all users from Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError)
      return
    }
    
    console.log(`📊 Found ${authUsers.users.length} users in Supabase Auth`)
    
    // Get all users from users table
    const { data: dbUsers, error: dbError } = await supabase
      .from('users')
      .select('*')
    
    if (dbError) {
      console.error('❌ Error fetching database users:', dbError)
      return
    }
    
    console.log(`📊 Found ${dbUsers.length} users in database`)
    
    // Create a map of existing database users
    const dbUserMap = new Map(dbUsers.map(user => [user.id, user]))
    
    let created = 0
    let updated = 0
    let skipped = 0
    
    for (const authUser of authUsers.users) {
      const userId = authUser.id
      const userEmail = authUser.email
      const existingUser = dbUserMap.get(userId)
      
      if (!existingUser) {
        // User doesn't exist in database, create them
        console.log(`➕ Creating user: ${userEmail} (${userId})`)
        
        const { data, error } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: userEmail,
            role: 'admin', // Set to admin since you're running this script
            created_at: authUser.created_at,
            updated_at: new Date().toISOString()
          })
          .select()
        
        if (error) {
          console.error(`❌ Error creating user ${userEmail}:`, error)
        } else {
          console.log(`✅ Created user: ${userEmail}`)
          created++
        }
      } else {
        // User exists, check if we need to update anything
        const needsUpdate = 
          existingUser.email !== userEmail ||
          !existingUser.role ||
          existingUser.role === 'public'
        
        if (needsUpdate) {
          console.log(`🔄 Updating user: ${userEmail} (${userId})`)
          
          const updates = {
            email: userEmail,
            updated_at: new Date().toISOString()
          }
          
          // If role is missing or public, set to admin (since you're running this)
          if (!existingUser.role || existingUser.role === 'public') {
            updates.role = 'admin'
          }
          
          const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
          
          if (error) {
            console.error(`❌ Error updating user ${userEmail}:`, error)
          } else {
            console.log(`✅ Updated user: ${userEmail}`)
            updated++
          }
        } else {
          console.log(`⏭️  Skipped user: ${userEmail} (already up to date)`)
          skipped++
        }
      }
    }
    
    console.log('\n📈 Summary:')
    console.log(`   Created: ${created} users`)
    console.log(`   Updated: ${updated} users`)
    console.log(`   Skipped: ${skipped} users`)
    console.log(`   Total: ${authUsers.users.length} users processed`)
    
    // Verify the fix
    console.log('\n🔍 Verifying fix...')
    const { data: finalUsers, error: verifyError } = await supabase
      .from('users')
      .select('id, email, role')
      .order('created_at')
    
    if (verifyError) {
      console.error('❌ Error verifying users:', verifyError)
    } else {
      console.log(`✅ Verification complete. Found ${finalUsers.length} users in database:`)
      finalUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the script
fixUsers()
  .then(() => {
    console.log('\n🎉 User sync completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })