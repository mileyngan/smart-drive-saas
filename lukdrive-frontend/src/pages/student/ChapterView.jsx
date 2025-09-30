import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import studentService from '../../services/student.service';
import Button from '../../components/common/Button';
import SecureContentWrapper from '../../components/student/SecureContentWrapper';
import Watermark from '../../components/student/Watermark';

const ChapterView = () => {
  const { chapterId } = useParams();

  // Fetch all chapters and then find the current one.
  // This leverages the existing endpoint and react-query's caching.
  const { data: chapters, isLoading } = useQuery({
      queryKey: ['studentChapters'],
      queryFn: () => studentService.getChapters().then(res => res.data),
  });

  const chapter = chapters?.find(c => c.id === chapterId);

  if (isLoading) return <div>Loading chapter...</div>;
  if (!chapter) return <div>Chapter not found or you do not have access.</div>;

  return (
    <SecureContentWrapper>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{chapter?.title}</h1>
        <p className="mt-2 text-gray-600">Study the materials below, then take the quiz to proceed.</p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
              <div className="bg-white p-4 rounded-lg shadow relative">
                  <h2 className="text-xl font-semibold mb-4">eBook Reader</h2>
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-md overflow-hidden">
                      <Watermark />
                      <iframe src={chapter?.ebook_url} className="w-full h-full border-none" title="eBook"></iframe>
                  </div>
              </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow relative">
                  <h2 className="text-xl font-semibold mb-4">Video Lesson</h2>
                  <div className="aspect-w-16 aspect-h-9 bg-black rounded-md overflow-hidden">
                      <Watermark />
                      <video controls controlsList="nodownload" className="w-full h-full" src={chapter?.video_url}></video>
                  </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Ready to test your knowledge?</h2>
                  <p className="text-gray-600 mb-4">Pass the quiz to unlock the next chapter.</p>
                  <Link to={`/student/chapter/${chapterId}/quiz`}>
                      <Button className="w-full">Start Quiz</Button>
                  </Link>
              </div>
          </div>
        </div>
      </div>
    </SecureContentWrapper>
  );
};

export default ChapterView;