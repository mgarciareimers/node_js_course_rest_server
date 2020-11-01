const express = require('express');
const app = express();
 
app.get('/', function (req, res) {
  res.json('Hello World');
})
 
app.listen(3000, () => console.log('Listening port:', 3000));