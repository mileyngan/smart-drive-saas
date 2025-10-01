import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import courseService from '../../services/course.service';
import CourseForm from '../../components/admin/CourseForm';
import ChapterForm from '../../components/admin/ChapterForm';
import QuizEditorModal from '../../components/admin/QuizEditorModal';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { Book, CheckCircle, Plus, List, Zap, Edit } from 'lucide-react';

const CourseBuilder = () => {
  const [step, setStep] = useState(0);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const queryClient = useQueryClient();

  const programId = selectedProgram?.id || createdCourse?.id;

  const { data: existingPrograms, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: () => courseService.getPrograms().then(res => res.data),
  });

  const { data: chapters, isLoading: isLoadingChapters, refetch: refetchChapters } = useQuery({
    queryKey: ['chapters', programId],
    queryFn: () => courseService.getChapters(programId).then(res => res.data),
    enabled: !!programId,
  });

  const createProgramMutation = useMutation({
    mutationFn: courseService.createProgram,
    onSuccess: (response) => {
      toast.success('Program created successfully! Now add chapters.');
      setCreatedCourse(response.data);
      queryClient.invalidateQueries(['programs']);
      setStep(2);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create program.');
    },
  });

  const generateQuizMutation = useMutation({
    mutationFn: courseService.generateQuiz,
    onSuccess: (response) => {
        toast.success('Quiz questions generated successfully!');
        setGeneratedQuestions(response.data.questions);
        setIsQuizModalOpen(true);
    },
    onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to generate quiz.');
    }
  });

  const saveQuizMutation = useMutation({
    mutationFn: courseService.saveQuiz,
    onSuccess: () => {
        toast.success('Quiz saved successfully!');
        setIsQuizModalOpen(false);
        setGeneratedQuestions(null);
        setSelectedChapter(null);
        refetchChapters();
    },
    onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to save quiz.');
    }
  });

  const handleGenerateQuiz = (chapter) => {
    setSelectedChapter(chapter);
    generateQuizMutation.mutate(chapter.id);
  };

  const handleSaveQuiz = (quizData) => {
    saveQuizMutation.mutate({ chapterId: selectedChapter.id, ...quizData });
  };

  const handleCreateNew = () => {
    setStep(1);
    setSelectedProgram(null);
    setCreatedCourse(null);
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setStep(2);
  };

  const renderChapters = () => {
    if (isLoadingChapters) return <p>Loading chapters...</p>;
    if (chapters?.length === 0) return <p className="text-gray-500 text-sm">No chapters added yet.</p>;

    return chapters?.map((chapter) => (
        <div key={chapter.id} className="flex items-center bg-white p-3 rounded-md shadow-sm">
            <Book className="h-5 w-5 text-blue-500 mr-3" />
            <span className="flex-grow font-medium text-gray-700">{chapter.chapter_number}. {chapter.title}</span>
            {chapter.has_quiz ? (
                <span className="text-sm text-green-600 font-semibold flex items-center"><CheckCircle className="h-4 w-4 mr-1"/> Quiz Saved</span>
            ) : (
                <Button size="sm" onClick={() => handleGenerateQuiz(chapter)} disabled={generateQuizMutation.isLoading && selectedChapter?.id === chapter.id}>
                    <Zap className="h-4 w-4 mr-1"/> {generateQuizMutation.isLoading && selectedChapter?.id === chapter.id ? 'Generating...' : 'Generate Quiz'}
                </Button>
            )}
        </div>
    ));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Course Builder</h1>
      <p className="mt-2 text-gray-600">Create and manage your driving school's educational programs here.</p>

      <div className="mt-8">
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Program</h2>
            {isLoadingPrograms ? <p>Loading programs...</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingPrograms?.map((program) => (
                  <div key={program.id} className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSelectProgram(program)}>
                    <div className="flex items-center mb-2"><Book className="h-5 w-5 text-blue-500 mr-2" /><h3 className="font-semibold text-gray-800">{program.name}</h3></div>
                    <p className="text-sm text-gray-600">Click to manage chapters</p>
                  </div>
                ))}
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-100 transition-colors flex flex-col items-center justify-center" onClick={handleCreateNew}>
                  <Plus className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-blue-700">Create New Program</p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-4"><button onClick={() => setStep(0)} className="text-blue-500 hover:text-blue-700 flex items-center"><List className="h-4 w-4 mr-1" /> Back to Programs</button></div>
            <h2 className="text-xl font-semibold mb-4">Create New Program</h2>
            <CourseForm onSubmit={createProgramMutation.mutate} isLoading={createProgramMutation.isPending} />
          </div>
        )}

        {step === 2 && programId && (
          <div>
            <div className="mb-4"><button onClick={() => setStep(0)} className="text-blue-500 hover:text-blue-700 flex items-center"><List className="h-4 w-4 mr-1" /> Back to Programs</button></div>
            <h2 className="text-xl font-semibold mb-4">Manage Chapters for "{selectedProgram?.name || createdCourse?.name}"</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Add New Chapter</h3>
                <ChapterForm courseId={programId} onChapterAdded={refetchChapters} />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Chapters</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">{renderChapters()}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} title="Review & Edit Quiz">
          <QuizEditorModal
            initialQuestions={generatedQuestions}
            onSave={handleSaveQuiz}
            isLoading={saveQuizMutation.isPending}
            chapterTitle={selectedChapter?.title}
          />
      </Modal>
    </div>
  );
};

export default CourseBuilder;