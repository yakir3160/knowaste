import express from 'express';
import http from 'http';
import firebaseConfig from './firebaseConfig.js';
import { initializeApp } from 'firebase/app';

const app = express();
const firebaseApp = initializeApp(firebaseConfig);

// Middleware to parse JSON bodies
app.use(express.json());

// Proxy route to Firebase
app.post('/firebase', (req, res) => {
    const options = {
        hostname: 'your-firebase-endpoint',
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(req.body))
        }
    };

    const proxyReq = http.request(options, (proxyRes) => {
        let data = '';

        proxyRes.on('data', (chunk) => {
            data += chunk;
        });

        proxyRes.on('end', () => {
            res.status(proxyRes.statusCode).json(JSON.parse(data));
        });
    });

    proxyReq.on('error', (error) => {
        res.status(500).json({ message: error.message });
    });

    proxyReq.write(JSON.stringify(req.body));
    proxyReq.end();
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});