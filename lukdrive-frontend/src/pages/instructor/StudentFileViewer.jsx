import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import instructorService from '../../services/instructor.service';
import { CheckCircle, XCircle, Edit, MessageSquare } from 'lucide-react';

const StudentFileViewer = () => {
    const { studentId } = useParams();
    const token = useAuthStore((state) => state.token);

    const { data: studentFile, isLoading, error } = useQuery({
        queryKey: ['studentFile', studentId],
        queryFn: () => instructorService.getStudentFile(studentId, token).then(res => res.data),
        enabled: !!token && !!studentId,
    });

    if (isLoading) return <div>Loading student file...</div>;
    if (error) return <div className="text-red-500">Error fetching student file: {error.message}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Progress File</h1>
            <p className="mt-1 text-gray-600">Viewing progress for student ID: {studentId}</p>

            <div className="mt-8 flow-root">
                <ul className="-mb-8">
                    {studentFile?.map((item, itemIdx) => (
                        <li key={item.chapter.chapter_number}>
                            <div className="relative pb-8">
                                {itemIdx !== studentFile.length - 1 ? (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                            <p className="text-white font-bold text-sm">{item.chapter.chapter_number}</p>
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold">{item.chapter.title}</p>
                                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                                <span>eBook: {item.ebook_completed ? <CheckCircle className="inline h-4 w-4 text-green-500" /> : <XCircle className="inline h-4 w-4 text-red-500" />}</span>
                                                <span>Video: {item.video_completed ? <CheckCircle className="inline h-4 w-4 text-green-500" /> : <XCircle className="inline h-4 w-4 text-red-500" />}</span>
                                                <span>Quiz: {item.quiz_score !== null ? `${item.quiz_score}%` : 'N/A'}</span>
                                            </div>
                                             <div className="mt-2 flex items-center">
                                                <p className="text-sm text-gray-500 mr-2">Practical:</p>
                                                <button className={`p-1 rounded-full ${item.practical_completed ? 'bg-green-200' : 'bg-gray-200'}`}>
                                                    {item.practical_completed ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                            <button className="text-blue-500 hover:text-blue-700 flex items-center">
                                                <Edit className="h-4 w-4 mr-1"/> Notes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StudentFileViewer;