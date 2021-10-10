const express = require('express');
const app     = express();

let nRequests = 0;

app.get('/', (req, res) => {
  nRequests++;
  res.send(`Hello World! Amount of requests: ${nRequests}`);
  console.log(req.headers['user-agent']);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));