var arbiration = require('./controllers/comparision.controllers');
console.log('Starting APP');
setInterval(() => {
	arbiration.compareCoin();
}, 120000);

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
