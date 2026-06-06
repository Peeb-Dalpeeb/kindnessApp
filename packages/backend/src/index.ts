import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { greetUser, UserSchema } from '@kindness/shared';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/users', (req, res) => {
  const parseResult = UserSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.flatten() });
    return;
  }

  const user = parseResult.data;
  const message = greetUser(user);

  res.status(201).json({
    message,
    user,
  });
});

app.listen(port, () => {
  console.log(`[server]: Backend API running on http://localhost:${port}`);
});
