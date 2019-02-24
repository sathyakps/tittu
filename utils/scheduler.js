const schedule = require('node-schedule');
const tittu_nse = require('../tittu-nse/nse.controllers');

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1, 2, 3, 4, 5];
rule.hour = 9;
rule.minute = 03;
var pingJOb = schedule.scheduleJob(rule, async function() {
	await tittu_nse.startServer();
});

var startNseJOB = schedule.scheduleJob('*/25 * * * * ', async function() {
	await tittu_nse.pingOwnSite();
});

var rule1 = new schedule.RecurrenceRule();
rule1.dayOfWeek = [1, 2, 3, 4, 5];
rule1.hour = 9;
rule1.minute = 14;
var getStockPrice = schedule.scheduleJob(rule1, async function() {
	await tittu_nse.getStockPrice();
});

var rule2 = new schedule.RecurrenceRule();
rule2.dayOfWeek = [1, 2, 3, 4, 5];
rule2.hour = 9;
rule2.minute = 29;
rule2.second = 30;
var getStockPrice = schedule.scheduleJob(rule1, async function() {
	await tittu_nse.getOpenRange();
});
