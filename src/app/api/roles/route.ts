import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, permissions } = body

    // Validate required fields
    if (!name || !permissions) {
      return NextResponse.json(
        { error: 'Role name and permissions are required' },
        { status: 400 }
      )
    }

    // Start a transaction
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // Insert role
      const [roleResult] = await connection.execute(
        'INSERT INTO roles (name, description) VALUES (?, ?)',
        [name, `Role: ${name}`]
      )

      const roleId = (roleResult as any).insertId

      // Insert permissions for each module
      const moduleNames = [
        'dashboard', 'products', 'users', 'orders', 'stocks', 
        'sales', 'reports', 'suppliers', 'categories'
      ]

      for (const module of moduleNames) {
        const modulePermissions = permissions[module]
        if (modulePermissions) {
          await connection.execute(
            `INSERT INTO role_permissions 
             (role_id, module_name, can_create, can_read, can_update, can_delete) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              roleId,
              module,
              modulePermissions.create || false,
              modulePermissions.read || false,
              modulePermissions.update || false,
              modulePermissions.delete || false
            ]
          )
        }
      }

      // Commit transaction
      await connection.commit()

      return NextResponse.json({
        success: true,
        message: 'Role created successfully',
        roleId: roleId
      })

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const connection = await pool.getConnection()
    
    try {
      // Get all roles with their permissions
      const [roles] = await connection.execute(
        `SELECT r.id, r.name, r.description, r.created_at, r.updated_at
         FROM roles r
         ORDER BY r.created_at DESC`
      )

      // Get permissions for each role
      const [permissions] = await connection.execute(
        `SELECT role_id, module_name, can_create, can_read, can_update, can_delete
         FROM role_permissions
         ORDER BY role_id, module_name`
      )

      // Combine roles with their permissions
      const rolesWithPermissions = (roles as any[]).map(role => {
        const rolePermissions = (permissions as any[]).filter(p => p.role_id === role.id)
        
        const permissionsObj: any = {}
        rolePermissions.forEach(perm => {
          permissionsObj[perm.module_name] = {
            create: perm.can_create,
            read: perm.can_read,
            update: perm.can_update,
            delete: perm.can_delete
          }
        })

        return {
          id: role.id.toString(),
          name: role.name,
          type: role.name,
          permissions: permissionsObj,
          createdAt: role.created_at,
          updatedAt: role.updated_at
        }
      })

      return NextResponse.json({
        success: true,
        roles: rolesWithPermissions
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    )
  }
}
