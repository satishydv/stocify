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
        email,
        phone,
        JSON_OBJECT(
          'street', street,
          'city', city,
          'state', state,
          'zip', zip,
          'country', country
        ) as companyLocation,
        gstin,
        category,
        website,
        status,
        created_at as createdAt,
        updated_at as updatedAt
      FROM suppliers 
      ORDER BY created_at DESC
    `);

    // Transform the data to match frontend expectations
    const suppliers = (rows as any[]).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      companyLocation: typeof row.companyLocation === 'string' 
        ? JSON.parse(row.companyLocation) 
        : row.companyLocation,
      gstin: row.gstin,
      category: row.category,
      website: row.website,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));

    return NextResponse.json({ suppliers });

  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: NextRequest) {
  const { name, email, phone, companyLocation, gstin, category, website, status } = await request.json();

  // Validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 });
  }
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }
  if (!companyLocation || typeof companyLocation !== 'object') {
    return NextResponse.json({ error: 'Company location is required' }, { status: 400 });
  }
  if (!companyLocation.street || !companyLocation.city || !companyLocation.state || !companyLocation.zip || !companyLocation.country) {
    return NextResponse.json({ error: 'All location fields are required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check for duplicate email
    const [existingSupplier] = await connection.execute(
      `SELECT id FROM suppliers WHERE email = ?`,
      [email]
    );
    if ((existingSupplier as any[]).length > 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Supplier with this email already exists' }, { status: 409 });
    }

    // Insert new supplier
    const [result] = await connection.execute(
      `INSERT INTO suppliers (
        name, email, phone, street, city, state, zip, country, 
        gstin, category, website, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        companyLocation.street,
        companyLocation.city,
        companyLocation.state,
        companyLocation.zip,
        companyLocation.country,
        gstin || null,
        category || 'Other',
        website || null,
        status || 'active'
      ]
    );

    await connection.commit();

    // Fetch the created supplier using email (since we know it's unique)
    const [newSupplier] = await connection.execute(
      `SELECT 
        id,
        name,
        email,
        phone,
        JSON_OBJECT(
          'street', street,
          'city', city,
          'state', state,
          'zip', zip,
          'country', country
        ) as companyLocation,
        gstin,
        category,
        website,
        status,
        created_at as createdAt,
        updated_at as updatedAt
      FROM suppliers WHERE email = ?`,
      [email]
    );

    const supplier = (newSupplier as any[])[0];
    if (supplier && supplier.companyLocation) {
      supplier.companyLocation = typeof supplier.companyLocation === 'string' 
        ? JSON.parse(supplier.companyLocation) 
        : supplier.companyLocation;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supplier created successfully',
      supplier 
    }, { status: 201 });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error creating supplier:', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
