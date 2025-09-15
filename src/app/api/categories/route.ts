import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.execute(`
      SELECT 
        id,
        name,
        code,
        status,
        created_at as createdAt,
        updated_at as updatedAt
      FROM categories 
      ORDER BY created_at DESC
    `);

    const categories = rows as any[];

    return NextResponse.json({ categories });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: NextRequest) {
  const { name, code, status } = await request.json();

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

    // Check for duplicate name
    const [existingName] = await connection.execute(
      `SELECT id FROM categories WHERE name = ?`,
      [name.trim()]
    );
    if ((existingName as any[]).length > 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
    }

    // Check for duplicate code
    const [existingCode] = await connection.execute(
      `SELECT id FROM categories WHERE code = ?`,
      [code.trim().toUpperCase()]
    );
    if ((existingCode as any[]).length > 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Category with this code already exists' }, { status: 409 });
    }

    // Insert new category
    const [result] = await connection.execute(
      `INSERT INTO categories (name, code, status) VALUES (?, ?, ?)`,
      [
        name.trim(),
        code.trim().toUpperCase(),
        status || 'active'
      ]
    );

    await connection.commit();

    // Fetch the created category using name (since we know it's unique)
    const [newCategory] = await connection.execute(
      `SELECT 
        id,
        name,
        code,
        status,
        created_at as createdAt,
        updated_at as updatedAt
      FROM categories WHERE name = ?`,
      [name.trim()]
    );

    const category = (newCategory as any[])[0];

    return NextResponse.json({ 
      success: true, 
      message: 'Category created successfully',
      category 
    }, { status: 201 });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
