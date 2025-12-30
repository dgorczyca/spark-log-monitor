import express from 'express';
import cors from 'cors';
import { initDb, getSections, addSection } from './db';
import { startWatcher } from './watcher';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize DB
initDb();

// Start Log Watcher
startWatcher();

// API Routes
app.get('/api/sections', async (req, res) => {
    try {
        const sections = await getSections();
        res.json(sections);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sections' });
    }
});

app.post('/api/sections', async (req, res) => {
    const { name, rule } = req.body;
    if (!name || !rule) {
        return res.status(400).json({ error: 'Name and rule are required' });
    }
    try {
        const id = await addSection(name, rule);
        res.status(201).json({ id, name, rule });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create section' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
