import express from 'express';
import cors from 'cors';
import { initDb, getSections, addSection, addSpanRule, deleteSpanRule } from './db';
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

app.post('/api/sections/:id/span-rules', async (req, res) => {
    const { id } = req.params;
    const { name, startsWith, followedBy } = req.body;
    if (!name || !startsWith) {
        return res.status(400).json({ error: 'Name and Starts With are required' });
    }
    try {
        const ruleId = await addSpanRule(parseInt(id), name, startsWith, followedBy);
        res.status(201).json({ id: ruleId, section_id: id, name, starts_with: startsWith, followed_by: followedBy });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create span rule' });
    }
});

app.delete('/api/span-rules/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteSpanRule(parseInt(id));
        res.status(200).json({ message: 'Span rule deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete span rule' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
