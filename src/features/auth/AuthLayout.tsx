import type { ReactNode } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';

export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <Box className="auth-background">
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={0} className="auth-card">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <Box className="brand-mark"><TaskAltRoundedIcon /></Box>
            <Typography variant="h6" fontWeight={800}>Taskflow</Typography>
          </Box>
          <Typography variant="h4" component="h1" fontWeight={800} letterSpacing="-0.04em">{title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>{subtitle}</Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
