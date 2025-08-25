import { NextRequest, NextResponse } from 'next/server';

// Free currency conversion API (you can replace with a paid service for production)
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = parseFloat(searchParams.get('amount') || '0');
    const toCurrency = searchParams.get('to') || 'USD';

    if (amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (toCurrency === 'USD') {
      return NextResponse.json({
        success: true,
        data: {
          amount,
          convertedAmount: amount,
          fromCurrency: 'USD',
          toCurrency: 'USD',
          rate: 1,
        },
      });
    }

    // Fetch exchange rates
    const response = await fetch(EXCHANGE_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    const rate = data.rates[toCurrency];

    if (!rate) {
      return NextResponse.json(
        { error: 'Unsupported currency' },
        { status: 400 }
      );
    }

    const convertedAmount = amount * rate;

    return NextResponse.json({
      success: true,
      data: {
        amount,
        convertedAmount: Math.round(convertedAmount * 100) / 100, // Round to 2 decimal places
        fromCurrency: 'USD',
        toCurrency,
        rate,
      },
    });
  } catch (error) {
    console.error('Currency conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert currency' },
      { status: 500 }
    );
  }
}
