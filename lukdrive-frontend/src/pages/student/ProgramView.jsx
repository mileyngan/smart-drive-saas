import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import studentService from '../../services/student.service';
import { Book, Lock, Unlock } from 'lucide-react';

const ProgramView = () => {
    const { data: program, isLoading: isLoadingProgram } = useQuery({
        queryKey: ['enrolledProgram'],
        queryFn: () => studentService.getEnrolledProgram().then(res => res.data),
    });

    const { data: chapters, isLoading: isLoadingChapters } = useQuery({
        queryKey: ['studentChapters'],
        queryFn: () => studentService.getChapters().then(res => res.data),
    });

    if (isLoadingProgram || isLoadingChapters) {
        return <div>Loading program details...</div>;
    }

    if (!program) {
        return <div className="text-center text-gray-600">You are not currently enrolled in any program.</div>;
    }

    // Helper function to check if a chapter is unlocked
    const isChapterUnlocked = (chapter, index, allChapters) => {
        if (index === 0) return true; // The first chapter is always unlocked

        const previousChapter = allChapters[index - 1];
        const progress = previousChapter.student_progress[0];

        if (!progress) return false; // No progress on previous chapter

        // A chapter is unlocked if the previous chapter's quiz is passed AND practical tasks are completed.
        return progress.quiz_passed === true && progress.practical_tasks_completed === true;
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{program.name}</h1>
            <p className="mt-1 text-gray-600">{program.description}</p>

            <div className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold">Chapters</h2>
                {chapters?.map((chapter, index) => {
                    const isUnlocked = isChapterUnlocked(chapter, index, chapters);
                    const ChapterComponent = isUnlocked ? Link : 'div';

                    return (
                        <ChapterComponent
                            key={chapter.id}
                            to={`/student/chapter/${chapter.id}`}
                            className={`flex items-center bg-white p-4 rounded-lg shadow transition-all ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:scale-105'}`}
                        >
                            <div className={`mr-4 p-2 rounded-full ${!isUnlocked ? 'bg-gray-200' : 'bg-blue-100'}`}>
                                <Book className={`h-6 w-6 ${!isUnlocked ? 'text-gray-500' : 'text-blue-600'}`} />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">{chapter.chapter_number}. {chapter.title}</h3>
                                <p className="text-sm text-gray-500">{chapter.duration_minutes || 'N/A'} minutes</p>
                            </div>
                            <div>
                                {isUnlocked ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5 text-gray-400" />}
                            </div>
                        </ChapterComponent>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgramView;