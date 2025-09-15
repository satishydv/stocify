import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roleId } = await params

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }

    const connection = await pool.getConnection()

    try {
      // Check if role exists
      const [existingRole] = await connection.execute(
        'SELECT id, name FROM roles WHERE id = ?',
        [roleId]
      )

      if ((existingRole as any[]).length === 0) {
        return NextResponse.json(
          { error: 'Role not found' },
          { status: 404 }
        )
      }

      // Check if role has users assigned to it
      const [usersWithRole] = await connection.execute(
        'SELECT COUNT(*) as userCount FROM users WHERE role_id = ?',
        [roleId]
      )

      const userCount = (usersWithRole as any[])[0]?.userCount || 0

      if (userCount > 0) {
        return NextResponse.json(
          { error: `Cannot delete role. ${userCount} user(s) are assigned to this role. Please reassign users first.` },
          { status: 400 }
        )
      }

      // Start transaction
      await connection.beginTransaction()

      try {
        // Delete role permissions first
        await connection.execute(
          'DELETE FROM role_permissions WHERE role_id = ?',
          [roleId]
        )

        // Delete the role
        await connection.execute(
          'DELETE FROM roles WHERE id = ?',
          [roleId]
        )

        // Commit transaction
        await connection.commit()

        return NextResponse.json({
          success: true,
          message: 'Role deleted successfully'
        })

      } catch (error) {
        // Rollback transaction on error
        await connection.rollback()
        throw error
      }

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error deleting role:', error)
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roleId } = await params
    const body = await request.json()
    const { name, permissions } = body

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!name || !permissions) {
      return NextResponse.json(
        { error: 'Role name and permissions are required' },
        { status: 400 }
      )
    }

    const connection = await pool.getConnection()

    try {
      // Check if role exists
      const [existingRole] = await connection.execute(
        'SELECT id FROM roles WHERE id = ?',
        [roleId]
      )

      if ((existingRole as any[]).length === 0) {
        return NextResponse.json(
          { error: 'Role not found' },
          { status: 404 }
        )
      }

      // Start transaction
      await connection.beginTransaction()

      try {
        // Update role name
        await connection.execute(
          'UPDATE roles SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [name, roleId]
        )

        // Update permissions for each module
        const moduleNames = [
          'dashboard', 'products', 'users', 'orders', 'stocks', 
          'sales', 'reports', 'suppliers', 'categories'
        ]

        for (const module of moduleNames) {
          const modulePermissions = permissions[module]
          if (modulePermissions) {
            await connection.execute(
              `UPDATE role_permissions 
               SET can_create = ?, can_read = ?, can_update = ?, can_delete = ?, updated_at = CURRENT_TIMESTAMP
               WHERE role_id = ? AND module_name = ?`,
              [
                modulePermissions.create || false,
                modulePermissions.read || false,
                modulePermissions.update || false,
                modulePermissions.delete || false,
                roleId,
                module
              ]
            )
          }
        }

        // Commit transaction
        await connection.commit()

        return NextResponse.json({
          success: true,
          message: 'Role updated successfully'
        })

      } catch (error) {
        // Rollback transaction on error
        await connection.rollback()
        throw error
      }

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error updating role:', error)
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    )
  }
}
