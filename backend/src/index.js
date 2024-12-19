import { config } from '../config/config.js';
import express from 'express';
import apiRoutes from './routes/index.js';

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const port = config.server.port;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});