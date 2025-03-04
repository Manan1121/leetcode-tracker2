// src/app/api/problems/[id]/review/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Calculate next review date based on confidence
function calculateNextReview(confidence) {
  const today = new Date();
  const days = {
    1: 1,    // Review tomorrow
    2: 3,    // Review in 3 days
    3: 7,    // Review in a week
    4: 14,   // Review in 2 weeks
    5: 30    // Review in a month
  }[confidence] || 7;

  return new Date(today.setDate(today.getDate() + days));
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { confidence, notes } = body;

    // Create review record
    const review = await prisma.review.create({
      data: {
        problemId: parseInt(id),
        confidence,
        notes
      }
    });

    // Update problem with new review count and next review date
    const problem = await prisma.problem.update({
      where: { id: parseInt(id) },
      data: {
        reviewCount: { increment: 1 },
        nextReview: calculateNextReview(confidence)
      }
    });

    return NextResponse.json({ review, problem });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}