const { Queue } = require('bullmq');
const connection = { host: 'localhost', port: 6379 };

const tweetQueue = new Queue('tweetQueue', { connection });

console.log('Queue: \'tweetQueue\' is now listening...')

module.exports = tweetQueue;