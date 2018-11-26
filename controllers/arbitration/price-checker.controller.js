const axios = require('axios');
var _ = require('lodash');

var tittu = require('../../utils/telegram').bot;

var currency = axios.create({
	baseURL: 'https://free.currencyconverterapi.com/api/v6/convert'
});
const cex = axios.create({
	baseURL: 'https://cex.io/api/tickers/'
});

var bitbns = axios.create({
	baseURL: 'https://bitbns.com/order/getTickerWithVolume/'
});

var koinex = axios.create({
	baseURL: 'https://koinex.in/api/ticker'
});

exports.checkCryptoDifference = async () => {
	try {
		var coinData = {};
		var xlmData = {};
		var xrpData = {};
		var forexRate = await exports.getForexRate();
		var data = await cex.get('/XLM/EUR');
		var responseDataXLMEUR = _.find(data.data.data, { pair: 'XLM:EUR' });
		xlmData['EUR'] = {};
		xlmData['EUR']['price'] = await exports.getCurrencyPrice(forexRate.EUR, Number(responseDataXLMEUR['last']));
		xlmData['EUR']['bid'] = await exports.getCurrencyPrice(forexRate.EUR, responseDataXLMEUR['bid']);
		xlmData['EUR']['ask'] = await exports.getCurrencyPrice(forexRate.EUR, responseDataXLMEUR['ask']);
		var data = await cex.get('/XLM/USD');
		var responseDataXLMUSD = _.find(data.data.data, { pair: 'XLM:USD' });
		xlmData['USD'] = {};
		xlmData['USD']['price'] = await exports.getCurrencyPrice(forexRate.USD, Number(responseDataXLMUSD['last']));
		xlmData['USD']['bid'] = await exports.getCurrencyPrice(forexRate.USD, responseDataXLMUSD['bid']);
		xlmData['USD']['ask'] = await exports.getCurrencyPrice(forexRate.USD, responseDataXLMUSD['ask']);
		coinData = { ...coinData, xlmData };
		var data = await cex.get('/XRP/EUR');
		var responseDataXLMUSD = _.find(data.data.data, { pair: 'XRP:EUR' });
		xrpData['EUR'] = {};
		xrpData['EUR']['price'] = await exports.getCurrencyPrice(forexRate.EUR, Number(responseDataXLMUSD['last']));
		xrpData['EUR']['bid'] = await exports.getCurrencyPrice(forexRate.EUR, responseDataXLMUSD['bid']);
		xrpData['EUR']['ask'] = await exports.getCurrencyPrice(forexRate.EUR, responseDataXLMUSD['ask']);
		var data = await cex.get('/XRP/USD');
		var responseDataXRPUSD = _.find(data.data.data, { pair: 'XRP:USD' });
		xrpData['USD'] = {};
		xrpData['USD']['price'] = await exports.getCurrencyPrice(forexRate.USD, Number(responseDataXRPUSD['last']));
		xrpData['USD']['bid'] = await exports.getCurrencyPrice(forexRate.USD, responseDataXRPUSD['bid']);
		xrpData['USD']['ask'] = await exports.getCurrencyPrice(forexRate.USD, responseDataXRPUSD['ask']);
		coinData = { ...coinData, xrpData };

		var bitBNS = {};
		var xlmData = {};
		var xrpData = {};
		var bitbnsData = await bitbns.get();
		xlmData['price'] = bitbnsData.data.XLM['last_traded_price'];
		xlmData['bid'] = bitbnsData.data.XLM['highest_buy_bid'];
		xlmData['ask'] = bitbnsData.data.XLM['lowest_sell_bid'];
		xrpData['price'] = bitbnsData.data.XRP['last_traded_price'];
		xrpData['bid'] = bitbnsData.data.XRP['highest_buy_bid'];
		xrpData['ask'] = bitbnsData.data.XRP['lowest_sell_bid'];
		bitBNS = { xlmData, xrpData };

		var koinexData = {};
		var xlmData = {};
		var xrpData = {};
		var koinexResponse = await koinex.get();
		xlmData['price'] = koinexResponse.data.stats.inr.XLM['last_traded_price'];
		xlmData['bid'] = koinexResponse.data.stats.inr.XLM['highest_bid'];
		xlmData['ask'] = koinexResponse.data.stats.inr.XLM['lowest_ask'];

		xrpData['price'] = koinexResponse.data.stats.inr.XRP['last_traded_price'];
		xrpData['bid'] = koinexResponse.data.stats.inr.XRP['highest_bid'];
		xrpData['ask'] = koinexResponse.data.stats.inr.XRP['lowest_ask'];

		koinexData = { xlmData, xrpData };
		exports.checkDifference(coinData, bitBNS, koinexData);
		return data;
	} catch (e) {
		console.log(e);
	}
};

exports.getCurrencyPrice = async (pair, price) => {
	return +(Math.round(price * pair * 1.1 + 'e+2') + 'e-2');
};

exports.checkDifference = async (cex, bitbns, koinex) => {
	var xlmbitbnsDifferenceEURO = Number(bitbns['xlmData']['bid'] - cex['xlmData']['EUR']['ask']).toFixed(2);
	var xlmKoinexDifferenceEURO = Number(koinex['xlmData']['bid'] - cex['xlmData']['EUR']['ask']).toFixed(2);

	var xlmbitbnsDifferenceUSD = Number(bitbns['xlmData']['bid'] - cex['xlmData']['USD']['ask']).toFixed(2);
	var xlmKoinexDifferenceUSD = Number(koinex['xlmData']['bid'] - cex['xlmData']['USD']['ask']).toFixed(2);

	var xrpbitbnsDifferenceEURO = Number(bitbns['xrpData']['bid'] - cex['xrpData']['EUR']['ask']).toFixed(2);
	var xrpKoinexDifferenceEURO = Number(koinex['xrpData']['bid'] - cex['xrpData']['EUR']['ask']).toFixed(2);

	var xrpbitbnsDifferenceUSD = Number(bitbns['xrpData']['bid'] - cex['xrpData']['USD']['ask']).toFixed(2);
	var xrpKoinexDifferenceUSD = Number(koinex['xrpData']['bid'] - cex['xrpData']['USD']['ask']).toFixed(2);

	var messageString = `U+1F4B0 U+1F4B0 U+1F4B0 U+1F4B0      Trade Alert     U+1F4B0 U+1F4B0 U+1F4B0 U+1F4B0
	
	
	`;
	if (
		xlmbitbnsDifferenceEURO >= 0.5 ||
		xlmKoinexDifferenceEURO >= 0.5 ||
		xlmbitbnsDifferenceUSD >= 0.5 ||
		xlmKoinexDifferenceUSD >= 0.5 ||
		xrpbitbnsDifferenceEURO >= 1 ||
		xrpKoinexDifferenceEURO >= 1 ||
		xrpbitbnsDifferenceUSD >= 1 ||
		xrpKoinexDifferenceUSD >= 1
	) {
		tittu.sendMessage(
			'@TittuOfficial',
			`************** Bitbns ******************
				XLM EUR Profit: ${xlmbitbnsDifferenceEURO} 
				XLM USD Profit: ${xlmbitbnsDifferenceUSD}
		
				XRP EUR Profit: ${xrpbitbnsDifferenceEURO}
				XRP USD Profit: ${xrpbitbnsDifferenceUSD} 
				
				*************** Koinex ****************
				XLM EUR Profit: ${xlmKoinexDifferenceEURO} 
				XLM USD Profit: ${xlmKoinexDifferenceUSD}
		
				XRP EUR Profit: ${xrpKoinexDifferenceEURO}
				XRP USD Profit: ${xrpKoinexDifferenceUSD} 
				`
		);
	}
};

exports.getForexRate = async () => {
	var data = await currency.get('/', {
		params: {
			q: 'USD_INR,EUR_INR'
		}
	});
	return { USD: data.data.results.USD_INR.val, EUR: data.data.results.EUR_INR.val };
};
