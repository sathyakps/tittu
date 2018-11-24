const TelegramBot = require('telegraf/telegram');

const token = '785325465:AAGOSZZy1z_jIds0_dUL9VYV-EMZ9suPYYo';

const bot = new TelegramBot(token, { polling: true });

module.exports = { bot };
