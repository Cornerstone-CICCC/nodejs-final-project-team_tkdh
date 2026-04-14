import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

app.use((req: Request, res: Response) => {
  res.status(404).send('Invalid route.');
});

const PORT = process.env.BACKEND_PORT;
if (!PORT) {
  throw new Error('Missing backend port!');
}
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
