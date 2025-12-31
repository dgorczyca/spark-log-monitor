import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://127.0.0.1:3001/api/sections';
const LOG_FILE = process.env.LOG_FILE_PATH || './app.log';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runVerification() {
    console.log('Starting verification...');

    // Clear log file
    fs.writeFileSync(LOG_FILE, '');

    // 1. Create a section
    console.log('Creating section...');
    const rule = 'Event Occurred';
    const sectionRes = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Event Rule', rule: rule })
    });

    if (!sectionRes.ok) {
        console.error('Failed to create section');
        return;
    }
    const section = await sectionRes.json();
    console.log('Section created:', section);

    // 2. Append log 1: ... set to A
    console.log('Appending Log 1 (A)...');
    fs.appendFileSync(LOG_FILE, `2025-31-12 12:00:00 ${rule}, setting was set to A\n`);
    await sleep(2000);

    // Check API - Should have 1 match (A)
    let sections = await (await fetch(API_URL)).json();
    let matches = sections.find((s: any) => s.id === section.id).matches;
    console.log('Matches after Log 1:', matches.length);
    if (matches.length !== 1 || !matches[0].value.includes('setting was set to A')) {
        console.error('FAILURE: Expected 1 match with A');
    }

    const firstMatchId = matches[0].id;
    const firstMatchTime = matches[0].last_seen_at;

    // 3. Append log 2: ... set to A (Identical content after rule)
    console.log('Appending Log 2 (A - Identical)...');
    fs.appendFileSync(LOG_FILE, `2025-31-12 13:00:00 ${rule}, setting was set to A\n`);
    await sleep(2000);

    // Check API - Should still have 1 match (A), but updated time
    sections = await (await fetch(API_URL)).json();
    matches = sections.find((s: any) => s.id === section.id).matches;
    console.log('Matches after Log 2:', matches.length);

    if (matches.length !== 1) {
        console.error('FAILURE: Expected still 1 match');
    } else if (matches[0].id !== firstMatchId) {
        console.error('FAILURE: Match ID changed (should be same)');
    } else if (new Date(matches[0].last_seen_at) <= new Date(firstMatchTime)) {
        console.error('FAILURE: last_seen_at not updated');
    } else {
        console.log('SUCCESS: Match A updated correctly');
    }

    // 4. Append log 3: ... set to B
    console.log('Appending Log 3 (B)...');
    fs.appendFileSync(LOG_FILE, `2025-31-12 14:00:00 ${rule}, setting was set to B\n`);
    await sleep(2000);

    // Check API - Should have 2 matches (B, A)
    sections = await (await fetch(API_URL)).json();
    matches = sections.find((s: any) => s.id === section.id).matches;
    console.log('Matches after Log 3:', matches.length);

    if (matches.length !== 2) {
        console.error('FAILURE: Expected 2 matches');
    } else if (!matches[0].value.includes('setting was set to B')) {
        console.error('FAILURE: Most recent match should be B');
    } else {
        console.log('SUCCESS: Match B added');
    }

    // 5. Append log 4: ... set to A (New occurrence of A)
    console.log('Appending Log 4 (A - New)...');
    fs.appendFileSync(LOG_FILE, `2025-31-12 15:00:00 ${rule}, setting was set to A\n`);
    await sleep(2000);

    // Check API - Should have 3 matches (A, B, A)
    // Note: The API returns last 3 matches by default in db.ts
    sections = await (await fetch(API_URL)).json();
    matches = sections.find((s: any) => s.id === section.id).matches;
    console.log('Matches after Log 4:', matches.length);

    if (matches.length !== 3) {
        console.error('FAILURE: Expected 3 matches');
    } else if (!matches[0].value.includes('setting was set to A')) {
        console.error('FAILURE: Most recent match should be A');
    } else if (!matches[1].value.includes('setting was set to B')) {
        console.error('FAILURE: Second match should be B');
    } else if (!matches[2].value.includes('setting was set to A')) {
        console.error('FAILURE: Third match should be A');
    } else {
        console.log('SUCCESS: New Match A added correctly');
    }
}

runVerification();
