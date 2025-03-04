// src/components/ProblemTable.js
'use client';

import React, { useState } from 'react';
import ReviewDialog from './ReviewDialog';

const DIFFICULTY_COLORS = {
  Easy: 'text-[#00b8a3]',
  Medium: 'text-[#ffa116]',
  Hard: 'text-[#ff375f]'
};

export default function ProblemTable({ problems: initialProblems }) {
  const [problems, setProblems] = useState(initialProblems);
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [editingNotes, setEditingNotes] = useState(null);
  const [newNotes, setNewNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [reviewingProblem, setReviewingProblem] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' or 'due'

  // Handle saving edited notes
  async function handleSaveNotes(problemId) {
    setSaving(true);
    try {
      const response = await fetch(`/api/problems/${problemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: newNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      // Update the problems list
      setProblems(problems.map(p => 
        p.id === problemId ? { ...p, notes: newNotes } : p
      ));
      
      setEditingNotes(null);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // Handle submitting a review
  const handleReview = async (reviewData) => {
    try {
      const response = await fetch(`/api/problems/${reviewData.problemId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const { problem } = await response.json();
      
      // Update the problems list
      setProblems(problems.map(p => 
        p.id === problem.id ? { ...p, ...problem } : p
      ));
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Check if a problem is due for review
  function isReviewDue(problem) {
    if (!problem.nextReview) return false;
    return new Date(problem.nextReview) <= new Date();
  }

  // Filter problems based on current filter
  const filteredProblems = filter === 'due' 
    ? problems.filter(isReviewDue)
    : problems;

  return (
    <div className="space-y-4">
      {/* Filter controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md transition-colors ${
            filter === 'all' 
              ? 'bg-[#0a84ff] text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          All Problems
        </button>
        <button
          onClick={() => setFilter('due')}
          className={`px-3 py-1 rounded-md transition-colors ${
            filter === 'due' 
              ? 'bg-[#0a84ff] text-white' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Due for Review
        </button>
      </div>

      {/* Problems Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Problem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Review
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProblems.map((problem) => (
              <React.Fragment key={problem.id}>
                <tr 
                  className={`hover:bg-gray-50 cursor-pointer ${
                    isReviewDue(problem) ? 'bg-yellow-50' : ''
                  }`}
                  onClick={() => setExpandedProblem(expandedProblem === problem.id ? null : problem.id)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {problem.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      #{problem.leetcodeId}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${DIFFICULTY_COLORS[problem.difficulty]} font-medium`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(problem.dateAdded).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {problem.nextReview 
                      ? new Date(problem.nextReview).toLocaleDateString()
                      : 'Not scheduled'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setReviewingProblem(problem);
                      }}
                      className="px-3 py-1 bg-[#00b8a3] text-white rounded-md hover:bg-[#00a092] transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
                {expandedProblem === problem.id && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 bg-gray-50">
                      <div className="text-sm text-gray-900">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Notes:</h4>
                          {editingNotes !== problem.id ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingNotes(problem.id);
                                setNewNotes(problem.notes || '');
                              }}
                              className="text-[#0a84ff] hover:underline text-sm"
                            >
                              Edit Notes
                            </button>
                          ) : (
                            <div className="space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveNotes(problem.id);
                                }}
                                disabled={saving}
                                className="text-[#00b8a3] hover:underline text-sm"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingNotes(null);
                                }}
                                className="text-red-500 hover:underline text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                        {editingNotes === problem.id ? (
                          <textarea
                            value={newNotes}
                            onChange={(e) => setNewNotes(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full p-2 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#0a84ff]"
                          />
                        ) : (
                          <p className="whitespace-pre-wrap">{problem.notes || 'No notes added'}</p>
                        )}
                        <div className="mt-4">
                          <a
                            href={problem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0a84ff] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View on LeetCode →
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Dialog */}
      {reviewingProblem && (
        <ReviewDialog
          problem={reviewingProblem}
          onClose={() => setReviewingProblem(null)}
          onSubmit={handleReview}
        />
      )}
    </div>
  );
}