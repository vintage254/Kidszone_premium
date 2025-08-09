import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { syncClerkUserWithDatabase } from '@/lib/services/user.service';

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated with Clerk
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized - No Clerk session' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { clerkUserId: bodyClerkUserId, email, fullName } = body;

    // Verify the Clerk user ID matches the authenticated session
    if (clerkUserId !== bodyClerkUserId) {
      return NextResponse.json(
        { error: 'Forbidden - User ID mismatch' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields: email and fullName' },
        { status: 400 }
      );
    }

    // Sync user with database
    const databaseUser = await syncClerkUserWithDatabase(
      clerkUserId,
      email,
      fullName
    );

    if (!databaseUser) {
      return NextResponse.json(
        { error: 'Failed to sync user with database' },
        { status: 500 }
      );
    }

    // Return the database user data
    return NextResponse.json(databaseUser, { status: 200 });

  } catch (error) {
    console.error('Error in user sync API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed - Use POST instead' },
    { status: 405 }
  );
}
