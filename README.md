<<<<<<< HEAD
# Python Voice Assistant with Vapi Integration

A voice assistant that listens for a wake word, connects to the Vapi service for conversation, and manages its state between idle and chatting.

## Features

- Wake word detection ("Hey", "Oye").
- Two states: `idle` (listening for wake word) and `chatting` (connected to Vapi).
- Automatic connection to Vapi on wake word detection.
- Disconnection from Vapi after a period of inactivity.

## Requirements

- `speechrecognition`
- `pyaudio`
- `vapi`

## Development Plan (To-Do)

- [ ] Setup project structure.
- [ ] Create `main.py` with the main application logic.
- [ ] Implement the `idle` state with wake word detection using `speechrecognition`.
- [ ] Implement the `chatting` state with Vapi integration.
- [ ] Implement state transitions between `idle` and `chatting`.
- [ ] Add error handling.
- [ ] (Optional) Add configuration for Vapi API keys.
- [ ] (Optional) Implement a timeout to disconnect from Vapi and return to the `idle` state.

## Usage

1. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the application:
   ```bash
   python main.py
   ```
"# python-assistant" 
=======
# 🌟 Nepali LMS with AI & VAPI Integration

A modern **Learning Management System (LMS)** built with **Next.js**, **VAPI**, and **AI integration** to help students in **Nepal** learn topics they are interested in.  
The platform provides **realistic learning experiences** through **experience notes**, **flashcards**, and **exams**, while keeping education **affordable**.

---

## 🚀 Features

- **AI-powered Learning**: Generate personalized learning materials (notes, flashcards, exams) tailored to student interests.  
- **Experience Notes**: Create interactive notes simulating real-life learning.  
- **Flashcards & Exams**: AI-generated flashcards and practice exams to reinforce learning.  
- **Affordable Pricing**: Designed for Nepali students with accessible subscription plans.  
- **Nepal-focused Content**: Learning materials relevant to Nepal’s curriculum and context.  

---

## 🛠 Tech Stack

- **Frontend:** Next.js, React  
- **Backend:** Supabase (PostgreSQL), Node.js  
- **AI Integration:** VAPI + AI models for content generation  
- **Authentication:** Supabase Auth  
- **Database:** PostgreSQL (Supabase managed)  

---

## 🗄 Database Structure (Simplified)

| Table | Description |
|-------|-------------|
| **users** | Stores user info, subscription plan, and limits on AI edits. |
| **teachers** | Stores teacher profiles, subject, topic, lesson plan, and style. |
| **notes** | Student notes linked to teachers. |
| **flashcard_decks** | Collections of AI-generated flashcards per user and teacher. |
| **flashcards** | Individual flashcards within a deck. |
| **exams** | AI-generated exams by teachers. |
| **exam_attempts** | Students’ attempts, answers, scores, and graded results. |
| **bookmarked_teachers** | Students can bookmark favorite teachers. |
| **session_history** | Tracks interactions between students and teachers. |

> All tables include timestamps for creation and updates for tracking progress.

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nepali-lms-ai.git
cd nepali-lms-ai
Clone the repository

git clone https://github.com/yourusername/nepali-lms-ai.git
cd nepali-lms-ai


Install dependencies

npm install

```
Setup environment variables

```.env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
VAPI_KEY=your_vapi_key
```

Run the development server

```bash
npm run dev
```

Open `http://localhost:3000`
 to view the app.

Exporting Supabase Database Schema

Since Supabase CLI may require Docker, the simplest way to export your schema is via pg_dump:

```bash
pg_dump --schema-only --no-owner --file=schema.sql \
"postgres://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME"
```

Replace DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME with your Supabase credentials.

<details> <summary>SQL Schema</summary>


```sql
-- ===============================================
-- Table: users
-- Stores information about students
-- ===============================================
CREATE TABLE public.users (
    id character varying NOT NULL,
    name character varying,
    email character varying NOT NULL UNIQUE,
    plan character varying DEFAULT 'free'::character varying,
    duration double precision DEFAULT 60,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    avatar_url text,
    remaining_instances integer NOT NULL DEFAULT 3 CHECK (remaining_instances >= 0),
    remaining_chat_instances integer,
    no_of_exams_limit integer DEFAULT 5,
    flashcard_ai_edits_limit integer DEFAULT 10,
    notes_ai_edits_limit integer DEFAULT 10,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- ===============================================
-- Table: teachers
-- Stores information about teachers
-- ===============================================
CREATE TABLE public.teachers (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp without time zone DEFAULT now(),
    name character varying,
    subject character varying,
    topic character varying,
    style character varying,
    voice character varying,
    duration bigint,
    author character varying,
    lesson_plan text,
    CONSTRAINT teachers_pkey PRIMARY KEY (id)
);

-- ===============================================
-- Table: bookmarked_teachers
-- Stores which teachers a user has bookmarked
-- ===============================================
CREATE TABLE public.bookmarked_teachers (
    user_id text NOT NULL,
    teacher_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT bookmarked_teachers_pkey PRIMARY KEY (user_id, teacher_id),
    CONSTRAINT bookmarked_teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
    CONSTRAINT bookmarked_teachers_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);

-- ===============================================
-- Table: notes
-- Stores user notes linked to teachers
-- ===============================================
CREATE TABLE public.notes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id text NOT NULL,
    teacher_id uuid NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notes_pkey PRIMARY KEY (id),
    CONSTRAINT notes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
    CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- ===============================================
-- Table: flashcard_decks
-- Stores collections of flashcards per user
-- ===============================================
CREATE TABLE public.flashcard_decks (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id text NOT NULL,
    teacher_id uuid NOT NULL,
    title text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT flashcard_decks_pkey PRIMARY KEY (id),
    CONSTRAINT flashcard_decks_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id),
    CONSTRAINT flashcard_decks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- ===============================================
-- Table: flashcards
-- Stores individual flashcards within a deck
-- ===============================================
CREATE TABLE public.flashcards (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    deck_id uuid NOT NULL,
    front_content text NOT NULL,
    back_content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT flashcards_pkey PRIMARY KEY (id),
    CONSTRAINT flashcards_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.flashcard_decks(id)
);

-- ===============================================
-- Table: exams
-- Stores AI-generated exams by teachers
-- ===============================================
CREATE TABLE public.exams (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    teacher_id uuid NOT NULL,
    title text NOT NULL,
    questions jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT exams_pkey PRIMARY KEY (id),
    CONSTRAINT exams_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);

-- ===============================================
-- Table: exam_attempts
-- Stores users’ exam attempts
-- ===============================================
CREATE TABLE public.exam_attempts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    exam_id uuid NOT NULL,
    user_id text NOT NULL,
    answers jsonb NOT NULL,
    score integer,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    graded_answers jsonb,
    CONSTRAINT exam_attempts_pkey PRIMARY KEY (id),
    CONSTRAINT exam_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
    CONSTRAINT exam_attempts_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id)
);

-- ===============================================
-- Table: session_history
-- Tracks student-teacher interactions
-- ===============================================
CREATE TABLE public.session_history (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id character varying,
    teacher_id uuid DEFAULT gen_random_uuid(),
    summary text,
    CONSTRAINT session_history_pkey PRIMARY KEY (id),
    CONSTRAINT session_history_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);

```


</details>

<details> <summary>SQL Schema Visual</summary>

<img width="1607" height="847" alt="supabase-schema-xebyebqboerrhijkpvxb (4)" src="https://github.com/user-attachments/assets/43b1fa7e-ceb8-48eb-8b72-4081e0615e38" />
</details>
License

MIT License

>>>>>>> 63a31a3ba2c5a846988c0309e87f4f037651f3df
