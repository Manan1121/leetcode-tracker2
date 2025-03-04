// src/app/api/problems/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import getProblemDetails from '@/lib/leetcode';  // Import as default

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // We only need LeetCode API for problem lookup
      const problem = await getProblemDetails(id);
      return NextResponse.json({ problem });
    }

    // Get all saved problems from database
    const problems = await prisma.problem.findMany({
      orderBy: { dateAdded: 'desc' }
    });

    return NextResponse.json({ problems });

  } catch (error) {
    console.error('Error in GET /api/problems:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { problemId, notes } = body;

    if (!problemId) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    // Get problem details from LeetCode
    const leetcodeProblem = await getProblemDetails(problemId);

    // Save to database
    const problem = await prisma.problem.create({
      data: {
        leetcodeId: parseInt(leetcodeProblem.id),
        title: leetcodeProblem.title,
        difficulty: leetcodeProblem.difficulty,
        url: leetcodeProblem.url,
        notes: notes || '',
        nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });

    return NextResponse.json({
      message: 'Problem saved successfully',
      problem: problem
    });

  } catch (error) {
    console.error('Error in POST /api/problems:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save problem' },
      { status: 500 }
    );
  }
}