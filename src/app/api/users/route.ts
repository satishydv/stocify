import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, address, role_id } = body

    // Validate required fields
    if (!name || !email || !password || !role_id) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const connection = await pool.getConnection()

    try {
      // Check if email already exists
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      )

      if ((existingUser as any[]).length > 0) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }

      // Check if role exists
      const [roleExists] = await connection.execute(
        'SELECT id FROM roles WHERE id = ?',
        [role_id]
      )

      if ((roleExists as any[]).length === 0) {
        return NextResponse.json(
          { error: 'Invalid role selected' },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Insert user
      const [result] = await connection.execute(
        `INSERT INTO users (name, email, password_hash, address, role_id, is_verified) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, address || '', role_id, 1]
      )

      const userId = (result as any).insertId

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        userId: userId
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const connection = await pool.getConnection()
    
    try {
      // Get all users with their role information
      const [users] = await connection.execute(
        `SELECT u.id, u.name, u.email, u.address, u.is_verified, u.created_at, u.updated_at,
                r.id as role_id, r.name as role_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         ORDER BY u.created_at DESC`
      )

      // Transform the data to match the frontend format
      const transformedUsers = (users as any[]).map(user => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role_name?.toLowerCase() || 'user',
        status: user.is_verified ? 'active' : 'inactive',
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }))

      return NextResponse.json({
        success: true,
        users: transformedUsers
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
