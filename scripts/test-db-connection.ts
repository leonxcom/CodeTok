import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

async function testConnection() {
  try {
    // Get database connection string
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    console.log(
      'Using connection string:',
      connectionString.replace(/:[^:]*@/, ':****@'),
    )

    // Connect directly with Neon
    const sql = neon(connectionString)
    const result = await sql`SELECT NOW() as current_time`

    console.log('✅ Database connection successful!')
    console.log('Current server time:', result[0]?.current_time || 'Unknown')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error(error)

    console.log('\n🔍 Troubleshooting tips:')
    console.log('1. Check if your DATABASE_URL is correct in .env.local')
    console.log('2. Verify that your Neon database is running and accessible')
    console.log("3. Make sure your IP is allowed in Neon's access controls")
    console.log('4. Check your username and password in the connection string')

    return false
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Unexpected error:', error)
    process.exit(1)
  })
