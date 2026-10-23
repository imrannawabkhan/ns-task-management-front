import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { getErrorMessage } from '../../lib/api';
import { useAuth } from '../../app/AuthContext';
import AuthLayout from './AuthLayout';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | string[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(username.trim(), password);
      navigate('/signin', { replace: true, state: { message: 'Account created. Please sign in.' } });
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="A clearer way to keep your work moving.">
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{Array.isArray(error) ? error.join(', ') : error}</Alert>}
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required autoFocus fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required fullWidth inputProps={{ minLength: 8 }} />
          <Typography variant="caption" color="text.secondary">Use at least 8 characters. Your backend may enforce additional password rules.</Typography>
          <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>
          <Link component={RouterLink} to="/signin" underline="hover" textAlign="center">Already registered? Sign in</Link>
        </Stack>
      </form>
    </AuthLayout>
  );
}
