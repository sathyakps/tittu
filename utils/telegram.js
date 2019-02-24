const TelegramBot = require('telegraf/telegram');
const token = '785325465:AAGOSZZy1z_jIds0_dUL9VYV-EMZ9suPYYo';
const emoji = require('node-emoji');
var _ = require('lodash');
var BehaviourSubject = require('rxjs').BehaviorSubject;
var debounceTime = require('rxjs/operators').debounceTime;
var message = require('./emitters').updateNewMessage;

const tittu = new TelegramBot(token, { polling: true });

var allMessages = [];
var triggerSubject = new BehaviourSubject(null);

message.subscribe(data => {
	// console.log(data);
	var oldMessage = _.findIndex(allMessages, { id: data.id });
	if (oldMessage > -1) {
		allMessages[oldMessage] = data;
	} else {
		allMessages.unshift(data);
		triggerSubject.next(true);
	}
});

triggerSubject.pipe(debounceTime(3000)).subscribe(data => {
	exports.sendNewUpdate();
});

exports.sendNewUpdate = async () => {
	allMessages = allMessages.filter(data => {
		return (new Date().getTime() - data.updatedAt.getTime()) / 1000 < 120;
	});
	var messageString = ``;
	for (let index = 0; index < allMessages.length; index++) {
		const element = allMessages[index];

		messageString += `
				${(emoji.get('moneybag') + '').repeat(4)} Trade  ${(emoji.get('moneybag') + '').repeat(4)}

				Buy Exch         : ${element.buyExchange}
				Sell Exch         : ${element.sellExchange}
    Buy Currency  : ${element.buyCurrency}
    Sell Curreny    : ${element.sellCurrency}
				Buy Price        : ${element.buyPrice}
				Sell Price        : ${element.sellPrice}
				Profit/coin      : ${element.profit}

				`;
	}
	if (messageString) {
		tittu.sendMessage('@tittuOfficial', messageString);
	}
};

setInterval(() => {
	var updateString = ``;
	updateString += `    ${emoji.get('white_check_mark').repeat(3)}   Hourly Update   ${emoji
		.get('white_check_mark')
		.repeat(3)}

	`;
	for (let index = 0; index < allMessages.length; index++) {
		const element = allMessages[index];

		updateString += `
				${(emoji.get('moneybag') + '').repeat(4)} Trade  ${(emoji.get('moneybag') + '').repeat(4)}

				Buy Exch         : ${element.buyExchange}
				Sell Exch         : ${element.sellExchange}
    Buy Currency  : ${element.buyCurrency}
    Sell Curreny    : ${element.sellCurrency}
				Buy Price        : ${element.buyPrice}
				Sell Price        : ${element.sellPrice}
				Profit/coin      : ${element.profit}

				`;
	}

	tittu.sendMessage('@tittuOfficial', updateString);
}, 3600000);

const Telegraf = require('telegraf');

const bot = new Telegraf(token);
bot.start(ctx => ctx.reply('Welcome'));
bot.help(ctx => ctx.reply('Send me a sticker'));
bot.on('sticker', ctx => ctx.reply('👍'));
bot.hears('Hi', async ctx => {
	console.log(await ctx.getChat());
	ctx.reply('Hey there');
});
bot.startPolling();
module.exports = { tittu };
