const { Telegraf } = require('telegraf');
const fs = require('fs');
const express = require('express');
const path = require('path');

const tokenPath = path.resolve(__dirname, 'account.dev.txt');
const token = fs.readFileSync(tokenPath, 'utf-8').trim();

if (!token) {
    throw new Error('Token not found. Please ensure account.dev.txt contains your bot token.');
}

const bot = new Telegraf(token);
const app = express();

const PORT = process.env.PORT || 3000;
const URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

require('./commands/ai')(bot);
require('./commands/admin')(bot);
require('./commands/help')(bot);
require('./commands/translate')(bot);
require('./commands/start')(bot);
require('./commands/imgbb')(bot);
require('./commands/getid')(bot);

bot.telegram.setWebhook(`${URL}/bot${token}`);
app.use(bot.webhookCallback(`/bot${token}`));


app.listen(PORT, () => {
    console.log(`Bot lancé avec succès sur : ${URL}`);
});
