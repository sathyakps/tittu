const axios = require('axios');
var _ = require('lodash');
var currency = axios.create({
	baseURL: 'https://free.currencyconverterapi.com/api/v6/convert'
});

exports.getForexRate = async () => {
	var data = await currency.get('/', {
		params: {
			q: 'USD_INR,EUR_INR'
		}
	});
	return { USD: data.data.results.USD_INR.val, EUR: data.data.results.EUR_INR.val };
};
