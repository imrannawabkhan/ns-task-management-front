import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { useAuth } from "../../app/AuthContext";
import TaskFilters, { type Filters } from "../../components/TaskFilters";
import TaskCard from "../../components/TaskCard";
import { fetchTasks } from "./tasks.api";
import { getErrorMessage } from "../../lib/api";

export default function TasksPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { username, signOut } = useAuth();
  const [filters, setFilters] = useState<Filters>({ status: "", search: "" });
  const tasksQuery = useQuery({
    queryKey: ["tasks", filters.status, filters.search],
    queryFn: () => fetchTasks(filters),
  });
  const [signOutError, setSignOutError] = useState<string | null>(null);

  function handleSignOut() {
    signOut();
    queryClient.clear();
    navigate("/signin", { replace: true });
  }

  return (
    <Box minHeight="100vh">
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid #e4e7ec",
          bgcolor: "rgba(255,255,255,.92)",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1120,
            width: "100%",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            gap: 1.5,
          }}
        >
          <Box className="brand-mark">
            <TaskAltRoundedIcon />
          </Box>
          <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
            Taskflow
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {username ? `Signed in as ${username}` : "Your workspace"}
          </Typography>
          <IconButton aria-label="Sign out" onClick={handleSignOut}>
            <LogoutRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={800}
              letterSpacing="-0.04em"
            >
              Get things done.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              A focused view of everything on your plate.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => navigate("/tasks/create")}
            size="large"
          >
            Create task
          </Button>
        </Stack>

        <TaskFilters value={filters} onChange={setFilters} />
        {signOutError && (
          <Alert severity="error" onClose={() => setSignOutError(null)}>
            {signOutError}
          </Alert>
        )}
        {tasksQuery.isPending && (
          <Box className="center-state">
            <CircularProgress />
            <Typography color="text.secondary">Loading your tasks…</Typography>
          </Box>
        )}
        {tasksQuery.isError && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => tasksQuery.refetch()}
              >
                Retry
              </Button>
            }
          >
            {getErrorMessage(tasksQuery.error) instanceof Array
              ? (getErrorMessage(tasksQuery.error) as string[]).join(", ")
              : (getErrorMessage(tasksQuery.error) as string)}
          </Alert>
        )}
        {tasksQuery.isSuccess && tasksQuery.data.length === 0 && (
          <Box className="empty-state">
            <Box className="empty-icon">
              <TaskAltRoundedIcon />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              {filters.search || filters.status
                ? "No matching tasks"
                : "Nothing on your list yet"}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
              {filters.search || filters.status
                ? "Try changing your filters."
                : "Create your first task to get started."}
            </Typography>
            {!filters.search && !filters.status && (
              <Button
                variant="outlined"
                onClick={() => navigate("/tasks/create")}
              >
                Create your first task
              </Button>
            )}
          </Box>
        )}
        {tasksQuery.data && tasksQuery.data.length > 0 && (
          <Stack spacing={1.5}>
            {tasksQuery.data.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
