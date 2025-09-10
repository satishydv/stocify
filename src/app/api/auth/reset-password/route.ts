import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    // 1. Basic Input Validation
    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // 2. Password strength validation
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // 3. Check if reset token exists and is valid
    const [resetTokens] = await pool.execute(
      'SELECT email, expires_at FROM password_resets WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    const resetToken = resetTokens[0] as any;

    if (!resetToken) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 5. Update user password
    const [result] = await pool.execute(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [hashedPassword, resetToken.email]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Failed to update password' },
        { status: 500 }
      );
    }

    // 6. Delete used reset token
    await pool.execute(
      'DELETE FROM password_resets WHERE token = ?',
      [token]
    );

    // 7. Delete all user sessions (force re-login)
    await pool.execute(
      'DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = ?)',
      [resetToken.email]
    );

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
