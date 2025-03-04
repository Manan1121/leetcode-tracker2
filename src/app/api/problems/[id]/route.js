import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { notes } = body;

    const updatedProblem = await prisma.problem.update({
      where: { id: parseInt(id) },
      data: { notes },
    });

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json(
      { error: "Failed to update problem" },
      { status: 500 }
    );
  }
}
