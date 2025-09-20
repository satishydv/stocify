import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const [rows] = await pool.execute(
      'SELECT * FROM stocks WHERE id = ?',
      [id]
    )
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Stock record not found' },
        { status: 404 }
      )
    }

    // Map database fields to frontend format
    const mappedStock = {
      id: rows[0].id,
      sku: rows[0].sku,
      productName: rows[0].product_name,
      category: rows[0].category,
      quantityAvailable: rows[0].quantity_available,
      minimumStockLevel: rows[0].minimum_stock_level,
      maximumStockLevel: rows[0].maximum_stock_level,
      status: rows[0].status,
      unitCost: rows[0].unit_cost,
      supplier: rows[0].supplier,
      lastUpdated: rows[0].last_updated,
      createdAt: rows[0].created_at
    }

    return NextResponse.json({ stock: mappedStock })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock record' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Check if stock record exists
    const [existingStock] = await pool.execute(
      'SELECT * FROM stocks WHERE id = ?',
      [id]
    )
    
    if (existingStock.length === 0) {
      return NextResponse.json(
        { error: 'Stock record not found' },
        { status: 404 }
      )
    }

    // Update stock record
    const updateFields = []
    const updateValues = []
    
    if (body.sku) {
      updateFields.push('sku = ?')
      updateValues.push(body.sku)
    }
    if (body.productName) {
      updateFields.push('product_name = ?')
      updateValues.push(body.productName)
    }
    if (body.category) {
      updateFields.push('category = ?')
      updateValues.push(body.category)
    }
    if (body.quantityAvailable !== undefined) {
      updateFields.push('quantity_available = ?')
      updateValues.push(parseInt(body.quantityAvailable))
    }
    if (body.minimumStockLevel !== undefined) {
      updateFields.push('minimum_stock_level = ?')
      updateValues.push(parseInt(body.minimumStockLevel))
    }
    if (body.maximumStockLevel !== undefined) {
      updateFields.push('maximum_stock_level = ?')
      updateValues.push(parseInt(body.maximumStockLevel))
    }
    if (body.status) {
      updateFields.push('status = ?')
      updateValues.push(body.status)
    }
    if (body.unitCost !== undefined) {
      updateFields.push('unit_cost = ?')
      updateValues.push(parseFloat(body.unitCost))
    }
    if (body.supplier) {
      updateFields.push('supplier = ?')
      updateValues.push(body.supplier)
    }

    if (updateFields.length > 0) {
      updateValues.push(id)
      await pool.execute(
        `UPDATE stocks SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      )
    }

    // Fetch updated stock record
    const [updatedStock] = await pool.execute(
      'SELECT * FROM stocks WHERE id = ?',
      [id]
    )

    // Map database fields to frontend format
    const mappedStock = {
      id: updatedStock[0].id,
      sku: updatedStock[0].sku,
      productName: updatedStock[0].product_name,
      category: updatedStock[0].category,
      quantityAvailable: updatedStock[0].quantity_available,
      minimumStockLevel: updatedStock[0].minimum_stock_level,
      maximumStockLevel: updatedStock[0].maximum_stock_level,
      status: updatedStock[0].status,
      unitCost: updatedStock[0].unit_cost,
      supplier: updatedStock[0].supplier,
      lastUpdated: updatedStock[0].last_updated,
      createdAt: updatedStock[0].created_at
    }

    return NextResponse.json({ stock: mappedStock })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update stock record' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if stock record exists
    const [existingStock] = await pool.execute(
      'SELECT * FROM stocks WHERE id = ?',
      [id]
    )
    
    if (existingStock.length === 0) {
      return NextResponse.json(
        { error: 'Stock record not found' },
        { status: 404 }
      )
    }

    // Delete stock record
    await pool.execute(
      'DELETE FROM stocks WHERE id = ?',
      [id]
    )

    // Map database fields to frontend format
    const mappedStock = {
      id: existingStock[0].id,
      sku: existingStock[0].sku,
      productName: existingStock[0].product_name,
      category: existingStock[0].category,
      quantityAvailable: existingStock[0].quantity_available,
      minimumStockLevel: existingStock[0].minimum_stock_level,
      maximumStockLevel: existingStock[0].maximum_stock_level,
      status: existingStock[0].status,
      unitCost: existingStock[0].unit_cost,
      supplier: existingStock[0].supplier,
      lastUpdated: existingStock[0].last_updated,
      createdAt: existingStock[0].created_at
    }

    return NextResponse.json({ stock: mappedStock })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to delete stock record' },
      { status: 500 }
    )
  }
}
