import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    // 1. Basic Input Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 3. Password strength validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Insert User into Database
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, first_name, last_name, is_verified) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, 1] // is_verified = 1 (no email verification for now)
    );

    if (result.affectedRows === 1) {
      return NextResponse.json(
        { message: 'User registered successfully' },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: 'Failed to register user' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
