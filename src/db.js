const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/trending-hashtag-service.sqlite', (err) => {
    if (err) {
        console.error('Unable to connect to db', err);
    } else {
        console.log('Connected to SQLite database for trending-hashtag-service');
    }
});

// TODO: Create tables here
// db.run();

module.exports = db;