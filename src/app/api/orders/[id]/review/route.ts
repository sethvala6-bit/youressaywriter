import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { rating, comment } = await request.json();

    // Verify order ownership
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order || order.customerId !== decoded.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        orderId: params.id,
        customerId: decoded.userId,
        rating,
        comment,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Review submitted successfully', review },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
