const axios = require('axios');
var _ = require('lodash');

var koinex = axios.create({
	baseURL: 'https://koinex.in/api/ticker'
});

exports.getAllCoins = async () => {
	try {
		var response = await koinex.get();
		var data = response.data.stats.inr;
		var allCoins = Object.keys(response.data.stats.inr);
		var finalData = [];
		for (let index = 0; index < allCoins.length; index++) {
			const element = allCoins[index];
			var temp = {};
			temp['market'] = 'Koinex';
			temp.last = Number(data[element]['last_traded_price']);
			temp.sell = Number(data[element]['highest_bid']);
			temp.buy = Number(data[element]['lowest_ask']);
			temp.coin = element;
			temp['buyCurrency'] = 'INR';
			finalData.push(temp);
		}

		return finalData;
	} catch (error) {
		return [];
	}
};
