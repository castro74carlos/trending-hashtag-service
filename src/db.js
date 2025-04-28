const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/trending-hashtag-service.sqlite', (err) => {
    if (err) {
        console.error('Unable to connect to db', err);
    } else {
        console.log('Connected to SQLite database for trending-hashtag-service');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS tweets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash TEXT NOT NULL UNIQUE
    )
`);



module.exports = db;