import express from "express";
import cors from "cors";
import path from 'path';
import 'dotenv/config';
import helmet from 'helmet';
import screenshotRouter from './routes/screenshot.route.js';

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// Helmet configuration
app.use(helmet());

// API routes - fixed mounting
app.use("/api/screenshot", screenshotRouter);  // Added full path here

// Static files for production
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));