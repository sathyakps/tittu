const axios = require('axios');
var _ = require('lodash');
const cex = axios.create({
	baseURL: 'https://cex.io/api/tickers/'
});

exports.getAllCoins = async () => {
	var finalData = [];
	try {
		var response = await cex.get('/USD/EUR/BTC');
		var allData = response.data.data;
		for (let index = 0; index < allData.length; index++) {
			const element = allData[index];
			var sellCoin = element['pair'].split(':')[1];
			var buyCoin = element['pair'].split(':')[0];
			var temp = {};
			temp['market'] = 'CEX';
			temp.last = element['last'];
			temp.sell = Number(element['bid']);
			temp.buy = Number(element['ask']);
			temp.exchange = sellCoin;
			temp.coin = buyCoin;
			finalData.push(temp);
		}
		return finalData;
	} catch (error) {}
};

// exports.getAllCoins();
