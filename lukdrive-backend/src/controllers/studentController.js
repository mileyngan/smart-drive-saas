const supabase = require('../config/database');

/**
 * @desc    Get the student's enrolled program details
 * @route   GET /api/student/program
 * @access  Private (Student)
 */
exports.getEnrolledProgram = async (req, res) => {
    const studentId = req.user.id;

    try {
        const { data: enrollment, error: enrollmentError } = await supabase
            .from('student_enrollments')
            .select(`
                *,
                program:programs(*)
            `)
            .eq('student_id', studentId)
            .eq('status', 'active')
            .single();

        if (enrollmentError) {
            // If no active enrollment is found, single() returns an error.
            // We can treat this as a "not found" case.
            return res.status(404).json({ message: 'No active program enrollment found for this student.' });
        }

        res.status(200).json(enrollment.program);
    } catch (error) {
        console.error('Error fetching enrolled program:', error);
        res.status(500).json({ message: 'Server error while fetching enrolled program.' });
    }
};

/**
 * @desc    Get all chapters for the student's program, including progress
 * @route   GET /api/student/chapters
 * @access  Private (Student)
 */
exports.getChapters = async (req, res) => {
    const studentId = req.user.id;

    try {
        // First, find the student's active program
        const { data: enrollment, error: enrollmentError } = await supabase
            .from('student_enrollments')
            .select('program_id')
            .eq('student_id', studentId)
            .eq('status', 'active')
            .single();

        if (enrollmentError || !enrollment) {
            return res.status(404).json({ message: 'No active program enrollment found.' });
        }

        // Then, fetch all chapters for that program and join with the student's progress
        const { data: chapters, error: chaptersError } = await supabase
            .from('chapters')
            .select(`
                *,
                student_progress(
                    ebook_completed,
                    video_completed,
                    quiz_score,
                    practical_completed
                )
            `)
            .eq('program_id', enrollment.program_id)
            .eq('student_progress.student_id', studentId)
            .order('chapter_number', { ascending: true });

        if (chaptersError) throw chaptersError;

        res.status(200).json(chapters);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ message: 'Server error while fetching chapters.' });
    }
};

/**
 * @desc    Update the student's progress on a chapter
 * @route   POST /api/student/progress
 * @access  Private (Student)
 */
exports.updateProgress = async (req, res) => {
    const studentId = req.user.id;
    const { chapter_id, ebook_completed, video_completed } = req.body;

    if (!chapter_id) {
        return res.status(400).json({ message: 'Chapter ID is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('student_progress')
            .upsert({
                student_id: studentId,
                chapter_id: chapter_id,
                ebook_completed: ebook_completed,
                video_completed: video_completed,
            }, {
                onConflict: 'student_id, chapter_id'
            })
            .select()
            .single();

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: 'Server error while updating progress.' });
    }
};


/**
 * @desc    Get dashboard data for the logged-in student
 * @route   GET /api/student/dashboard
 * @access  Private (Student)
 */
exports.getStudentDashboard = async (req, res) => {
     const studentId = req.user.id;

    try {
        const { data: enrollment, error: enrollmentError } = await supabase
            .from('student_enrollments')
            .select(`
                status,
                program:programs(name, total_chapters)
            `)
            .eq('student_id', studentId)
            .eq('status', 'active')
            .single();

        if (enrollmentError || !enrollment) {
            return res.status(404).json({ message: 'No active enrollment found.' });
        }

        const { count: completedChapters, error: progressError } = await supabase
            .from('student_progress')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', studentId)
            .eq('ebook_completed', true)
            .eq('video_completed', true)
            .not('quiz_score', 'is', null);

        if (progressError) throw progressError;

        const totalChapters = enrollment.program.total_chapters;
        const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

        res.status(200).json({
            programName: enrollment.program.name,
            progressPercentage,
            completedChapters,
            totalChapters,
        });

    } catch (error) {
        console.error('Error fetching student dashboard:', error);
        res.status(500).json({ message: 'Server error while fetching student dashboard.' });
    }
};

/**
 * @desc    Get the quiz for a specific chapter
 * @route   GET /api/student/chapter/:chapterId/quiz
 * @access  Private (Student)
 */
exports.getQuiz = async (req, res) => {
    const { chapterId } = req.params;

    try {
        const { data: quiz, error } = await supabase
            .from('quizzes')
            .select('id, questions, passing_score')
            .eq('chapter_id', chapterId)
            .single();

        if (error || !quiz) {
            return res.status(404).json({ message: 'No quiz found for this chapter.' });
        }

        // We don't want to send the correct answers to the client
        const questionsForStudent = quiz.questions.map(({ question, options }) => ({
            question,
            options,
        }));

        res.status(200).json({ ...quiz, questions: questionsForStudent });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Server error while fetching quiz.' });
    }
};

/**
 * @desc    Submit quiz answers and get results
 * @route   POST /api/student/quiz/submit
 * @access  Private (Student)
 */
exports.submitQuiz = async (req, res) => {
    const { chapterId, answers } = req.body;
    const studentId = req.user.id;

    if (!chapterId || !answers) {
        return res.status(400).json({ message: 'Chapter ID and answers are required.' });
    }

    try {
        // 1. Get the correct answers from the database
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select('questions, passing_score')
            .eq('chapter_id', chapterId)
            .single();

        if (quizError || !quiz) {
            return res.status(404).json({ message: 'Quiz data not found.' });
        }

        // 2. Calculate the score
        let correctCount = 0;
        quiz.questions.forEach((question, index) => {
            if (answers[index] && answers[index] === question.correct_answer) {
                correctCount++;
            }
        });
        const score = Math.round((correctCount / quiz.questions.length) * 100);

        // 3. Update student progress
        const { error: progressError } = await supabase
            .from('student_progress')
            .upsert({
                student_id: studentId,
                chapter_id: chapterId,
                quiz_score: score,
                // quiz_attempts: increment attempt count - requires fetching first, simplifying for now
            }, { onConflict: 'student_id, chapter_id' });

        if (progressError) throw progressError;

        // 4. Return results
        res.status(200).json({
            score,
            passed: score >= quiz.passing_score,
            message: 'Quiz submitted successfully.'
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ message: 'Server error while submitting quiz.' });
    }
};