const axios = require('axios');
const tittuBot = require('../utils/telegram').tittu;
var _ = require('lodash');

var tittu = axios.create({
	baseURL: 'https://tittu-v2.herokuapp.com/'
});

module.exports.pingOwnSite = async () => {
	try {
		await tittu.get();
	} catch (e) {
		tittuBot.sendMessage(
			333993654,
			`Tried Starting the Tittu. But Failed 
Reason:${e.message}`
		);
	}
};

module.exports.startServer = async () => {
	try {
		await axios.get('https://tittu-nse.herokuapp.com/');
	} catch (e) {
		tittuBot.sendMessage(
			333993654,
			`Tried Starting the Tittu. But Failed 
Reason:${e.message}`
		);
	}
};

module.exports.getStockPrice = async () => {
	try {
		var data = await axios.get('https://tittu-nse.herokuapp.com/get_gapups');
	} catch (e) {
		tittuBot.sendMessage(
			333993654,
			`Tried Starting the Tittu. But Failed 
Reason:${e.message}`
		);
	}
};

module.exports.getOpenRange = async () => {
	try {
		var data = await axios.get('https://tittu-nse.herokuapp.com/get-range');
	} catch (e) {
		tittuBot.sendMessage(
			333993654,
			`Tried Starting the Tittu. But Failed 
Reason:${e.message}`
		);
	}
};
