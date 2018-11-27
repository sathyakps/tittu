const axios = require('axios');
var _ = require('lodash');

var bitbns = axios.create({
	baseURL: 'https://bitbns.com/order/getTickerWithVolume/'
});

exports.getAllCoins = async () => {
	try {
		var response = await bitbns.get();
		var data = response.data;
		var allCoins = Object.keys(response.data);
		var finalData = [];

		for (let index = 0; index < allCoins.length; index++) {
			const element = allCoins[index];
			var temp = {};
			temp['market'] = 'BITBNS';
			temp.last = Number(data[element]['last_traded_price']);
			temp.sell = Number(data[element]['highest_buy_bid']);
			temp.buy = Number(data[element]['lowest_sell_bid']);
			temp.coin = element;
			temp['buyCurrency'] = 'INR';
			finalData.push(temp);
		}
		return finalData;
	} catch (error) {
		return [];
	}
};
