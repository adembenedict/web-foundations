# School Database System Design

## Table Explanations

- **`students`**: Stores core biographical and contact information for each student enrolled in the institution. It contains a unique auto-incrementing primary key (`id`), the student's full name, and a unique `email` to prevent duplicate student profiles.
- **`courses`**: Maintains the catalog of available academic subjects offered by the university. It includes a primary key (`id`), the descriptive course title, and a unique course code (e.g., `CS101`).
- **`enrolments`**: A junction (join) table that resolves the relational bridge between students and courses. It stores foreign keys referencing both `students(id)` and `courses(id)`, alongside an attribute (`grade`) specific to that exact student-course pairing.

## Relationships & Architecture

- **Relationships**:
  - The relationship between `students` and `courses` is **many-to-many**. A single student can enroll in multiple courses, and a single course can have many students enrolled in it.
- **Why a Join Table is Needed**: Relational databases cannot store multi-valued attributes (lists of courses inside a student row, or lists of students inside a course row) atomically. To normalize the data and prevent redundancy, a join table (`enrolments`) is introduced. It breaks the many-to-many relationship down into two manageable **one-to-many** relationships: one student connects to many enrolment records, and one course connects to many enrolment records. Additionally, the join table acts as the ideal home for relationship-specific metadata, such as the `grade` earned.

## Recommended Index

- **Index**: `CREATE INDEX idx_enrolments_student ON enrolments(student_id);`
- **Reason**: In a school administration system, frequent lookups are performed to retrieve all courses, transcripts, and GPA summaries for individual students. Adding an index on `student_id` in the `enrolments` table drastically accelerates search queries filtering by student without requiring full table scans.

## SQL vs. NoSQL Justification

For a school management and academic tracking system, choosing a relational database (**SQL**) is significantly better than a NoSQL document store. Academic data is highly structured, relational, and requires strict integrity constraints—such as ensuring that foreign keys in the `enrolments` table point to valid, existing students and courses, and enforcing unique constraints on student emails. SQL databases natively support complex relational joins, aggregations (`GROUP BY`), and ACID transactions, which are essential for maintaining accurate transcripts, preventing orphan records, and auditing student grades reliably.
