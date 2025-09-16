import React from 'react';
import YoutubeEmbed from './YoutubeEmbed';
import { FaDownload } from 'react-icons/fa';

const Lecture = ({ lecture }) => {
    return (
        <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Lecture {String(lecture.id).padStart(2, '0')}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                        {lecture.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                        {lecture.description}
                    </p>
                    <button 
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300"
                        onClick={() => window.open(lecture.materialUrl, '_blank')}
                    >
                        <FaDownload className="mr-2" />
                        Reference Material
                    </button>
                </div>
                <div className="flex justify-center items-start w-full">
                    <div className="relative w-full aspect-video">
                        <YoutubeEmbed 
                            embedId={lecture.videoId}
                            lessonTitle={lecture.title}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lecture;
