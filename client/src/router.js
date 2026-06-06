import { BookOpen, Building2, LayoutDashboard, Users } from 'lucide-react';

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
  {
    path: '/departments',
    label: 'Departments',
    icon: Building2,
    page: 'departments',
  },
  {
    path: '/users',
    label: 'Users',
    icon: Users,
    page: 'users_view',
  },
];

export const authRoutes = [
  {
    path: '/login',
    label: 'Login',
  },
];

export const appRoutes = adminRoutes;
