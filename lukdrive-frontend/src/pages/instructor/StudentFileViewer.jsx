import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import instructorService from '../../services/instructor.service';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Edit, MessageSquare, Book, User } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const StudentFileViewer = () => {
    const { studentId } = useParams();
    const queryClient = useQueryClient();
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [selectedChapterProgress, setSelectedChapterProgress] = useState(null);
    const [notes, setNotes] = useState('');

    const { data: studentFile, isLoading, error } = useQuery({
        queryKey: ['studentFile', studentId],
        queryFn: () => instructorService.getStudentFile(studentId).then(res => res.data),
    });

    // We need student details for the header, let's get them from the cache if possible
    const { data: students } = useQuery({ queryKey: ['instructorStudents'] });
    const studentDetails = students?.find(s => s.id === studentId);

    const updateProgressMutation = useMutation({
        mutationFn: instructorService.updateStudentProgress,
        onSuccess: () => {
            toast.success('Progress updated successfully!');
            queryClient.invalidateQueries(['studentFile', studentId]);
            if (isNotesModalOpen) {
                setIsNotesModalOpen(false);
                setSelectedChapterProgress(null);
            }
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update progress.');
        },
    });

    const handleTogglePractical = (progress) => {
        updateProgressMutation.mutate({
            studentId,
            chapter_id: progress.chapter.id,
            practical_tasks_completed: !progress.practical_tasks_completed,
        });
    };

    const openNotesModal = (progress) => {
        setSelectedChapterProgress(progress);
        setNotes(progress.instructor_notes || '');
        setIsNotesModalOpen(true);
    };

    const handleSaveNotes = () => {
        updateProgressMutation.mutate({
            studentId,
            chapter_id: selectedChapterProgress.chapter.id,
            instructor_notes: notes,
        });
    };

    if (isLoading) return <div>Loading student file...</div>;
    if (error) return <div className="text-red-500">Error fetching student file: {error.message}</div>;

    return (
        <div>
            <div className="flex items-center mb-4">
                <User className="h-8 w-8 text-gray-500 mr-3" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Student Progress File</h1>
                    <p className="mt-1 text-gray-600">
                        {studentDetails ? `${studentDetails.first_name} ${studentDetails.last_name}` : `Student ID: ${studentId}`}
                    </p>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <ul className="-mb-8">
                    {studentFile?.map((item, itemIdx) => (
                        <li key={item.chapter.id}>
                            <div className="relative pb-8">
                                {itemIdx !== studentFile.length - 1 && (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                )}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                            <p className="text-white font-bold text-sm">{item.chapter.chapter_number}</p>
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                            <p className="text-sm text-gray-800 font-semibold">{item.chapter.title}</p>
                                            <div className="mt-2 flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                                <span>eBook: {item.ebook_completed ? <CheckCircle className="inline h-4 w-4 text-green-500" /> : <XCircle className="inline h-4 w-4 text-red-500" />}</span>
                                                <span>Video: {item.video_completed ? <CheckCircle className="inline h-4 w-4 text-green-500" /> : <XCircle className="inline h-4 w-4 text-red-500" />}</span>
                                                <span>Quiz: {item.quiz_passed ? <span className="text-green-600">{item.quiz_score}% (Passed)</span> : <span className="text-red-600">{item.quiz_score}% (Failed)</span>}</span>
                                            </div>
                                             <div className="mt-3 flex items-center">
                                                <p className="text-sm font-medium text-gray-600 mr-2">Practical Tasks:</p>
                                                <Button
                                                    size="sm"
                                                    variant={item.practical_tasks_completed ? 'success' : 'danger'}
                                                    onClick={() => handleTogglePractical(item)}
                                                    disabled={updateProgressMutation.isLoading}
                                                >
                                                    {item.practical_tasks_completed ? <CheckCircle className="h-5 w-5 mr-1" /> : <XCircle className="h-5 w-5 mr-1" />}
                                                    {item.practical_tasks_completed ? 'Completed' : 'Incomplete'}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                            <Button variant="secondary" size="sm" onClick={() => openNotesModal(item)}>
                                                <Edit className="h-4 w-4 mr-1"/> {item.instructor_notes ? 'Edit Notes' : 'Add Notes'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <Modal isOpen={isNotesModalOpen} onClose={() => setIsNotesModalOpen(false)} title={`Notes for Chapter ${selectedChapterProgress?.chapter.chapter_number}`}>
                <div>
                    <textarea
                        rows="5"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter notes for this chapter..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={handleSaveNotes}
                            disabled={updateProgressMutation.isLoading}
                        >
                            {updateProgressMutation.isLoading ? 'Saving...' : 'Save Notes'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StudentFileViewer;