import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Courses from './pages/courses/Courses';
import Departments from './pages/departments/Departments';
import Employees from './pages/employees/employees_view';
import Users from './pages/users/users_view';
import Login from './pages/auth/login';

function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/dashboard" />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Navigate replace to="/login" />} path="/signup" />
      <Route element={<AdminLayout />}>
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<Courses />} path="/courses" />
        <Route element={<Departments />} path="/departments" />
        <Route element={<Users />} path="/users" />
        <Route element={<Employees />} path="/employees" />
      </Route>
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
}

export default App;
