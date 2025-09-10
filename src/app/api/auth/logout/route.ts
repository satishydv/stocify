import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token to get user info
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Delete session from database
      await pool.execute(
        'DELETE FROM sessions WHERE user_id = ? AND token = ?',
        [decoded.userId, token]
      );

      return NextResponse.json(
        { message: 'Logout successful' },
        { status: 200 }
      );
    } catch (jwtError) {
      // Token is invalid or expired, but we still return success
      // since the client should discard the token anyway
      return NextResponse.json(
        { message: 'Logout successful' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
