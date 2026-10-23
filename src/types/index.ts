export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string | number;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface SignInResponse {
  accessToken: string;
  username: string;
}

export interface ApiErrorBody {
  message?: string | string[];
  statusCode?: number;
}
