import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest, createAuthResponse } from '@/lib/middleware/auth';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // 1. Get token from request
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return createAuthResponse('No token provided', 401);
    }

    // 2. Verify token
    const user = verifyToken(token);
    
    if (!user) {
      return createAuthResponse('Invalid or expired token', 401);
    }

    // 3. Get fresh user data from database
    const [users] = await pool.execute(
      'SELECT id, email, first_name, last_name, is_verified, created_at FROM users WHERE id = ?',
      [user.userId]
    );

    const userData = users[0] as any;

    if (!userData) {
      return createAuthResponse('User not found', 404);
    }

    return NextResponse.json({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        isVerified: userData.is_verified,
        createdAt: userData.created_at
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
