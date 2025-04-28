const { Worker } = require('bullmq');
const connection = { host: 'localhost', port: 6379 };

const worker = new Worker('tweetQueue', async job => {
    if (job.name === 'workerHelloWorld') {
        const { name } = job.data;
        console.log(`Hello from the worker, ${name}`)
    }
    
    if (job.name === 'processHashtagsForTweet') {
        
    }
}, { connection });

worker.on('completed', job => {
    console.log(`Completed job ${job.id}`)
});

worker.on('failed', job => {
    console.error(`Failed to process job ${job.id}`)
});