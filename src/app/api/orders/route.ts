import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

// Helper function to add items to stock when order is fulfilled
async function addToStock(orderId: string, order: any) {
  try {
    // Check if stock record exists for this SKU
    const [existingStock] = await pool.execute(
      'SELECT * FROM stocks WHERE sku = ?',
      [order.sku]
    )

    if (existingStock.length > 0) {
      // Update existing stock
      await pool.execute(
        'UPDATE stocks SET quantity_available = quantity_available + ? WHERE sku = ?',
        [order.number_of_items, order.sku]
      )
    } else {
      // Create new stock record
      await pool.execute(
        `INSERT INTO stocks (sku, product_name, category, quantity_available, minimum_stock_level, maximum_stock_level, status, unit_cost, supplier, created_at, last_updated) 
         VALUES (?, ?, ?, ?, 0, 1000, 'active', 0, ?, NOW(), NOW())`,
        [order.sku, order.name, order.category, order.number_of_items, order.supplier]
      )
    }

    console.log(`Added ${order.number_of_items} items to stock for SKU: ${order.sku}`)
  } catch (error) {
    console.error('Error adding to stock:', error)
    throw error
  }
}

export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM orders ORDER BY order_date DESC'
    )
    
    // Map database fields to frontend format
    const mappedOrders = (rows as any[]).map(row => ({
      id: row.id,
      orderDate: row.order_date,
      name: row.name,
      sku: row.sku,
      supplier: row.supplier,
      category: row.category,
      numberOfItems: row.number_of_items,
      status: row.status,
      expectedDeliveryDate: row.expected_delivery_date,
      totalAmount: row.total_amount
    }))
    
    return NextResponse.json({ orders: mappedOrders })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'sku', 'supplier', 'category', 'numberOfItems', 'expectedDeliveryDate', 'totalAmount']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Generate unique order ID
    const orderId = `ORD${String(Date.now()).slice(-6)}`
    
    // Insert new order into database
    const [result] = await pool.execute(
      `INSERT INTO orders (id, order_date, name, sku, supplier, category, number_of_items, status, expected_delivery_date, total_amount) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        body.orderDate || new Date().toISOString().split('T')[0],
        body.name,
        body.sku,
        body.supplier,
        body.category,
        parseInt(body.numberOfItems),
        body.status || 'new',
        body.expectedDeliveryDate,
        parseFloat(body.totalAmount)
      ]
    )

    // Fetch the created order
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    )

    // Handle status 'fulfilled' - add to stock
    if (body.status === 'fulfilled') {
      await addToStock(orderId, rows[0])
    }

    // Map database fields to frontend format
    const mappedOrder = {
      id: rows[0].id,
      orderDate: rows[0].order_date,
      name: rows[0].name,
      sku: rows[0].sku,
      supplier: rows[0].supplier,
      category: rows[0].category,
      numberOfItems: rows[0].number_of_items,
      status: rows[0].status,
      expectedDeliveryDate: rows[0].expected_delivery_date,
      totalAmount: rows[0].total_amount
    }

    return NextResponse.json({ order: mappedOrder }, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
