import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  const fast2SmsKey = process.env.FAST2SMS_API_KEY;

  if (!databaseUrl) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  if (!fast2SmsKey) return NextResponse.json({ error: 'SMS service not configured' }, { status: 500 });

  const { phone } = await request.json();
  if (!phone || phone.length !== 10) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
  }

  const sql = neon(databaseUrl);
  
  try {
    // Check if farmer exists
    const users = await sql`SELECT id FROM users WHERE phone = ${'+91' + phone} AND role = 'FARMER'`;
    let userId = users.length > 0 ? users[0].id : null;

    if (!userId) {
      // Create a basic farmer account if they don't exist
      userId = `farmer-${Date.now()}`;
      await sql`
        INSERT INTO users (id, name, phone, role, avatar)
        VALUES (${userId}, 'Farmer', ${'+91' + phone}, 'FARMER', '👨‍🌾')
      `;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins

    // Save OTP
    await sql`UPDATE users SET otp = ${otp}, otp_expires_at = ${expiresAt} WHERE id = ${userId}`;

    // Send via Fast2SMS
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': fast2SmsKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: phone
      })
    });

    const data = await response.json();
    if (!data.return) {
      console.error('Fast2SMS Error:', data);
      return NextResponse.json({ error: 'Failed to send OTP via SMS. Check API key.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
