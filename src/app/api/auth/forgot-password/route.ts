import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // 1. Basic Input Validation
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // 2. Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    const user = users[0] as any;

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return NextResponse.json(
        { message: 'If the email exists, a reset link has been sent' },
        { status: 200 }
      );
    }

    // 3. Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // 4. Store reset token in database
    await pool.execute(
      'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
      [email, resetToken, expiresAt]
    );

    // 5. TODO: Send email with reset link
    // For now, we'll just return the token (remove this in production)
    console.log(`Reset token for ${email}: ${resetToken}`);

    return NextResponse.json(
      { 
        message: 'If the email exists, a reset link has been sent',
        // Remove this in production - only for development
        resetToken: resetToken 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
