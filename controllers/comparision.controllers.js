var cex = require('./cex.controllers');
var koinex = require('./koinex.controllers');
var coindelta = require('./coindelta.controllers');
var bitbns = require('./bitbns.controllers');
var _ = require('lodash');
var tittu = require('../utils/telegram').bot;

exports.compareCoin = async () => {
	var messageString = ``;
	var allcoins = [
		...(await cex.getAllCoins()),
		...(await koinex.getAllCoins()),
		...(await coindelta.getAllCoins()),
		...(await bitbns.getAllCoins())
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
				messageString += `
				*********** Trade Oppurtunity ***********
				
				Coin	           : ${maximumSell.coin}
				Buy Exch    : ${minimumBuy.market}
				Sell Exch    : ${maximumSell.market}
				Buy Currency  : ${minimumBuy.buyCurrency || 'INR'}
				Buy Price   : ${minimumBuy.buy}
				Sell Price   : ${maximumSell.sell}
				Profit/coin : ${Number(maximumSell.sell - minimumBuy.buy).toFixed(2)} (${(
					(Number(maximumSell.sell - minimumBuy.buy).toFixed(2) / minimumBuy.buy) *
					100
				).toFixed(2)}%)

				`;
			}
		}
	}
	if (messageString) {
		tittu.sendMessage('@TittuOfficial', messageString);
	}
};

exports.compareCoin();
