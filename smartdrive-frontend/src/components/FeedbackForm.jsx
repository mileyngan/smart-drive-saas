import React, { useState } from 'react';

const FeedbackForm = ({ userRole, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const feedback = {
            rating,
            comments,
            role: userRole,
        };
        onSubmit(feedback); // Call the submit function passed as a prop
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md">
            <h2 className="text-xl font-bold">Feedback Form</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700">Rating (1-10)</label>
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Comments (optional)</label>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    rows="4"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" className="bg-gray-300 text-gray-700 rounded-md p-2" onClick={() => { setRating(0); setComments(''); }}>
                    Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white rounded-md p-2">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default FeedbackForm;
