import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { CreateOrderSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate input
    const validation = CreateOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { paperType, topic, academicLevel, wordCount, pages, citationStyle, deadline, instructions, attachments, preferences, pricing } = validation.data;

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: decoded.userId,
        paperType,
        topic,
        academicLevel,
        wordCount,
        pages,
        citationStyle,
        deadline: new Date(deadline),
        instructions,
        attachments: attachments || [],
        preferences: preferences || {},
        totalPrice: pricing?.totalPrice || 0,
        finalPrice: pricing?.totalPrice || 0,
        discountPercent: pricing?.discountPercent || 0,
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalPrice: order.totalPrice,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
