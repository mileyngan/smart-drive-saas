import React, { useState, useEffect } from "react";
import LessonCard from "../components/LessonCard";
import LessonCardCreator from "../components/LessonCardCreator";
import { supabase } from "../supabase";

const Lesson = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lessons, setLessons] = useState([]);

    // Fetch lessons from Supabase
    useEffect(() => {
        const fetchLessons = async () => {
            const { data, error } = await supabase
                .from("lessons")
                .select("*")
                .order("date", { ascending: false });

            if (error) console.error("Error fetching lessons:", error.message);
            else setLessons(data);
        };

        fetchLessons();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-md rounded-lg">
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Create a Lesson Card
                </button>
            </div>

            {isModalOpen && <LessonCardCreator onClose={() => setIsModalOpen(false)} />}

            <h1 className="text-4xl font-bold text-center text-gray-800 my-6">
                Manual Car Theory
            </h1>
            <p className="text-center text-gray-600 mb-8">
                Learn the fundamental principles of manual car driving, including gear shifting, clutch control, and road safety.
            </p>

            {/* Render Lessons from Supabase */}
            <div className="space-y-6">
                {lessons.map((lesson) => (
                    <LessonCard
                        key={lesson.id}
                        eid={lesson.video_id}
                        title={lesson.title}
                        description={lesson.description}
                        date={new Date(lesson.date).toDateString()}
                        pdfLink={lesson.pdf_link}
                        quizLink={lesson.quiz_link}
                    />
                ))}
            </div>
        </div>
    );
};

export default Lesson;
