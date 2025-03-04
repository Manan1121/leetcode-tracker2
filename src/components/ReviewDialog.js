// src/components/ReviewDialog.js
'use client';

import { useState } from 'react';

export default function ReviewDialog({ problem, onClose, onSubmit }) {
  const [confidence, setConfidence] = useState(0);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onSubmit({
        confidence,
        notes,
        problemId: problem.id
      });
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Review: {problem.title}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Confidence Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How well did you remember this problem?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setConfidence(rating)}
                  className={`p-2 w-10 h-10 rounded-full ${
                    confidence === rating
                      ? 'bg-[#00b8a3] text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              1 = Forgot completely, 5 = Remembered perfectly
            </div>
          </div>

          {/* Review Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[100px]"
              placeholder="What did you remember? What did you forget? Any new insights?"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confidence || submitting}
              className="px-4 py-2 bg-[#00b8a3] text-white rounded-md hover:bg-[#00a092] disabled:bg-gray-300"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}