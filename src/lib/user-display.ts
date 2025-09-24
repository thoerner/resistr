/**
 * Utility functions for displaying user names consistently throughout the app
 */

export interface UserDisplayInfo {
  id: string
  username?: string | null
  email?: string
  anonymous_name?: string | null
}

export interface DisplayOptions {
  fallbackToEmail?: boolean
  showAnonymous?: boolean
  maxLength?: number
}

/**
 * Get the display name for a user with fallback hierarchy:
 * 1. anonymous_name (if provided and showAnonymous is true)
 * 2. username (if set)
 * 3. email (if fallbackToEmail is true)
 * 4. "Anonymous" (if showAnonymous is true)
 * 5. "Unknown User"
 */
export function getUserDisplayName(
  user: UserDisplayInfo,
  options: DisplayOptions = {}
): string {
  const {
    fallbackToEmail = true,
    showAnonymous = true,
    maxLength = 50
  } = options

  let displayName: string

  // Priority 1: anonymous_name (for RSVPs, etc.)
  if (showAnonymous && user.anonymous_name) {
    displayName = user.anonymous_name
  }
  // Priority 2: username (global pseudonym)
  else if (user.username) {
    displayName = user.username
  }
  // Priority 3: email (fallback)
  else if (fallbackToEmail && user.email) {
    // For privacy, show only the part before @ for email fallback
    displayName = user.email.split('@')[0] + ' (email)'
  }
  // Priority 4: Anonymous
  else if (showAnonymous) {
    displayName = 'Anonymous'
  }
  // Priority 5: Unknown
  else {
    displayName = 'Unknown User'
  }

  // Truncate if too long
  if (displayName.length > maxLength) {
    return displayName.substring(0, maxLength - 3) + '...'
  }

  return displayName
}

/**
 * Get the display name for admin contexts where you want to see the full identity
 */
export function getAdminDisplayName(user: UserDisplayInfo): string {
  const parts: string[] = []

  // Always include email for admin
  if (user.email) {
    parts.push(user.email)
  }

  // Add username if different from email
  if (user.username && user.username !== user.email.split('@')[0]) {
    parts.push(`@${user.username}`)
  }

  // Add anonymous name if present (for RSVPs)
  if (user.anonymous_name) {
    parts.push(`"${user.anonymous_name}"`)
  }

  return parts.join(' • ') || 'Unknown User'
}

/**
 * Get a short display name (for badges, small spaces)
 */
export function getShortDisplayName(user: UserDisplayInfo): string {
  if (user.username) {
    return `@${user.username}`
  }
  
  if (user.anonymous_name) {
    return user.anonymous_name
  }
  
  if (user.email) {
    const emailPart = user.email.split('@')[0]
    return emailPart.length > 8 ? emailPart.substring(0, 8) + '...' : emailPart
  }
  
  return 'Anon'
}

/**
 * Check if a user has a custom display identity (not just email)
 */
export function hasCustomIdentity(user: UserDisplayInfo): boolean {
  return !!(user.username || user.anonymous_name)
}

/**
 * Get user initials for avatar display
 */
export function getUserInitials(user: UserDisplayInfo): string {
  const displayName = getUserDisplayName(user, { fallbackToEmail: true, showAnonymous: false })
  
  // Remove special characters and split into words
  const words = displayName.replace(/[^a-zA-Z\s]/g, '').split(/\s+/)
  
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  } else if (words[0] && words[0].length >= 2) {
    return words[0].substring(0, 2).toUpperCase()
  } else {
    return 'U'
  }
}