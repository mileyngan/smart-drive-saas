import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import courseService from '../../services/course.service';
import CourseForm from '../../components/admin/CourseForm';
import ChapterForm from '../../components/admin/ChapterForm';
import { Book, CheckCircle } from 'lucide-react';

const CourseBuilder = () => {
  const [step, setStep] = useState(1);
  const [createdCourse, setCreatedCourse] = useState(null);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const { data: chapters, isLoading: isLoadingChapters } = useQuery({
    queryKey: ['chapters', createdCourse?.id],
    queryFn: () => courseService.getChaptersByCourse(createdCourse.id, token).then(res => res.data),
    enabled: !!createdCourse,
  });

  const createCourseMutation = useMutation({
    mutationFn: (courseData) => courseService.createCourse(courseData, token),
    onSuccess: (response) => {
      toast.success('Course created successfully! Now add chapters.');
      setCreatedCourse(response.data);
      setStep(2);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create course.');
    },
  });

  const handleCourseSubmit = (data) => {
    createCourseMutation.mutate(data);
  };

  const handleChapterAdded = () => {
    queryClient.invalidateQueries(['chapters', createdCourse.id]);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Course Builder</h1>
      <p className="mt-2 text-gray-600">Create and manage your driving school's educational programs here.</p>

      <div className="mt-8">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 1: Course Details</h2>
            <CourseForm
              onSubmit={handleCourseSubmit}
              isLoading={createCourseMutation.isPending}
            />
          </div>
        )}

        {step === 2 && createdCourse && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 2: Add Chapters for "{createdCourse.name}"</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-2">New Chapter</h3>
                <ChapterForm courseId={createdCourse.id} onChapterAdded={handleChapterAdded} />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Added Chapters ({chapters?.length || 0} / {createdCourse.total_chapters})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {isLoadingChapters && <p>Loading chapters...</p>}
                  {chapters?.map((chapter) => (
                    <div key={chapter.id} className="flex items-center bg-white p-3 rounded-md shadow-sm">
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