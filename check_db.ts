import mysql from 'mysql2/promise';

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'rootpassword',
    database: 'log_monitor'
};

async function check() {
    console.log('Connecting to DB...');
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected!');
        const [rows] = await connection.query('SELECT 1');
        console.log('Query result:', rows);
        await connection.end();
        console.log('Disconnected.');
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
