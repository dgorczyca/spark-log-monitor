import mysql from 'mysql2/promise';

const dbConfig = {
    host: '127.0.0.1',
    user: 'root', // Default, should be configured via env
    password: 'rootpassword', // Default
    database: 'log_monitor'
};

let pool: mysql.Pool;

export const initDb = async () => {
    try {
        // Create database if not exists
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
        await connection.end();

        // Create pool
        pool = mysql.createPool(dbConfig);

        // Create tables
        await pool.query(`
      CREATE TABLE IF NOT EXISTS sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rule VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_id INT NOT NULL,
        value TEXT NOT NULL,
        first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS span_rules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        starts_with VARCHAR(255) NOT NULL,
        followed_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
      )
    `);

        console.log('Database initialized');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
};

export const getSections = async () => {
    const [rows] = await pool.query('SELECT * FROM sections');
    const sections = rows as any[];

    // For each section, get the last 3 matches and span rules
    const results = await Promise.all(sections.map(async (section) => {
        const [matches] = await pool.query(
            'SELECT * FROM matches WHERE section_id = ? ORDER BY last_seen_at DESC LIMIT 3',
            [section.id]
        );
        const [spanRules] = await pool.query(
            'SELECT * FROM span_rules WHERE section_id = ?',
            [section.id]
        );
        return { ...section, matches, span_rules: spanRules };
    }));

    return results;
};

export const addSection = async (name: string, rule: string) => {
    const [result] = await pool.query('INSERT INTO sections (name, rule) VALUES (?, ?)', [name, rule]);
    return (result as any).insertId;
};

export const addSpanRule = async (sectionId: number, name: string, startsWith: string, followedBy: string) => {
    const [result] = await pool.query(
        'INSERT INTO span_rules (section_id, name, starts_with, followed_by) VALUES (?, ?, ?, ?)',
        [sectionId, name, startsWith, followedBy]
    );
    return (result as any).insertId;
};

export const deleteSpanRule = async (id: number) => {
    await pool.query('DELETE FROM span_rules WHERE id = ?', [id]);
};

export const addMatch = async (sectionId: number, value: string) => {
    // Check the MOST RECENT match for this section
    const [rows] = await pool.query(
        'SELECT id, value FROM matches WHERE section_id = ? ORDER BY last_seen_at DESC LIMIT 1',
        [sectionId]
    );
    const matches = rows as any[];

    if (matches.length > 0 && matches[0].value === value) {
        // If the most recent match has the same value, update its last_seen_at
        await pool.query('UPDATE matches SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ?', [matches[0].id]);
    } else {
        // Otherwise (no matches or different value), insert a new match
        await pool.query('INSERT INTO matches (section_id, value, first_seen_at, last_seen_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)', [sectionId, value]);
    }
};

export const getAllSections = async () => {
    if (!pool) return [];
    const [rows] = await pool.query('SELECT * FROM sections');
    return rows as any[];
};
