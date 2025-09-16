import React from 'react';
import YoutubeEmbed from './YoutubeEmbed';

const LessonCard = ({ eid, title, description, date, pdfLink, quizLink }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-gray-500 text-sm">Published on: {date}</p>
      
      <div className="mt-4">
        <YoutubeEmbed embedId={eid} lessonTitle={title} />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <a href={pdfLink} className="text-blue-600 underline" download>
          Download PDF
        </a>
        <a 
          href={quizLink} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Take Quiz
        </a>
      </div>
    </div>
  );
};

export default LessonCard;
