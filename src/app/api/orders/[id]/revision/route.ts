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

    const { requestText, deadline } = await request.json();

    // Verify order ownership
    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order || order.customerId !== decoded.userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if order is completed
    if (order.status !== 'COMPLETED') {
      return NextResponse.json(
        { message: 'Can only request revision for completed orders' },
        { status: 400 }
      );
    }

    // Create revision request
    const revision = await prisma.revision.create({
      data: {
        orderId: params.id,
        customerId: decoded.userId,
        requestText,
        status: 'PENDING',
        ...(deadline && { createdAt: new Date(deadline) }),
      },
    });

    // Update order status
    await prisma.order.update({
      where: { id: params.id },
      data: { status: 'REVISION' },
    });

    return NextResponse.json(
      { success: true, message: 'Revision request submitted', revision },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create revision error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
