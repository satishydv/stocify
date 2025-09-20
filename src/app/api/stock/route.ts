import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM stocks ORDER BY category ASC'
    )
    
    // Map database fields to frontend format
    const mappedStocks = (rows as any[]).map(row => ({
      id: row.id,
      sku: row.sku,
      productName: row.product_name,
      category: row.category,
      quantityAvailable: row.quantity_available,
      minimumStockLevel: row.minimum_stock_level,
      maximumStockLevel: row.maximum_stock_level,
      status: row.status,
      unitCost: row.unit_cost,
      supplier: row.supplier,
      lastUpdated: row.last_updated,
      createdAt: row.created_at
    }))
    
    return NextResponse.json({ stock: mappedStocks })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['sku', 'productName', 'category', 'quantityAvailable', 'minimumStockLevel', 'maximumStockLevel', 'unitCost', 'supplier']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if stock record already exists for this SKU
    const [existingStock] = await pool.execute(
      'SELECT * FROM stocks WHERE sku = ?',
      [body.sku]
    )

    if (existingStock.length > 0) {
      return NextResponse.json(
        { error: 'Stock record already exists for this SKU' },
        { status: 400 }
      )
    }

    // Insert new stock record
    const [result] = await pool.execute(
      `INSERT INTO stocks (sku, product_name, category, quantity_available, minimum_stock_level, maximum_stock_level, status, unit_cost, supplier) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.sku,
        body.productName,
        body.category,
        parseInt(body.quantityAvailable),
        parseInt(body.minimumStockLevel),
        parseInt(body.maximumStockLevel),
        body.status || 'active',
        parseFloat(body.unitCost),
        body.supplier
      ]
    )

    // Fetch the created stock record
    const [rows] = await pool.execute(
      'SELECT * FROM stocks WHERE id = ?',
      [(result as any).insertId]
    )

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

    return NextResponse.json({ stock: mappedStock }, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create stock record' },
      { status: 500 }
    )
  }
}
