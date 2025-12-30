import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'rootpassword',
    database: 'log_monitor'
};

async function migrate() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        console.log('Adding last_seen_at column to matches table...');
        try {
            await connection.query(`ALTER TABLE matches ADD COLUMN last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
            console.log('Column added successfully.');
        } catch (error: any) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('Column already exists.');
            } else {
                throw error;
            }
        }

        // Also need to update existing records to have last_seen_at = first_seen_at if needed, 
        // but DEFAULT CURRENT_TIMESTAMP handles new ones. 
        // For existing, it might be null if I didn't set default? 
        // My ALTER statement sets default.

        await connection.end();
        console.log('Migration complete.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrate();
