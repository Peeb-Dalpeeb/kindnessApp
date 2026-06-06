import express from 'express';
import cors from 'cors';
import { User, ApiResponse, formatGreeting } from '@mern-monorepo/shared';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/greeting', (req, res) => {
  const name = (req.query.name as string) || 'Developer';
  const greetingMessage = formatGreeting(name);
  
  const response: ApiResponse<{ message: string }> = {
    success: true,
    data: {
      message: greetingMessage
    }
  };
  
  res.json(response);
});

app.get('/api/users', (_req, res) => {
  const users: User[] = [
    {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      createdAt: new Date().toISOString()
    }
  ];
  
  const response: ApiResponse<User[]> = {
    success: true,
    data: users
  };
  
  res.json(response);
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
