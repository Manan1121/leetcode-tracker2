// src/components/ProblemForm.js
'use client';

import { useState } from 'react';

const DIFFICULTY_COLORS = {
  Easy: 'text-[#00b8a3]',
  Medium: 'text-[#ffa116]',
  Hard: 'text-[#ff375f]'
};

export default function ProblemForm() {
  const [problemId, setProblemId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [problemDetails, setProblemDetails] = useState(null);

  async function fetchProblemDetails() {
    if (!problemId) return;
     
    setLoading(true);
    setError('');
    setProblemDetails(null);
    
    try {
      const response = await fetch(`/api/problems?id=${problemId}`);
      if (!response.ok) {
        throw new Error('Problem not found');
      }
      
      const data = await response.json();
      setProblemDetails(data.problem);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!problemDetails) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          notes,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save problem');
      }
      
      setSuccess('Problem saved successfully! You can add another one.');
      setProblemId('');
      setNotes('');
      setProblemDetails(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Problem Search Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-[#2d3748] mb-2">
          Problem Number
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={problemId}
            onChange={(e) => setProblemId(e.target.value)}
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a84ff] text-gray-800"
            placeholder="Enter LeetCode problem number"
          />
          <button
            onClick={fetchProblemDetails}
            disabled={loading || !problemId}
            className="px-4 py-2 bg-[#0a84ff] text-white rounded-md hover:bg-[#0068cc] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Finding...' : 'Find'}
          </button>
        </div>
      </div>

      {/* Problem Details Card */}
      {problemDetails && (
        <div className="mb-8 p-4 border rounded-md bg-gray-50">
          <h3 className="font-medium text-lg text-[#2d3748] mb-2">
            {problemDetails.title}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span className={DIFFICULTY_COLORS[problemDetails.difficulty]}>
              {problemDetails.difficulty}
            </span>
            <span className="text-gray-600">
              Acceptance: {problemDetails.acceptanceRate}
            </span>
          </div>
          <a
            href={problemDetails.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0a84ff] hover:underline text-sm mt-2 inline-block"
          >
            Solve on LeetCode →
          </a>
        </div>
      )}

      {/* Notes Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#2d3748] mb-2">
            Your Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border rounded-md min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#0a84ff] text-gray-800"
            placeholder="Add your approach, time complexity, and notes for review..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !problemDetails}
          className="w-full py-2 bg-[#00b8a3] text-white rounded-md hover:bg-[#00a092] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Problem'}
        </button>
      </form>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-[#ff375f] rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-[#00b8a3] rounded-md">
          {success}
        </div>
      )}
    </div>
  );
}