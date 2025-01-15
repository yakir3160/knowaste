import { config } from '../config/config.js';
import express from 'express';
import apiRoutes from './routes/index.js';
import rateLimit from 'express-rate-limit';

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
//
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 דקות
//     max: 100, // מקסימום 100 בקשות
//     message: { error: 'Too many requests, please try again later.' }
// });
//
// app.use(limiter);

app.use('/api', apiRoutes);



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const port = config.server.port;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});