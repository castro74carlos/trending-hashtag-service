const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const db = new sqlite3.Database('./db/trending-hashtag-service.sqlite', (err) => {
    if (err) {
        console.error('Unable to connect to db', err);
    } else {
        console.log('Connected to SQLite database for trending-hashtag-service');
    }
});

const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const createTables = async () => {
    await createTweetsTable();
    await createHashtagsTable();
};

const createTweetsTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS tweets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash TEXT NOT NULL UNIQUE
    )`;

    try {
         await runQuery(query);
         console.log('Created \'tweets\' table or it already exists');
    } catch (err) {
        console.error('Error creating \'tweets\' table', err);
    }
};

const createHashtagsTable = async () => {
    const createQuery = `CREATE TABLE IF NOT EXISTS hashtags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hashtag TEXT NOT NULL UNIQUE,
        instances INTEGER NOT NULL
    )`;
    
    const indexQuery = 'CREATE INDEX IF NOT EXISTS idx_instances ON hashtags (instances)';

    try {
         await runQuery(createQuery);
         await runQuery(indexQuery);
         console.log('Created \'hashtags\' table or it already exists');
    } catch (err) {
        console.error('Error creating \'hashtags\' table', err);
    }
};

const saveTweet = async (tweet) => {
    const hash = crypto.createHash('sha256')
                        .update(tweet)
                        .digest('latin1');
    const query = 'INSERT INTO tweets (hash) VALUES (?)';

    try {
        await runQuery(query, [hash]);
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            throw new Error('Tweet already exists.');
        } else {
            throw new Error(err.message);
        }
    }
};

const upsertHashtags = async (hashtags) => {
    if (!hashtags.length) return;

    await runQuery('BEGIN TRANSACTION');
    try {
        const query = `INSERT INTO hashtags (hashtag, instances) VALUES (?, 1)
                        ON CONFLICT(hashtag) DO UPDATE SET instances = instances + 1`;

        await Promise.all(hashtags.map( hashtag => {
            runQuery(query, [hashtag]);
        }));

        await runQuery('COMMIT');
    } catch (err) {
        await runQuery('ROLLBACK');
        console.error('Error upserting hashtags', err);
        throw err;
    }
};

const fetchTrendingHashtags = async () => {
    const query = `SELECT hashtag FROM hashtags
                    ORDER BY instances DESC
                    LIMIT 25`;
    
    try {
        const result = await runQuery(query);
        return result.map(row => row.hashtag);
    } catch (err) {
        throw err;
    }
};


module.exports = {
    createTables,
    saveTweet,
    upsertHashtags,
    fetchTrendingHashtags
};