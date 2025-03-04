// src/app/problems/page.js
import { prisma } from '@/lib/db';
import ProblemTable from '@/components/ProblemTable';
import Link from 'next/link';

export default async function ProblemsPage() {
  // Fetch problems from database
  const problems = await prisma.problem.findMany({
    orderBy: {
      dateAdded: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#2d3748]">
            Your LeetCode Problems
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl text-[#2d3748] font-medium">Saved Problems</h2>
            <p className="text-gray-600 mt-1">
              Click on a problem to view your notes
            </p>
          </div>
          <Link 
            href="/" 
            className="px-4 py-2 bg-[#0a84ff] text-white rounded-md hover:bg-[#0068cc] transition-colors"
          >
            Add New Problem
          </Link>
        </div>

        {problems.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No problems saved yet. Add your first one!</p>
          </div>
        )}
      </main>
    </div>
  );
}