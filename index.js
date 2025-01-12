const { Telegraf } = require('telegraf');
const fs = require('fs');
const express = require('express');
const path = require('path');
const axios = require('axios');

// Logger utilitaire
const logger = {
    log: (message) => console.log(`[LOG] ${message}`),
    error: (message) => console.error(`[ERREUR] ${message}`),
};

// Chargement du token
const tokenPath = path.resolve(__dirname, 'account.dev.txt');
let token;
try {
    token = fs.readFileSync(tokenPath, 'utf-8').trim();
    if (!token) throw new Error('Token vide dans account.dev.txt.');
} catch (err) {
    logger.error('Impossible de lire le token : ' + err.message);
    process.exit(1); // Arrêt du processus
}

// Initialisation des instances
const bot = new Telegraf(token);
const app = express();

// Configuration du serveur
const PORT = process.env.PORT || 3000;
const URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

// Configuration des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chargement des commandes
const commands = [
    'ai',
    'admin',
    'help',
    'translate',
    'start',
    'imgbb',
    'getid',
    'weather',
];

commands.forEach((command) => {
    try {
        require(`./commands/${command}`)(bot);
        logger.log(`Commande ${command} chargée.`);
    } catch (err) {
        logger.error(`Erreur lors du chargement de la commande ${command} : ${err.message}`);
    }
});

// Gestion des messages texte
bot.on('text', async (ctx) => {
    const prompt = ctx.message.text;
    try {
        const response = await axios.get(
            `https://kaiz-apis.gleeze.com/api/gpt-4o`,
            {
                params: { q: prompt, uid: ctx.from.id },
            }
        );

        const { response: reply } = response.data;

        // Divise les messages longs en parties de 1999 caractères
        const parts = [];
        for (let i = 0; i < reply.length; i += 1999) {
            parts.push(reply.substring(i, i + 1999));
        }

        for (const part of parts) {
            await ctx.reply(part);
        }
    } catch (err) {
        ctx.reply("Une erreur est survenue. Veuillez réessayer plus tard.");
        logger.error(`Erreur lors de l'appel à l'API : ${err.message}`);
    }
});

// Configuration du webhook
(async () => {
    try {
        await bot.telegram.setWebhook(`${URL}/bot${token}`);
        app.use(bot.webhookCallback(`/bot${token}`));

        app.listen(PORT, () => {
            logger.log(`Bot lancé avec succès sur ${URL}`);
        });
    } catch (err) {
        logger.error(`Erreur lors de la configuration du webhook : ${err.message}`);
        process.exit(1);
    }
})();

app.listen(PORT, () => {
    console.log(`
0%   ▒▒▒▒▒▒▒▒▒▒
10%  █▒▒▒▒▒▒▒▒▒
20%  ██▒▒▒▒▒▒▒▒
30%  ███▒▒▒▒▒▒▒
40%  ████▒▒▒▒▒▒
50%  █████▒▒▒▒▒
60%  ██████▒▒▒▒
70%  ███████▒▒▒
80%  ████████▒▒
90%  █████████▒
100% ██████████
✅ Made by GANDXO (GBAGUIDI Exaucé)
✅ Bot lancé avec succès sur : ${URL}`);
})
