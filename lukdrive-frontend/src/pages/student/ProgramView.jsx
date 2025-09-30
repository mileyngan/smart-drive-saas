import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import studentService from '../../services/student.service';
import { Book, Lock, Unlock } from 'lucide-react';

const ProgramView = () => {
    const token = useAuthStore((state) => state.token);

    const { data: program, isLoading: isLoadingProgram } = useQuery({
        queryKey: ['enrolledProgram'],
        queryFn: () => studentService.getEnrolledProgram(token).then(res => res.data),
        enabled: !!token,
    });

    const { data: chapters, isLoading: isLoadingChapters } = useQuery({
        queryKey: ['studentChapters'],
        queryFn: () => studentService.getChapters(token).then(res => res.data),
        enabled: !!token,
    });

    if (isLoadingProgram || isLoadingChapters) {
        return <div>Loading program details...</div>;
    }

    if (!program) {
        return <div className="text-center text-gray-600">You are not currently enrolled in any program.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{program.name}</h1>
            <p className="mt-1 text-gray-600">{program.description}</p>

            <div className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold">Chapters</h2>
                {chapters?.map((chapter, index) => {
                    const isLocked = index > 0 && !chapters[index - 1].student_progress[0]?.quiz_score;
                    const ChapterComponent = isLocked ? 'div' : Link;

                    return (
                        <ChapterComponent
                            key={chapter.id}
                            to={`/student/chapter/${chapter.id}`}
                            className={`flex items-center bg-white p-4 rounded-lg shadow transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:scale-105'}`}
                        >
                            <div className={`mr-4 p-2 rounded-full ${isLocked ? 'bg-gray-200' : 'bg-blue-100'}`}>
                                <Book className={`h-6 w-6 ${isLocked ? 'text-gray-500' : 'text-blue-600'}`} />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">{chapter.chapter_number}. {chapter.title}</h3>
                                <p className="text-sm text-gray-500">{chapter.duration_minutes} minutes</p>
                            </div>
                            <div>
                                {isLocked ? <Lock className="h-5 w-5 text-gray-400" /> : <Unlock className="h-5 w-5 text-green-500" />}
                            </div>
                        </ChapterComponent>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgramView;