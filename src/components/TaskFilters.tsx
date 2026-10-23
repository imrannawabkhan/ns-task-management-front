import { useEffect, useState } from 'react';
import { FormControl, InputAdornment, MenuItem, Select, Stack, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskStatus } from '../types';

export interface Filters { status: TaskStatus | ''; search: string }

export default function TaskFilters({ value, onChange }: { value: Filters; onChange: (filters: Filters) => void }) {
  const [search, setSearch] = useState(value.search);

  useEffect(() => {
    setSearch(value.search);
  }, [value.search]);

  useEffect(() => {
    const timer = window.setTimeout(() => onChange({ ...value, search }), 350);
    return () => window.clearTimeout(timer);
  // value.status is intentionally included so the current status is retained during search updates.
  }, [search, value.status]);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
      <TextField
        fullWidth
        size="small"
        value={search}
        placeholder="Search tasks…"
        inputProps={{ 'aria-label': 'Search tasks' }}
        onChange={(event) => setSearch(event.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
      />
      <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 190 } }}>
        <Select
          aria-label="Filter tasks by status"
          value={value.status}
          onChange={(event) => onChange({ ...value, status: event.target.value as TaskStatus | '' })}
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="OPEN">Open</MenuItem>
          <MenuItem value="IN_PROGRESS">In progress</MenuItem>
          <MenuItem value="DONE">Done</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
