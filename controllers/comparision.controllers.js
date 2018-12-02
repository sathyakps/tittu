var cex = require('./cex.controllers');
var koinex = require('./koinex.controllers');
var coindelta = require('./coindelta.controllers');
var bitbns = require('./bitbns.controllers');
var wazirx = require('./wazirx.controllers');
var coindcx = require('./coindcx.controllers');
var _ = require('lodash');
var update = require('../utils/emitters');

exports.compareCoin = async () => {
	var messageString = ``;
	var allcoins = [
		...(await cex.getAllCoins()),
		...(await koinex.getAllCoins()),
		...(await coindelta.getAllCoins()),
		...(await bitbns.getAllCoins()),
		...(await coindcx.getAllCoins())

	];
	var uniqueCoins = _.uniq(_.map(allcoins, 'coin'));
	for (let index = 0; index < uniqueCoins.length; index++) {
		const element = uniqueCoins[index];
		var allExchangeCoin = _.filter(allcoins, { coin: element });
		if (allExchangeCoin.length > 1) {
			var minimumBuy = _.minBy(allExchangeCoin, 'buy');
			var maximumSell = _.maxBy(allExchangeCoin, 'sell');
			if (
				maximumSell.sell > minimumBuy.buy &&
				Number(((maximumSell.sell - minimumBuy.buy) / minimumBuy.buy) * 100).toFixed(2) >= 4
			) {
				var temp = {};
				temp['buyExchange'] = minimumBuy.market;
				temp['sellExchange'] = maximumSell.market;
				temp['buyCurrency'] = minimumBuy.coin || 'INR';
				temp['sellCurrency'] = 'INR';
				temp['buyPrice'] = minimumBuy.buy;
				temp['sellPrice'] = maximumSell.sell;
				temp['profit'] = `${Number(maximumSell.sell - minimumBuy.buy).toFixed(2)} (${(
					(Number(maximumSell.sell - minimumBuy.buy).toFixed(2) / minimumBuy.buy) *
					100
				).toFixed(2)}%)`;
				temp['id'] =
					temp['buyExchange'] +
					':' +
					temp['sellExchange'] +
					':' +
					temp['buyCurrency'] +
					':' +
					temp['sellCurrency'];
				temp['updatedAt'] = new Date();
				update.updateNewMessage.next(temp);
			}
		}
	}
};

// exports.compareCoin();
