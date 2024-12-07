import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});