import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import courseService from '../../services/course.service';
import CourseForm from '../../components/admin/CourseForm';
import ChapterForm from '../../components/admin/ChapterForm';
import { Book, CheckCircle, Plus, List } from 'lucide-react';

const CourseBuilder = () => {
  const [step, setStep] = useState(0);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const queryClient = useQueryClient();

  // Fetch existing programs
  const { data: existingPrograms, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: () => courseService.getPrograms().then(res => res.data),
  });

  const { data: chapters, isLoading: isLoadingChapters, refetch: refetchChapters } = useQuery({
    queryKey: ['chapters', selectedProgram?.id || createdCourse?.id],
    queryFn: () => courseService.getChapters(selectedProgram?.id || createdCourse?.id).then(res => res.data),
    enabled: !!(selectedProgram || createdCourse),
  });

  const createCourseMutation = useMutation({
    mutationFn: courseService.createProgram,
    onSuccess: (response) => {
      toast.success('Program created successfully! Now add chapters.');
      setCreatedCourse(response.data);
      queryClient.invalidateQueries(['programs']); // Invalidate to refetch the list
      setStep(2);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create program.');
    },
  });

  const handleCourseSubmit = (data) => {
    createCourseMutation.mutate(data);
  };

  const handleChapterAdded = () => {
    console.log('Chapter added, refetching chapters for course:', createdCourse.id);
    refetchChapters();
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setStep(2);
    toast.success(`Selected program: ${program.name}`);
  };

  const handleCreateNew = () => {
    setStep(1);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Course Builder</h1>
      <p className="mt-2 text-gray-600">Create and manage your driving school's educational programs here.</p>

      <div className="mt-8">
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Select a Program</h2>
            {isLoadingPrograms ? (
              <p>Loading programs...</p>
            ) : existingPrograms && existingPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleSelectProgram(program)}
                  >
                    <div className="flex items-center mb-2">
                      <Book className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold text-gray-800">{program.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">Click to manage chapters</p>
                  </div>
                ))}
                <div
                  className="bg-blue-50 p-4 rounded-lg shadow-sm border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-100 transition-colors flex flex-col items-center justify-center"
                  onClick={handleCreateNew}
                >
                  <Plus className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-blue-700">Create New Program</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">No programs found. Create your first program!</p>
                <button
                  onClick={handleCreateNew}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Create New Program
                </button>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setStep(0)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <List className="h-4 w-4 mr-1" />
                Back to Programs
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4">Create New Program</h2>
            <CourseForm
              onSubmit={handleCourseSubmit}
              isLoading={createCourseMutation.isPending}
            />
          </div>
        )}

        {step === 2 && (createdCourse || selectedProgram) && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setStep(0)}
                className="text-blue-500 hover:text-blue-700 flex items-center"
              >
                <List className="h-4 w-4 mr-1" />
                Back to Programs
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4">
              Manage Chapters for "{selectedProgram?.name || createdCourse?.name}"
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Add New Chapter</h3>
                <ChapterForm
                  courseId={selectedProgram?.id || createdCourse?.id}
                  onChapterAdded={handleChapterAdded}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Chapters ({chapters?.length || 0} / {(selectedProgram || createdCourse)?.total_chapters || 0})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {isLoadingChapters && <p>Loading chapters...</p>}
                  {chapters?.length === 0 && !isLoadingChapters && (
                    <p className="text-gray-500 text-sm">No chapters added yet.</p>
                  )}
                  {chapters?.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="flex items-center bg-white p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toast(`Chapter: ${chapter.title}\nE-book: ${chapter.ebook_url}\nVideo: ${chapter.video_url || 'None'}`)}
                    >
                      <Book className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="flex-grow font-medium text-gray-700">{chapter.chapter_number}. {chapter.title}</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBuilder;