import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardActions, Typography, FormControl, Select, MenuItem, IconButton, Stack, Chip, Tooltip, CircularProgress } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteTask, updateTaskStatus } from '../features/tasks/tasks.api';
import { getErrorMessage } from '../lib/api';
import type { Task, TaskStatus } from '../types';
import ApiError from './ApiError';

const statusLabel: Record<TaskStatus, string> = { OPEN: 'Open', IN_PROGRESS: 'In progress', DONE: 'Done' };
const statusColor: Record<TaskStatus, 'default' | 'info' | 'success'> = { OPEN: 'default', IN_PROGRESS: 'info', DONE: 'success' };

export default function TaskCard({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | string[] | null>(null);
  const updateMutation = useMutation({
    mutationFn: (status: TaskStatus) => updateTaskStatus(task.id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (reason) => setError(getErrorMessage(reason)),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (reason) => setError(getErrorMessage(reason)),
  });

  return (
    <Card variant="outlined" sx={{ borderColor: '#e4e7ec', boxShadow: '0 2px 6px rgba(16,24,40,.025)' }}>
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
          <Typography variant="h6" component="h2" sx={{ fontSize: '1.05rem', fontWeight: 700, overflowWrap: 'anywhere' }}>{task.title}</Typography>
          <Chip size="small" color={statusColor[task.status]} label={statusLabel[task.status] ?? task.status} />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {task.description || 'No description provided.'}
        </Typography>
        {error && <ApiError message={error} />}
      </CardContent>
      <CardActions sx={{ px: 2, pb: 1.5, justifyContent: 'space-between' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            aria-label={`Status for ${task.title}`}
            value={task.status}
            disabled={updateMutation.isPending}
            onChange={(event) => { setError(null); updateMutation.mutate(event.target.value as TaskStatus); }}
          >
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="IN_PROGRESS">In progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Delete task">
          <span>
            <IconButton aria-label={`Delete ${task.title}`} color="error" disabled={deleteMutation.isPending} onClick={() => {
              if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
                setError(null);
                deleteMutation.mutate();
              }
            }}>
              {deleteMutation.isPending ? <CircularProgress size={20} /> : <DeleteOutlineIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
