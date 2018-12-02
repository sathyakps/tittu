const axios = require('axios');
var _ = require('lodash');

var binance = axios.create({
	baseURL: 'https://api.binance.com/'
});

exports.getAllCoins = async () => {
	try {
		var allData = await binance.get('/api/v1/ticker/24hr');
		var finalData = [];

		for (let index = 0; index < allData.data.length; index++) {
			const element = allData.data[index];
			var temp = {};
			if (element['symbol'].includes('BTC') && element['symbol'].indexOf('BTC') > 0) {
				var coinIndex = element['symbol'].indexOf('BTC');
				var buyCoin = element['symbol'].slice(0, coinIndex);
				var sellCoin = element['symbol'].slice(coinIndex);
				temp['market'] = 'BINANCE';
				temp.sell = Number(element['bidPrice']);
				temp.buy = Number(element['askPrice']);
				temp.exchange = sellCoin;
				temp.coin = buyCoin;
				finalData.push(temp);
			} else if (element['symbol'].includes('ETH') && element['symbol'].indexOf('ETH') > 0) {
				var coinIndex = element['symbol'].indexOf('ETH');
				var buyCoin = element['symbol'].slice(0, coinIndex);
				var sellCoin = element['symbol'].slice(coinIndex);
				temp['market'] = 'BINANCE';
				temp.sell = Number(element['bidPrice']);
				temp.buy = Number(element['askPrice']);
				temp.exchange = sellCoin;
				temp.coin = buyCoin;
				finalData.push(temp);
			} else if (element['symbol'].includes('USDT') && element['symbol'].indexOf('USDT') > 0) {
				var coinIndex = element['symbol'].indexOf('USDT');
				var buyCoin = element['symbol'].slice(0, coinIndex);
				var sellCoin = element['symbol'].slice(coinIndex);
				temp['market'] = 'BINANCE';
				temp.sell = Number(element['bidPrice']);
				temp.buy = Number(element['askPrice']);
				temp.exchange = sellCoin;
				temp.coin = buyCoin;
				finalData.push(temp);
			}
		}
		return finalData;
	} catch (error) {
		return [];
	}
};

// exports.getAllCoins();
