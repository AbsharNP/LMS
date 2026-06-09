import { BookOpen, Building2, IdCardLanyard, LayoutDashboard, Users } from 'lucide-react';

export const adminRoutes = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    page: 'dashboard',
    section: 'Main',
  },
  {
    path: '/courses',
    label: 'Courses',
    icon: BookOpen,
    page: 'courses',
    section: 'Data Management',
  },
  {
    path: '/departments',
    label: 'Departments',
    icon: Building2,
    page: 'departments',
    section: 'Data Management',
  },
  {
    path: '/employees',
    label: 'Employees',
    icon: IdCardLanyard,
    page: 'courses',
    section: 'Data Management',
  },
  {
    path: '/users',
    label: 'Users',
    icon: Users,
    page: 'users_view',
    section: 'Settings',
  },
];

export const authRoutes = [
  {
    path: '/login',
    label: 'Login',
  },
];

export const appRoutes = adminRoutes;
