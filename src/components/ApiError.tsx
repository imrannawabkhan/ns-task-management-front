import { Alert, AlertTitle } from '@mui/material';

export default function ApiError({ message }: { message: string | string[] }) {
  return (
    <Alert severity="error" sx={{ mb: 2, alignItems: 'flex-start' }}>
      <AlertTitle>Something went wrong</AlertTitle>
      {Array.isArray(message) ? (
        <ul className="error-list">{message.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
      ) : message}
    </Alert>
  );
}
