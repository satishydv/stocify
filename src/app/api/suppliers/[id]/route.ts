import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: supplierId } = await params;
  const { name, email, phone, companyLocation, gstin, category, website, status } = await request.json();

  if (!supplierId) {
    return NextResponse.json({ error: 'Supplier ID is required' }, { status: 400 });
  }

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

    // Check for duplicate email (excluding current supplier)
    const [existingSupplier] = await connection.execute(
      `SELECT id FROM suppliers WHERE email = ? AND id != ?`,
      [email, supplierId]
    );
    if ((existingSupplier as any[]).length > 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Supplier with this email already exists' }, { status: 409 });
    }

    // Update supplier
    await connection.execute(
      `UPDATE suppliers SET 
        name = ?, 
        email = ?, 
        phone = ?, 
        street = ?, 
        city = ?, 
        state = ?, 
        zip = ?, 
        country = ?, 
        gstin = ?, 
        category = ?, 
        website = ?, 
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
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
        status || 'active',
        supplierId
      ]
    );

    await connection.commit();
    return NextResponse.json({ success: true, message: 'Supplier updated successfully' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error updating supplier:', error);
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: supplierId } = await params;

  if (!supplierId) {
    return NextResponse.json({ error: 'Supplier ID is required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check if supplier exists
    const [supplier] = await connection.execute(
      `SELECT name FROM suppliers WHERE id = ?`,
      [supplierId]
    );

    if ((supplier as any[]).length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    // TODO: Add check for products associated with this supplier
    // For now, we'll allow deletion, but you might want to add:
    // const [productCount] = await connection.execute(
    //   `SELECT COUNT(*) as count FROM products WHERE supplier_id = ?`,
    //   [supplierId]
    // );
    // if (productCount[0].count > 0) {
    //   return NextResponse.json({ error: 'Cannot delete supplier with associated products' }, { status: 400 });
    // }

    // Delete supplier
    await connection.execute(
      `DELETE FROM suppliers WHERE id = ?`,
      [supplierId]
    );

    await connection.commit();
    return NextResponse.json({ success: true, message: 'Supplier deleted successfully' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error deleting supplier:', error);
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
