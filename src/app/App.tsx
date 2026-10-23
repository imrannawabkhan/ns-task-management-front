import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SignInPage from '../features/auth/SignInPage';
import SignUpPage from '../features/auth/SignUpPage';
import TasksPage from '../features/tasks/TasksPage';
import CreateTaskPage from '../features/tasks/CreateTaskPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={localStorage.getItem('accessToken') ? '/tasks' : '/signin'} replace />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/create" element={<CreateTaskPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
