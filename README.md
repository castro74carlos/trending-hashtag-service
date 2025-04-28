# trending-hashtag-service
Service that tracks trending hashtags.

## Technologies Used
- Backend: Node.js, Express
- Database: SQLite3
- Job Queue: BullMQ, Redis

## How to run:

1. Clone repo from github
2. Navigate to resulting directory `trending-hashtag-service`
3. Install Node dependencies from root of project:
    `npm i`
4. Start application: `npm start`

## API Specs

### Create Tweet

**POST /tweet**

- Register a tweet with the trending hashtags service.

**Request Body**
```json
{
    "tweet": "<tweet>"
}
```

**Example**
```bash
curl -i -XPOST "http://localhost:8080/tweet" -H "Content-type: application/json" -d "{ \"tweet\": \"Today is the 30 year anniversary of UNLV winning the national championship. Vegas was still a small town back then and as a kid growing up there nothing was bigger than the Runnin' Rebels. Still think this is the best college basketball team ever. #UNLV #Baskeball\" }"             
```

### Trending Hashtags

**GET /trending-hashtags**

- Returns up to 25 most trending hashtags in descending order of popularity.

**Response Body**
```json
{
    "hashtags" : ["<hashtag1>", "<hashtag2>", "...", "<hashtag25>"]
}
```

**Example**
```bash
curl "localhost:8080/trending-hashtags"           
```
