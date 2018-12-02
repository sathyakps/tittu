const axios = require('axios');
var _ = require('lodash');

var coinDCX = axios.create({
	baseURL: 'https://api.coindcx.com/exchange/ticker'
});

exports.getAllCoins = async () => {
	try {
		var response = await coinDCX.get();
		var data = response.data;
		var allCoins = _.filter(data, d => d.market.includes('INR') && !d.market.includes('insta'));
		var finalData = [];
		for (let index = 0; index < allCoins.length; index++) {
			const element = allCoins[index];
			var temp = {};
			temp['market'] = 'CoinDCX';
			temp.last = Number(element['last_price']);
			temp.sell = Number(element['bid']);
			temp.buy = Number(element['ask']);
			temp.coin = String(element['market']).slice(0, element['market'].indexOf('INR'));
			temp['buyCurrency'] = 'INR';
			finalData.push(temp);
		}
		return finalData;
	} catch (error) {
		return [];
	}
};

exports.getInternationalMarkets = async () => {
	try {
		var response = await coinDCX.get();
		var data = response.data;
		var allCoinsBTC = _.filter(
			data,
			d => !d.market.includes('ETHBTC') && !d.market.includes('BTCETH') && !d.market.includes('insta')
		);
		var finalData = [];
		for (let index = 0; index < allCoinsBTC.length; index++) {
			const element = allCoinsBTC[index];
			if (element['market'].includes('BTC') > 0) {
				var temp = {};
				temp['market'] = 'CoinDCX';
				temp.last = Number(element['last_price']);
				temp.sell = Number(element['bid']);
				temp.buy = Number(element['ask']);
				temp.coin = String(element['market']).slice(0, element['market'].indexOf('BTC'));
				temp['buyCurrency'] = element['market'].slice(element['market'].indexOf('BTC'));
				finalData.push(temp);
			} else if (element['market'].includes('ETH') > 0) {
				var temp = {};
				temp['market'] = 'CoinDCX';
				temp.last = Number(element['last_price']);
				temp.sell = Number(element['bid']);
				temp.buy = Number(element['ask']);
				temp.coin = String(element['market']).slice(0, element['market'].indexOf('ETH'));
				temp['buyCurrency'] = element['market'].slice(element['market'].indexOf('ETH'));
				finalData.push(temp);
			}
		}
		return finalData;
	} catch (error) {
		console.log(error);
		return [];
	}
};

// exports.getInternationalMarkets();
