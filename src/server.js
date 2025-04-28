const express = require('express')
const db = require('./db');

const app = express()
const port = 3000

app.use(express.json());


app.get('/', (req, res) => {
  res.json({"message": "Hello World!"})
})

app.listen(port, () => {
  console.log(`Trending Hashtag Service app listening on port ${port}`)
})
