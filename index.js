var arbiration = require('./controllers/comparision.controllers');
var international = require('./controllers/international/international.comparision.controllers');
var tittu = require('./utils/telegram');
var scheduler = require('./utils/scheduler');

console.log('Starting APP');

 setInterval(() => {
 	arbiration.compareCoin();
 	// international.compareCoin();
 }, 60000);

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!' + new Date().toLocaleTimeString() + '(' + new Date().getTimezoneOffset() + ')');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
