import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import studentService from '../../services/student.service';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { Clock } from 'lucide-react';

const QuizInterface = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const queryClient = useQueryClient();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(null);

    const { data: quiz, isLoading } = useQuery({
        queryKey: ['quiz', chapterId],
        queryFn: () => studentService.getQuiz(chapterId, token).then(res => res.data),
        enabled: !!token,
    });

    const submissionMutation = useMutation({
        mutationFn: (submissionData) => studentService.submitQuiz(submissionData, token),
        onSuccess: (response) => {
            setResult(response.data);
            setShowResult(true);
            // Invalidate queries to refetch program progress and chapter list
            queryClient.invalidateQueries(['studentChapters']);
            queryClient.invalidateQueries(['studentDashboard']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to submit quiz.');
        }
    });

    useEffect(() => {
        if (timeLeft > 0 && !showResult) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showResult) {
            handleSubmitQuiz();
        }
    }, [timeLeft, showResult]);

    const handleAnswerSelect = (questionIndex, answer) => {
        setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
    };

    const handleSubmitQuiz = () => {
        submissionMutation.mutate({ chapterId, answers: selectedAnswers });
    };

    if (isLoading) return <div>Loading Quiz...</div>;
    if (!quiz || !quiz.questions) return <div>Quiz not found for this chapter.</div>;

    const currentQuestion = quiz.questions[currentQuestionIndex];

    if (showResult && result) {
        return (
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <p className="text-4xl font-bold mb-2" style={{ color: result.passed ? 'green' : 'red' }}>
                    {result.score}%
                </p>
                <p className="text-gray-600 mb-6">{result.passed ? "Congratulations, you've passed!" : "You didn't pass this time. Please review the chapter and try again."}</p>
                <Button onClick={() => navigate('/student/program')}>
                    {result.passed ? 'Continue to Next Chapter' : 'Back to Program'}
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Chapter Quiz</h1>
                <div className="flex items-center text-red-500 font-semibold">
                    <Clock className="mr-2" />
                    <span>{Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <p className="text-gray-600">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                    <h2 className="text-xl font-semibold mt-2">{currentQuestion.question}</h2>
                </div>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                            className={`block w-full text-left p-4 rounded-lg border-2 transition-all ${
                                selectedAnswers[currentQuestionIndex] === option
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex justify-between">
                    <Button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>
                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                        <Button onClick={handleSubmitQuiz} disabled={submissionMutation.isPending}>
                            {submissionMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                    ) : (
                        <Button onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}>
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizInterface;