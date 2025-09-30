import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import studentService from '../../services/student.service';
import Button from '../../components/common/Button';
import SecureContentWrapper from '../../components/student/SecureContentWrapper';
import Watermark from '../../components/student/Watermark';

// Placeholder for a service to get single chapter details
const getChapterDetails = async (chapterId, token) => {
    // In a real app, this would fetch from an endpoint like `/api/student/chapter/${chapterId}`
    // For now, we'll mock it, assuming the necessary URLs would be returned.
    return {
        title: `Chapter ${chapterId}: The Rules of the Road`,
        ebook_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Using a dummy PDF for display
        video_url: 'https://www.w3.org/2010/05/video/mediaevents.html', // Using a sample video
    };
}

const ChapterView = () => {
  const { chapterId } = useParams();
  const token = useAuthStore(state => state.token);

  const { data: chapter, isLoading } = useQuery({
      queryKey: ['chapter', chapterId],
      queryFn: () => getChapterDetails(chapterId, token)
  });

  if (isLoading) return <div>Loading chapter...</div>;

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