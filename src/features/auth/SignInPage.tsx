import { useState, type FormEvent } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { Alert, Button, Link, Stack, TextField } from '@mui/material';
import { useAuth } from '../../app/AuthContext';
import { getErrorMessage } from '../../lib/api';
import AuthLayout from './AuthLayout';

export default function SignInPage() {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | string[] | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/tasks" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(username.trim(), password);
      navigate('/tasks', { replace: true });
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue managing your tasks.">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{Array.isArray(error) ? error.join(', ') : error}</Alert>}
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required autoFocus fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required fullWidth />
          <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
          <Link component={RouterLink} to="/signup" underline="hover" textAlign="center">Don't have an account? Sign up</Link>
        </Stack>
      </form>
    </AuthLayout>
  );
}
