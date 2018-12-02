var binance = require('./binance.controllers');
var bittrex = require('./bittrex.controllers');
var cex = require('./cex.controllers');
var coindcx = require('../coindcx.controllers');
var update = require('../../utils/emitters');
var _ = require('lodash');
exports.compareCoin = async () => {
	try {
		var messageString = ``;
		var allcoins = [
			...(await binance.getAllCoins()),
			...(await bittrex.getAllCoins()),
			...(await cex.getAllCoins()),
			...(await coindcx.getInternationalMarkets())
		];
		var uniqExchange = _.uniq(_.map(allcoins, 'exchange'));
		for (let index = 0; index < uniqExchange.length; index++) {
			const exchange = uniqExchange[index];
			var allExchangeCoin = _.filter(allcoins, { exchange });
			var allExchangeCoinUniqCurrecny = _.uniq(_.map(allExchangeCoin, 'coin'));
			for (let index = 0; index < allExchangeCoinUniqCurrecny.length; index++) {
				const element1 = allExchangeCoinUniqCurrecny[index];
				allExchangeBuySellCoin = _.filter(allExchangeCoin, {
					exchange,
					coin: element1
				});
				if (allExchangeBuySellCoin.length > 1) {
					var minimumBuy = _.minBy(allExchangeBuySellCoin, 'buy');
					var maximumSell = _.maxBy(allExchangeBuySellCoin, 'sell');
					if (
						maximumSell.market !== minimumBuy.market &&
						maximumSell.sell > minimumBuy.buy &&
						Number(((maximumSell.sell - minimumBuy.buy) / minimumBuy.buy) * 100).toFixed(8) >= 2 &&
						Number(maximumSell.sell - minimumBuy.buy) > 0 &&
						maximumSell.sell > 0 &&
						minimumBuy.buy > 0
					) {
						var temp = {};
						temp['buyExchange'] = minimumBuy.market;
						temp['sellExchange'] = maximumSell.market;
						temp['buyCurrency'] = minimumBuy.coin;
						temp['sellCurrency'] = maximumSell.exchange;
						temp['buyPrice'] = minimumBuy.buy;
						temp['sellPrice'] = maximumSell.sell;
						temp['profit'] = `${Number(maximumSell.sell - minimumBuy.buy).toFixed(8)} (${(
							(Number(maximumSell.sell - minimumBuy.buy).toFixed(8) / minimumBuy.buy) *
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
		}
	} catch (error) {
		console.log(error);
	}
};

// exports.compareCoin();
