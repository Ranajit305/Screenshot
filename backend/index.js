import express from "express";
import cors from "cors";
import path from 'path';

import screenshotRouter from './routes/screenshot.route.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", screenshotRouter);

const __dirname = path.resolve();

if (process.env.NODE === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    })
}

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));