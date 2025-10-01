import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { Trash2, PlusCircle } from 'lucide-react';

const QuizEditorModal = ({ initialQuestions, onSave, isLoading, chapterTitle }) => {
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        // Deep copy to prevent modifying the original array
        setQuestions(JSON.parse(JSON.stringify(initialQuestions || [])));
        setTitle(`Quiz for: ${chapterTitle}`);
    }, [initialQuestions, chapterTitle]);

    const handleQuestionChange = (qIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correct_answer = value;
        setQuestions(newQuestions);
    };

    const removeQuestion = (qIndex) => {
        const newQuestions = questions.filter((_, index) => index !== qIndex);
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { question: '', options: ['', '', '', ''], correct_answer: '' },
        ]);
    };

    return (
        <div className="space-y-6">
            <Input
                id="quiz_title"
                name="quiz_title"
                label="Quiz Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
            />

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Question {qIndex + 1}</h3>
                            <Button variant="danger" size="sm" onClick={() => removeQuestion(qIndex)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <textarea
                            className="w-full p-2 border rounded"
                            rows="2"
                            placeholder="Question Text"
                            value={q.question}
                            onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                        />
                        {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    className="flex-grow p-2 border rounded"
                                    placeholder={`Option ${oIndex + 1}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                />
                                <input
                                    type="radio"
                                    name={`correct_answer_${qIndex}`}
                                    checked={q.correct_answer === opt}
                                    onChange={() => handleCorrectAnswerChange(qIndex, opt)}
                                    title="Set as correct answer"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Button variant="secondary" onClick={addQuestion} className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Question
            </Button>

            <div className="flex justify-end pt-4">
                <Button onClick={() => onSave({ title, questions })} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Quiz'}
                </Button>
            </div>
        </div>
    );
};

export default QuizEditorModal;