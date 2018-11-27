const axios = require('axios');
var currencyConvertor = require('../utils/currency-convertor');
const cex = axios.create({
	baseURL: 'https://cex.io/api/tickers/'
});

exports.getAllCoins = async () => {
	try {
		var response = await cex.get('/USD/EUR');
		var allData = response.data.data;
		var forexRate = await currencyConvertor.getForexRate();
		for (let index = 0; index < allData.length; index++) {
			const element = allData[index];
			element['market'] = 'CEX.IO';
			delete element['timestamp'];
			if (element.pair.includes('EUR')) {
				element.last = Number((Number(element.last) * 1.1 * forexRate.EUR).toFixed(2));
				element.sell = Number((Number(element.bid) * 1.1 * forexRate.EUR).toFixed(2));
				element.buy = Number((Number(element.ask) * 1.1 * forexRate.EUR).toFixed(2));
				delete element['volume'];
				delete element['volume30d'];
				delete element['high'];
				delete element['low'];
				element.coin = element.pair.split(':')[0];
				delete element['pair'];
				element['buyCurrency'] = 'EURO';
			} else if (element.pair.includes('USD')) {
				element.last = Number((Number(element.last) * 1.1 * forexRate.USD).toFixed(2));
				element.sell = Number((Number(element.bid) * 1.1 * forexRate.USD).toFixed(2));
				element.buy = Number((Number(element.ask) * 1.1 * forexRate.USD).toFixed(2));
				delete element['volume'];
				delete element['volume30d'];
				delete element['high'];
				delete element['low'];
				element.coin = element.pair.split(':')[0];
				delete element['pair'];
				element['buyCurrency'] = 'USD';
			}
			delete element['bid'];
			delete element['ask'];
		}
		return allData;
	} catch (error) {
		return [];
	}
};

exports.getAllCoins();
