-- LukDrive Database Schema
-- Version 1.0

-- Enable RLS for all tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

--
-- USERS
-- All users of the platform (SuperAdmins, School Admins, Instructors, Students)
--
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin', 'instructor', 'student')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

--
-- SCHOOLS
-- Driving schools registered on the platform
--
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_info TEXT,
    ministry_code VARCHAR(255) UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approval_date TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add foreign key constraint from users to schools after schools table is created
-- ALTER TABLE users ADD CONSTRAINT fk_school FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL;

--
-- SUBSCRIPTIONS
-- Subscription details for each school
--
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID UNIQUE NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'basic', 'pro', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
    trial_ends_at TIMESTAMPTZ,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);


--
-- PROGRAMS
-- Driving programs offered by schools (e.g., Novice, Accelerated)
--
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    license_type TEXT NOT NULL DEFAULT 'B',
    price NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

--
-- CHAPTERS
-- Individual chapters within a program
--
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    ebook_content_url TEXT, -- URL to PDF/text content in Supabase Storage
    video_lesson_url TEXT,  -- URL to MP4 video in Supabase Storage
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(program_id, chapter_number)
);

--
-- QUIZZES
-- Quizzes associated with each chapter
--
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID UNIQUE NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    pass_threshold NUMERIC(3, 2) NOT NULL DEFAULT 0.80, -- 80%
    created_at TIMESTAMPTZ DEFAULT now()
);

--
-- QUESTIONS
-- Questions for each quiz
--
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- e.g., [{"text": "Option A", "is_correct": false}, {"text": "Option B", "is_correct": true}]
    created_at TIMESTAMPTZ DEFAULT now()
);

--
-- INSTRUCTOR_ASSIGNMENTS
-- Linking table for instructors and the students they are assigned to
--
CREATE TABLE instructor_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(instructor_id, student_id)
);

--
-- STUDENT_PROGRESS
-- Tracks a student's progress through each chapter
--
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    ebook_completed BOOLEAN DEFAULT false,
    video_completed BOOLEAN DEFAULT false,
    quiz_score NUMERIC(5, 2),
    quiz_passed BOOLEAN DEFAULT false,
    practical_tasks_completed BOOLEAN DEFAULT false,
    instructor_notes TEXT,
    last_accessed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, chapter_id)
);

--
-- OTP_TOKENS
-- Stores one-time passwords for verification
--
CREATE TABLE otp_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add some basic indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_schools_ministry_code ON schools(ministry_code);
--
-- STUDENT_ENROLLMENTS
-- Links students to the programs they are enrolled in.
--
CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped_out')),
    UNIQUE(student_id, program_id) -- A student can't be enrolled in the same program twice at the same time if status is active
);


CREATE INDEX idx_student_progress_student_chapter ON student_progress(student_id, chapter_id);
CREATE INDEX idx_instructor_assignments_instructor_student ON instructor_assignments(instructor_id, student_id);
CREATE INDEX idx_student_enrollments_student_program ON student_enrollments(student_id, program_id);