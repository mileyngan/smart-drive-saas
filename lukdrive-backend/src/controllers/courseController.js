const supabase = require('../config/database');
const quizService = require('../services/quizService');

/**
 * @desc    Create a new course (program)
 * @route   POST /api/courses
 * @access  Private (Admin)
 */
exports.createCourse = async (req, res) => {
    const { name, license_type, description, total_chapters } = req.body;
    const school_id = req.user.school_id;

    if (!name || !description || !total_chapters) {
        return res.status(400).json({ message: 'Please provide all required fields for the course.' });
    }

    try {
        const { data, error } = await supabase
            .from('programs')
            .insert({ name, license_type, description, total_chapters, school_id })
            .select()
            .single();

        if (error) {
            // Handle duplicate course names within the same school
            if (error.code === '23505') {
                return res.status(409).json({ message: 'A course with this name already exists in your school.' });
            }
            throw error;
        }
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Server error while creating course.' });
    }
};

/**
 * @desc    Get all chapters for a specific course, including quiz status
 * @route   GET /api/courses/:courseId/chapters
 * @access  Private (Admin)
 */
exports.getChaptersByCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const { data, error } = await supabase
            .from('chapters')
            .select(`
                *,
                quizzes ( id )
            `)
            .eq('program_id', courseId)
            .order('chapter_number', { ascending: true });

        if (error) throw error;

        // Simplify the returned data structure
        const chaptersWithQuizStatus = data.map(c => ({
            ...c,
            has_quiz: c.quizzes.length > 0,
            quizzes: undefined, // remove the nested array
        }));

        res.status(200).json(chaptersWithQuizStatus);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({ message: 'Server error while fetching chapters.' });
    }
};

/**
 * @desc    Add a chapter to a course
 * @route   POST /api/courses/:courseId/chapters
 * @access  Private (Admin)
 */
exports.addChapter = async (req, res) => {
    const { courseId } = req.params;
    const { chapter_number, title, ebook_url, video_url, duration_minutes } = req.body;
    if (!chapter_number || !title || !ebook_url) {
        return res.status(400).json({ message: 'Please provide all required fields for the chapter.' });
    }
    try {
        const { data, error } = await supabase
            .from('chapters')
            .insert({ program_id: courseId, chapter_number, title, ebook_url, video_url, duration_minutes })
            .select()
            .single();

        if (error) {
            // Handle duplicate chapter numbers within the same program
            if (error.code === '23505') {
                return res.status(409).json({ message: 'A chapter with this number already exists in this course.' });
            }
            throw error;
        }
        res.status(201).json(data);
    } catch (error) {
        console.error('Error adding chapter:', error);
        res.status(500).json({ message: 'Server error while adding chapter.' });
    }
};

/**
 * @desc    Generate quiz questions from a chapter's content without saving
 * @route   POST /api/courses/quiz/generate
 * @access  Private (Admin)
 */
exports.generateQuiz = async (req, res) => {
    const { chapterId } = req.body;

    if (!chapterId) {
        return res.status(400).json({ message: 'Chapter ID is required.' });
    }

    try {
        const { data: chapter, error: chapterError } = await supabase
            .from('chapters')
            .select('ebook_content_url')
            .eq('id', chapterId)
            .single();

        if (chapterError || !chapter) {
            return res.status(404).json({ message: 'Chapter not found.' });
        }
        if (!chapter.ebook_content_url) {
            return res.status(400).json({ message: 'This chapter does not have an eBook to generate a quiz from.' });
        }

        const questions = await quizService.generateQuizFromPdfUrl(chapter.ebook_content_url);

        res.status(200).json({ questions });

    } catch (error) {
        console.error('Error in quiz generation process:', error);
        res.status(500).json({ message: error.message || 'Server error during quiz generation.' });
    }
};

/**
 * @desc    Save a quiz for a chapter
 * @route   POST /api/courses/quiz
 * @access  Private (Admin)
 */
exports.saveQuiz = async (req, res) => {
    const { chapterId, questions, title } = req.body;

    if (!chapterId || !questions || !title) {
        return res.status(400).json({ message: 'Chapter ID, title, and questions are required.' });
    }

    try {
        const { data, error } = await supabase
            .from('quizzes')
            .upsert({ chapter_id: chapterId, questions: questions, title: title }, { onConflict: 'chapter_id' })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ message: 'Quiz saved successfully!', quiz: data });

    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).json({ message: 'Server error while saving quiz.' });
    }
};