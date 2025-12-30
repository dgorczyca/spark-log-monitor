// import fetch from 'node-fetch'; // Built-in in Node 18+
import fs from 'fs';

const API_URL = 'http://localhost:3001/api/sections';
const LOG_FILE = './app.log';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runVerification() {
    console.log('Starting verification...');

    // 1. Create a section
    console.log('Creating section...');
    const sectionRes = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Error', rule: 'test_error' })
    });

    if (!sectionRes.ok) {
        console.error('Failed to create section');
        return;
    }
    const section = await sectionRes.json();
    console.log('Section created:', section);

    // 2. Append log 1
    console.log('Appending "test_error 1"...');
    fs.appendFileSync(LOG_FILE, `[INFO] test_error 1\n`);
    await sleep(2000); // Wait for watcher

    // 3. Check API
    let sections = await (await fetch(API_URL)).json();
    let match1 = sections.find((s: any) => s.id === section.id).matches[0];
    console.log('Match 1 (First):', match1);

    // 4. Append log 1 again
    console.log('Appending "test_error 1" again...');
    fs.appendFileSync(LOG_FILE, `[INFO] test_error 1\n`);
    await sleep(2000);

    // 5. Check API
    sections = await (await fetch(API_URL)).json();
    let match1_updated = sections.find((s: any) => s.id === section.id).matches[0];
    console.log('Match 1 (Updated):', match1_updated);

    if (new Date(match1_updated.last_seen_at) > new Date(match1.last_seen_at)) {
        console.log('SUCCESS: last_seen_at updated');
    } else {
        console.error('FAILURE: last_seen_at not updated');
    }

    // 6. Append log 2
    console.log('Appending "test_error 2"...');
    fs.appendFileSync(LOG_FILE, `[INFO] test_error 2\n`);
    await sleep(2000);

    // 7. Check API ordering
    sections = await (await fetch(API_URL)).json();
    const matches = sections.find((s: any) => s.id === section.id).matches;
    console.log('Matches:', matches);

    if (matches[0].value.includes('test_error 2')) {
        console.log('SUCCESS: Most recent match is at the top');
    } else {
        console.error('FAILURE: Ordering incorrect');
    }
}

runVerification();
