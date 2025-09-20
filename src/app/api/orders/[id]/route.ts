import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    )
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
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

    return NextResponse.json({ order: mappedOrder })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
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
    
    // Check if order exists
    const [existingOrder] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    )
    
    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Handle status change to 'fulfilled' - add to stock
    if (body.status === 'fulfilled' && existingOrder[0].status !== 'fulfilled') {
      await addToStock(id, existingOrder[0])
    }

    // Update order
    const updateFields = []
    const updateValues = []
    
    if (body.name) {
      updateFields.push('name = ?')
      updateValues.push(body.name)
    }
    if (body.sku) {
      updateFields.push('sku = ?')
      updateValues.push(body.sku)
    }
    if (body.supplier) {
      updateFields.push('supplier = ?')
      updateValues.push(body.supplier)
    }
    if (body.category) {
      updateFields.push('category = ?')
      updateValues.push(body.category)
    }
    if (body.numberOfItems) {
      updateFields.push('number_of_items = ?')
      updateValues.push(parseInt(body.numberOfItems))
    }
    if (body.status) {
      updateFields.push('status = ?')
      updateValues.push(body.status)
    }
    if (body.expectedDeliveryDate) {
      updateFields.push('expected_delivery_date = ?')
      updateValues.push(body.expectedDeliveryDate)
    }
    if (body.totalAmount) {
      updateFields.push('total_amount = ?')
      updateValues.push(parseFloat(body.totalAmount))
    }

    if (updateFields.length > 0) {
      updateValues.push(id)
      await pool.execute(
        `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      )
    }

    // Fetch updated order
    const [updatedOrder] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    )

    // Map database fields to frontend format
    const mappedOrder = {
      id: updatedOrder[0].id,
      orderDate: updatedOrder[0].order_date,
      name: updatedOrder[0].name,
      sku: updatedOrder[0].sku,
      supplier: updatedOrder[0].supplier,
      category: updatedOrder[0].category,
      numberOfItems: updatedOrder[0].number_of_items,
      status: updatedOrder[0].status,
      expectedDeliveryDate: updatedOrder[0].expected_delivery_date,
      totalAmount: updatedOrder[0].total_amount
    }

    return NextResponse.json({ order: mappedOrder })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
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
    // Check if order exists
    const [existingOrder] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    )
    
    if (existingOrder.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Delete order
    await pool.execute(
      'DELETE FROM orders WHERE id = ?',
      [id]
    )

    // Map database fields to frontend format
    const mappedOrder = {
      id: existingOrder[0].id,
      orderDate: existingOrder[0].order_date,
      name: existingOrder[0].name,
      sku: existingOrder[0].sku,
      supplier: existingOrder[0].supplier,
      category: existingOrder[0].category,
      numberOfItems: existingOrder[0].number_of_items,
      status: existingOrder[0].status,
      expectedDeliveryDate: existingOrder[0].expected_delivery_date,
      totalAmount: existingOrder[0].total_amount
    }

    return NextResponse.json({ order: mappedOrder })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}

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
