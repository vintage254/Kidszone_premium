import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByUserId } from '@/lib/actions/order.actions';

export async function GET() {
  try {
    const result = await getOrdersByUserId();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message || 'Failed to fetch orders'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error fetching orders:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
