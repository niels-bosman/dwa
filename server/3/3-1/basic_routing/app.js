const express = require('express');
const app     = express();

app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.post('/', (req, res) => {
  res.json('Got a POST request');
});

app.put('/user', (req, res) => {
  res.json('Got a PUT request at /user');
});

app.delete('/user', (req, res) => {
  res.json('Got a DELETE request at /user');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});