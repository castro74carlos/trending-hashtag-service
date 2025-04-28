const { Worker } = require('bullmq');
const connection = { host: 'localhost', port: 6379 };
const db = require('./db');

const worker = new Worker('tweetQueue', async job => {
    if (job.name === 'workerHelloWorld') {
        const { name } = job.data;
        console.log(`Hello from the worker, ${name}`)
    }
    
    if (job.name === 'processHashtagsForTweet') {
        const start = Date.now();
        const { tweet } = job.data;

        const hashtags = extractHashtags(tweet);

        await db.upsertHashtags(hashtags);
        const end = Date.now();
        console.log(`Job ran in ${end - start}ms.`)
    }
}, { connection });

worker.on('completed', job => {
    console.log(`Completed job ${job.id}`)
});

worker.on('failed', job => {
    console.error(`Failed to process job ${job.id}`)
});

function extractHashtags(tweet) {
    const regex = /#\w+/g;
    const hashtags = tweet.match(regex);
    return hashtags ? hashtags.map(hashtag => hashtag.toLowerCase()) : [];
}
