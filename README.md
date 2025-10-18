# Natee Tracker - Productivity & Expense Tracking App

A complete SvelteKit application with Supabase integration for tracking expenses, managing todos, and using the Pomodoro technique.

## Features

- **Authentication**: User registration, login, and logout with Supabase Auth
- **Expense Tracker**: Add, edit, delete, and categorize expenses with monthly totals
- **To-Do List**: Manage tasks with filtering (all, active, completed) and completion tracking
- **Pomodoro Timer**: Focus sessions with customizable work/break durations and session tracking
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **Real-time Data**: All data synced with Supabase database

## Tech Stack

- **Framework**: SvelteKit
- **Styling**: Tailwind CSS + shadcn/ui
- **Database & Auth**: Supabase
- **State Management**: Svelte stores
- **Icons**: Lucide Svelte

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd natee-tracker
bun install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create the following tables in your Supabase database:

#### Table: `expenses`
```sql
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);
```

#### Table: `todos`
```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);
```

#### Table: `pomodoro_sessions`
```sql
CREATE TABLE pomodoro_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  focus_minutes INTEGER NOT NULL,
  break_minutes INTEGER NOT NULL,
  completed_sessions INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own pomodoro sessions" ON pomodoro_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pomodoro sessions" ON pomodoro_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the Application

```bash
bun run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Expense Tracker**: Add expenses with categories, amounts, and dates. View monthly totals
3. **To-Do List**: Create tasks, mark them as complete, and filter by status
4. **Pomodoro Timer**: Start focus sessions, customize durations, and track daily progress

## Project Structure

```
src/
├── lib/
│   ├── supabaseClient.js          # Supabase client configuration
│   ├── stores/                    # Svelte stores for state management
│   │   ├── userStore.js          # Authentication state
│   │   ├── expenseStore.ts       # Expense data management
│   │   ├── todoStore.ts          # Todo data management
│   │   └── pomodoroStore.ts      # Pomodoro timer state
│   └── components/               # Reusable UI components
│       ├── Navbar.svelte         # Navigation component
│       ├── ExpenseTracker.svelte # Expense management UI
│       ├── TodoList.svelte       # Todo management UI
│       └── PomodoroTimer.svelte  # Pomodoro timer UI
├── routes/
│   ├── +layout.svelte            # Main layout with auth logic
│   ├── +page.svelte              # Dashboard/home page
│   ├── auth/                     # Authentication pages
│   │   ├── login/+page.svelte   # Login form
│   │   └── register/+page.svelte # Registration form
│   ├── expense/+page.svelte      # Expense tracker page
│   ├── todo/+page.svelte         # Todo list page
│   └── pomodoro/+page.svelte     # Pomodoro timer page
└── app.css                       # Global styles
```

## Features in Detail

### Authentication
- Email/password registration and login
- Automatic session management
- Protected routes with redirects
- Logout functionality

### Expense Tracker
- Add expenses with name, category, amount, and date
- Edit and delete existing expenses
- Monthly total calculation
- Category-based organization
- Responsive expense list

### To-Do List
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Filter by status (all, active, completed)
- Clear completed tasks
- Task completion statistics

### Pomodoro Timer
- 25-minute work sessions with 5-minute breaks (customizable)
- Start, pause, and reset functionality
- Visual progress indicator
- Session tracking and statistics
- Settings panel for custom durations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.