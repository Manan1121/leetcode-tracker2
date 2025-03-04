// src/app/page.js
import ProblemForm from "../components/ProblemForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#2d3748]">
            LeetCode Problem Tracker
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl text-[#2d3748] font-medium">
            Add New Problem
          </h2>
          <p className="text-gray-600 mt-1">
            Enter a LeetCode problem number to save it to your tracking list.
          </p>
        </div>

        <ProblemForm />
      </main>
    </div>
  );
}
