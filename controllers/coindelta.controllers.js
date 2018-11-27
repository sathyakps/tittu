const axios = require('axios');
var _ = require('lodash');

var bitbns = axios.create({
	baseURL: 'https://api.coindelta.com/api/v2/public/pricetickers/'
});

exports.getAllCoins = async () => {
	try {
		var response = await bitbns.get();
		var data = response.data;
		var allCoins = Object.keys(response.data).filter(key => key.includes('INR'));
		var finalData = [];

		for (let index = 0; index < allCoins.length; index++) {
			const element = allCoins[index];
			var temp = {};
			temp['market'] = 'Coin Delta';
			temp.last = Number(data[element]['last']);
			temp.sell = Number(data[element]['highestBid']);
			temp.buy = Number(data[element]['lowestAsk']);
			temp.coin = element.split('_')[1];
			temp['buyCurrency'] = 'INR';
			finalData.push(temp);
		}
		return finalData;
	} catch (error) {
		return [];
	}
};
