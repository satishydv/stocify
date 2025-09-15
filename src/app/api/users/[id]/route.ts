import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const connection = await pool.getConnection()

    try {
      // Check if user exists
      const [existingUser] = await connection.execute(
        'SELECT id, name FROM users WHERE id = ?',
        [userId]
      )

      if ((existingUser as any[]).length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Delete the user
      await connection.execute(
        'DELETE FROM users WHERE id = ?',
        [userId]
      )

      return NextResponse.json({
        success: true,
        message: 'User deleted successfully'
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    const body = await request.json()
    const { name, email, address, role_id } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!name || !email || !role_id) {
      return NextResponse.json(
        { error: 'Name, email, and role are required' },
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

    const connection = await pool.getConnection()

    try {
      // Check if user exists
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      )

      if ((existingUser as any[]).length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Check if email is already taken by another user
      const [emailCheck] = await connection.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      )

      if ((emailCheck as any[]).length > 0) {
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

      // Update the user
      await connection.execute(
        `UPDATE users 
         SET name = ?, email = ?, address = ?, role_id = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [name, email, address || '', role_id, userId]
      )

      return NextResponse.json({
        success: true,
        message: 'User updated successfully'
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
