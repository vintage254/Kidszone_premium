import { NextRequest, NextResponse } from 'next/server';
import { capturePaypalOrder } from '@/lib/actions/paypal.actions';

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json();
    
    if (!orderID) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const result = await capturePaypalOrder(orderID);
    
    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json({ error: 'Failed to capture PayPal order' }, { status: 500 });
  }
}
