import { BookOpen, LayoutDashboard } from 'lucide-react';

export const courses = [
  {
    title: 'React Fundamentals',
    instructor: 'Aarav Mehta',
    students: 124,
    progress: 72,
    status: 'Published',
  },
  {
    title: 'Database Design',
    instructor: 'Neha Kapoor',
    students: 86,
    progress: 54,
    status: 'Review',
  },
  {
    title: 'Node API Bootcamp',
    instructor: 'Riya Sharma',
    students: 98,
    progress: 81,
    status: 'Published',
  },
];

export const adminRoutes = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    page: 'dashboard',
  },
  {
    path: '/courses',
    label: 'Courses',
    icon: BookOpen,
    page: 'courses',
  },
];

export const authRoutes = [
  {
    path: '/login',
    label: 'Login',
  },
  {
    path: '/signup',
    label: 'Signup',
  },
];

export const appRoutes = adminRoutes;
