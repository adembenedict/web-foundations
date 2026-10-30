-- Enable foreign key constraints in SQLite
PRAGMA foreign_keys = ON;

-- 1. DROP EXISTING TABLES IF RE-RUNNING
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;

-- 2. CREATE TABLES
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE
);

CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 3. INSERT SAMPLE DATA
-- Inserting 4 students (Diana has no enrolments to test LEFT JOIN)
INSERT INTO students (name, email) VALUES 
('Alice Smith', 'alice.smith@university.edu'),
('Bob Jones', 'bob.jones@university.edu'),
('Charlie Brown', 'charlie.brown@university.edu'),
('Diana Prince', 'diana.prince@university.edu');

-- Inserting 3 courses
INSERT INTO courses (title, code) VALUES 
('Introduction to Computer Science', 'CS101'),
('Data Structures and Algorithms', 'CS201'),
('Database Management Systems', 'CS301');

-- Inserting 5 enrolments (linking students to courses with grades)
INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'A'),
(1, 2, 'B+'),
(2, 1, 'B'),
(2, 3, 'A-'),
(3, 2, 'C+');

-- ==========================================
-- 4. THE FIVE REQUIRED QUERIES
-- ==========================================

-- Query 1: All courses for one student (by name, e.g., 'Alice Smith')
SELECT 
    s.name AS student_name,
    c.title AS course_title,
    c.code AS course_code,
    e.grade
FROM enrolments e
JOIN students s ON e.student_id = s.id
JOIN courses c ON e.course_id = c.id
WHERE s.name = 'Alice Smith';

-- Query 2: All students on one course (e.g., course code 'CS101')
SELECT 
    c.title AS course_title,
    s.name AS student_name,
    s.email AS student_email,
    e.grade
FROM enrolments e
JOIN students s ON e.student_id = s.id
JOIN courses c ON e.course_id = c.id
WHERE c.code = 'CS101';

-- Query 3: The number of students per course (using LEFT JOIN and GROUP BY)
SELECT 
    c.code AS course_code,
    c.title AS course_title,
    COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.id = e.course_id
GROUP BY c.id, c.code, c.title;

-- Query 4: Students who have no enrolments (using LEFT JOIN)
SELECT 
    s.id,
    s.name,
    s.email
FROM students s
LEFT JOIN enrolments e ON s.id = e.student_id
WHERE e.student_id IS NULL;

-- Query 5: Update one enrolment's grade (e.g., Alice's grade in CS101)
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 1 AND course_id = 1;

-- Verify the update
SELECT s.name, c.code, e.grade 
FROM enrolments e 
JOIN students s ON e.student_id = s.id 
JOIN courses s ON e.course_id = s.id -- alias check
JOIN courses c ON e.course_id = c.id
WHERE e.student_id = 1 AND e.course_id = 1;