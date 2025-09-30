import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import courseService from '../../services/course.service';
import Input from '../common/Input';
import Button from '../common/Button';
import { UploadCloud, FileText, Video, CheckCircle } from 'lucide-react';

const ChapterForm = ({ courseId, onChapterAdded }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const token = useAuthStore((state) => state.token);
  const [ebookUrl, setEbookUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const uploadMutation = useMutation({
    mutationFn: (file) => courseService.uploadFile(file, token),
    onSuccess: (response, file) => {
      toast.success(`${file.name} uploaded successfully!`);
      const url = response.data.publicUrl;
      if (file.type === 'application/pdf') {
        setEbookUrl(url);
      } else {
        setVideoUrl(url);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'File upload failed.');
    },
  });

  const chapterMutation = useMutation({
    mutationFn: (chapterData) => courseService.addChapter(courseId, chapterData, token),
    onSuccess: () => {
      toast.success('Chapter added successfully!');
      onChapterAdded(); // This will be a function passed from the parent to refetch chapters
      reset();
      setEbookUrl('');
      setVideoUrl('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add chapter.');
    },
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const onSubmit = (data) => {
    if (!ebookUrl) {
      toast.error('Please upload an eBook (PDF) for the chapter.');
      return;
    }
    chapterMutation.mutate({ ...data, ebook_url: ebookUrl, video_url: videoUrl });
  };

  const isLoading = uploadMutation.isPending || chapterMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input id="chapter_number" name="chapter_number" type="number" label="Chapter Number" register={register} error={errors.chapter_number} disabled={isLoading} />
        <Input id="title" name="title" label="Chapter Title" register={register} error={errors.title} disabled={isLoading} />
        <Input id="duration_minutes" name="duration_minutes" type="number" label="Duration (Minutes)" register={register} error={errors.duration_minutes} disabled={isLoading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* eBook Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">eBook (PDF)</label>
          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${ebookUrl ? 'border-green-400' : 'border-gray-300'} border-dashed rounded-md`}>
            <div className="space-y-1 text-center">
              {ebookUrl ? <CheckCircle className="mx-auto h-12 w-12 text-green-500" /> : <FileText className="mx-auto h-12 w-12 text-gray-400" />}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="ebook-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="ebook-upload" name="ebook-upload" type="file" className="sr-only" onChange={handleFileUpload} accept=".pdf" disabled={isLoading} />
                </label>
              </div>
              <p className="text-xs text-gray-500">{ebookUrl ? 'Upload complete!' : 'PDF up to 50MB'}</p>
            </div>
          </div>
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Video (MP4)</label>
          <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${videoUrl ? 'border-green-400' : 'border-gray-300'} border-dashed rounded-md`}>
            <div className="space-y-1 text-center">
              {videoUrl ? <CheckCircle className="mx-auto h-12 w-12 text-green-500" /> : <Video className="mx-auto h-12 w-12 text-gray-400" />}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="video-upload" name="video-upload" type="file" className="sr-only" onChange={handleFileUpload} accept=".mp4" disabled={isLoading} />
                </label>
              </div>
              <p className="text-xs text-gray-500">{videoUrl ? 'Upload complete!' : 'MP4 up to 500MB'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving Chapter...' : 'Add Chapter'}
        </Button>
      </div>
    </form>
  );
};

export default ChapterForm;