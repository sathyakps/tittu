var arbiration = require('./controllers/arbitration/price-checker.controller');
console.log('Starting APP');
setInterval(() => {
	arbiration.checkCryptoDifference();
}, 120000);

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
