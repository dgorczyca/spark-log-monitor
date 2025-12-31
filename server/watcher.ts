import chokidar from 'chokidar';
import fs from 'fs';
import { getAllSections, addMatch } from './db';
import dotenv from 'dotenv';

dotenv.config();

const LOG_FILE = process.env.LOG_FILE_PATH || './app.log'; // Configurable

export const startWatcher = () => {
    // Ensure log file exists
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, '');
    }

    const watcher = chokidar.watch(LOG_FILE, {
        persistent: true,
        usePolling: true // Better for some file systems
    });

    let fileSize = fs.statSync(LOG_FILE).size;

    watcher.on('change', async (path) => {
        const newStat = fs.statSync(path);
        const newSize = newStat.size;

        if (newSize > fileSize) {
            const stream = fs.createReadStream(path, {
                start: fileSize,
                end: newSize
            });

            fileSize = newSize;

            stream.on('data', async (chunk) => {
                const lines = chunk.toString().split('\n');
                const sections = await getAllSections();

                for (const line of lines) {
                    if (!line.trim()) continue;

                    for (const section of sections) {
                        const matchIndex = line.indexOf(section.rule);
                        if (matchIndex !== -1) {
                            // Extract content starting from the rule match
                            const content = line.substring(matchIndex).trim();
                            await addMatch(section.id, content);
                        }
                    }
                }
            });
        } else if (newSize < fileSize) {
            // File truncated
            fileSize = newSize;
        }
    });

    console.log(`Watching ${LOG_FILE} for changes...`);
};
