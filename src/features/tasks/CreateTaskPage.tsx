import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { createTask } from "./tasks.api";
import { getErrorMessage } from "../../lib/api";

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | string[] | null>(null);
  const mutation = useMutation({
    mutationFn: () => createTask(title, description),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate("/tasks");
    },
    onError: (reason) => setError(getErrorMessage(reason)),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    mutation.mutate();
  }

  return (
    <Box minHeight="100vh" py={{ xs: 3, sm: 6 }}>
      <Container maxWidth="sm">
        <Button
          component={RouterLink}
          to="/tasks"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{ mb: 2 }}
        >
          Back to tasks
        </Button>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2.5, sm: 4 }, borderColor: "#e4e7ec" }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight={800}
            letterSpacing="-0.04em"
          >
            Create a task
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Add the details now. You can update the status as work progresses.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {error && (
                <Alert severity="error">
                  {Array.isArray(error) ? error.join(", ") : error}
                </Alert>
              )}
              <TextField
                label="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                autoFocus
                fullWidth
                inputProps={{ maxLength: 200 }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                multiline
                minRows={5}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={mutation.isPending || !title.trim()}
              >
                {mutation.isPending ? "Creating…" : "Create task"}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
