import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: categoryId } = await params;
  const { name, code, status } = await request.json();

  if (!categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  // Validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }
  if (!code || typeof code !== 'string' || code.trim() === '') {
    return NextResponse.json({ error: 'Category code is required' }, { status: 400 });
  }
  if (!/^[A-Z0-9]+$/.test(code.trim())) {
    return NextResponse.json({ error: 'Category code must contain only uppercase letters and numbers' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check for duplicate name (excluding current category)
    const [existingName] = await connection.execute(
      `SELECT id FROM categories WHERE name = ? AND id != ?`,
      [name.trim(), categoryId]
    );
    if ((existingName as any[]).length > 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
    }

    // Check for duplicate code (excluding current category)
    const [existingCode] = await connection.execute(
      `SELECT id FROM categories WHERE code = ? AND id != ?`,
      [code.trim().toUpperCase(), categoryId]
    );
    if ((existingCode as any[]).length > 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Category with this code already exists' }, { status: 409 });
    }

    // Update category
    await connection.execute(
      `UPDATE categories SET 
        name = ?, 
        code = ?, 
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        name.trim(),
        code.trim().toUpperCase(),
        status || 'active',
        categoryId
      ]
    );

    await connection.commit();
    return NextResponse.json({ success: true, message: 'Category updated successfully' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: categoryId } = await params;

  if (!categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if category exists
    const [category] = await connection.execute(
      `SELECT name FROM categories WHERE id = ?`,
      [categoryId]
    );

    if ((category as any[]).length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // TODO: Add check for products associated with this category
    // For now, we'll allow deletion, but you might want to add:
    // const [productCount] = await connection.execute(
    //   `SELECT COUNT(*) as count FROM products WHERE category_id = ?`,
    //   [categoryId]
    // );
    // if (productCount[0].count > 0) {
    //   return NextResponse.json({ error: 'Cannot delete category with associated products' }, { status: 400 });
    // }

    // Delete category
    await connection.execute(
      `DELETE FROM categories WHERE id = ?`,
      [categoryId]
    );

    await connection.commit();
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
