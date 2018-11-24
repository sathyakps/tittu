var arbiration = require('./controllers/arbitration/price-checker.controller');
console.log('Starting APP');
setInterval(() => {
	arbiration.checkCryptoDifference();
}, 120000);
