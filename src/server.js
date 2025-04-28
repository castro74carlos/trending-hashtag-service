const express = require('express')
const db = require('./db');
const tweetQueue = require('./queue');

const app = express()
const port = 8080

app.use(express.json());

db.createTables();

app.get('/', (req, res) => {
  res.status(200).json({ message: "" })
  const { name } = req.query;

  tweetQueue.add('workerHelloWorld', { name: name});
});

app.post('/tweet', async (req, res) => {
  const { tweet } = req.body;
  
  try {
    if (tweet) {
    // Attempt to persist tweet  
    await db.saveTweet(tweet);

    res.status(201).json({ message: "Tweet has been registered." });

    // Call worker job to process hashtags
    tweetQueue.add('processHashtagsForTweet', { tweet: tweet });

    } else {
      res.status(400).json({ message: "Invalid value for property \'tweet\'." });
    }
  } catch (err) {
    res.status(404).json({ message: `Error registering tweet, ${err.message}` });
  }
});

app.listen(port, () => {
  console.log(`Trending Hashtag Service app listening on port: ${port}`);
});
