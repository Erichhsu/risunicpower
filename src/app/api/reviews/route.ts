import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

function isIntInRange(value: unknown, min: number, max: number): boolean {
  if (typeof value !== 'number' && typeof value !== 'string') return false;
  const num = Number(value);
  return Number.isInteger(num) && num >= min && num <= max;
}

// ─── POST: Submit a new review ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, rating, content, author, company, country } = body;
    const errors: string[] = [];

    if (!productId || typeof productId !== 'string') errors.push('productId is required');
    if (!isIntInRange(rating, 1, 5)) errors.push('rating must be an integer between 1 and 5');
    if (!content || typeof content !== 'string' || stripHtml(content).length < 10) {
      errors.push('content must be at least 10 characters');
    }
    if (errors.length > 0) return NextResponse.json({ success: false, errors }, { status: 400 });

    const review = await prisma.productReview.create({
      data: {
        productId: stripHtml(productId),
        rating: Number(rating),
        content: stripHtml(content),
        author: author && typeof author === 'string' ? stripHtml(author) : 'Verified Buyer',
        company: company && typeof company === 'string' ? stripHtml(company) : null,
        country: country && typeof country === 'string' ? stripHtml(country) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your review has been submitted.',
      reviewId: review.id,
    }, { status: 201 });
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}

// ─── GET: Fetch reviews ───
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'productId query parameter is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.productReview.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });

    const response = NextResponse.json({ reviews });
    response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=120');
    return response;
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json({ reviews: [] }, {
      headers: { 'Cache-Control': 'no-cache' },
    });
  }
}
