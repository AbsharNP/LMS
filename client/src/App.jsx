import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Courses from './pages/courses/Courses';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';

function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/dashboard" />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<Signup />} path="/signup" />
      <Route element={<AdminLayout />}>
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<Courses />} path="/courses" />
      </Route>
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  );
}

export default App;
