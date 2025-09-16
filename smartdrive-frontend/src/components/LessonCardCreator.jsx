import React, { useState } from "react";
import { supabase } from "../supabase";

const LessonCardCreator = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoId, setVideoId] = useState("");
    const [pdfLink, setPdfLink] = useState("");
    const [quizLink, setQuizLink] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from("lessons")
            .insert([
                {
                    title,
                    description,
                    video_id: videoId,
                    pdf_link: pdfLink,
                    quiz_link: quizLink,
                },
            ]);

        if (error) {
            console.error("Error adding lesson:", error.message);
        } else {
            console.log("Lesson added:", data);
            onClose(); // Close modal after submission
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Create Lesson Card</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Lesson Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        placeholder="Lesson Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="YouTube Video ID"
                        value={videoId}
                        onChange={(e) => setVideoId(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="PDF Link (optional)"
                        value={pdfLink}
                        onChange={(e) => setPdfLink(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Quiz Link (optional)"
                        value={quizLink}
                        onChange={(e) => setQuizLink(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                            Save Lesson
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LessonCardCreator;
