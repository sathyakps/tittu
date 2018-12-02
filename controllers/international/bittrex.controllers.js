const axios = require('axios');
var _ = require('lodash');

var binance = axios.create({
	baseURL: 'https://bittrex.com/api/v1.1/public/'
});

exports.getAllCoins = async () => {
	// console.log('sathya');
	try {
		var allData = await binance.get('/getmarketsummaries');
		var finalData = [];

		for (let index = 0; index < allData.data.result.length; index++) {
			const element = allData.data.result[index];
			var sellCoin = element['MarketName'].split('-')[0];
			var buyCoin = element['MarketName'].split('-')[1];
			var temp = {};
			temp['market'] = 'BITTREX';
			temp.last = element['Last'];
			temp.sell = Number(element['Bid']);
			temp.buy = Number(element['Ask']);
			temp.exchange = sellCoin;
			temp.coin = buyCoin;
			finalData.push(temp);
		}
		return finalData;
	} catch (error) {
		return [];
	}
};

// exports.getAllCoins();
