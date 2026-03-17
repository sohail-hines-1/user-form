import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/users', usersRouter); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
