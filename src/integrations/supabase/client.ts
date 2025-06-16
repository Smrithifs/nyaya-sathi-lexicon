
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://xxecwllzdsjqemgsylqa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4ZWN3bGx6ZHNqcWVtZ3N5bHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDAwNDQsImV4cCI6MjA2NTU3NjA0NH0.ruLzev0_Yn6xbMdXy6q05FfZt6Gu4cSiM16GHnFOanE'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
