const axios = require('axios');
var _ = require('lodash');

var wazirx = axios.create({
	baseURL: 'https://api.wazirx.com/api/v2/tickers'
});

exports.getAllCoins = async () => {
	try {
		var response = await wazirx.get();
		var data = response.data;
		var allINRMarket = _.filter(Object.keys(data), a => a.includes('inr'));
		var finalData = [];
		for (let index = 0; index < allINRMarket.length; index++) {
			const element = allINRMarket[index];
			var temp = {};
			temp['market'] = 'Wazirx';
			temp.last = Number(data[element]['last']);
			temp.sell = Number(data[element]['buy']);
			temp.buy = Number(data[element]['sell']);
			temp.coin = String(data[element]['base_unit']).toLocaleUpperCase();
			temp['buyCurrency'] = 'INR';
			finalData.push(temp);
		}
		return finalData;
	} catch (error) {
		console.log(error);
		return [];
	}
};
