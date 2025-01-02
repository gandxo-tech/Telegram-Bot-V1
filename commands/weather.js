const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('7871672665:AAGfaBgyN9FYB93gBvneXlyaB1Spk0d6b5I'); // Remplacez par le token de votre bot
const apiKey = 'd8e6a31f799fadb31b6ed4bec3335088'; // Remplacez par votre clé API OpenWeatherMap

// Exemple de commande météo
bot.command('meteo', async (ctx) => {
    const city = ctx.message.text.split(' ')[1]; // Récupère le nom de la ville
    if (!city) {
        return ctx.reply('Veuillez spécifier une ville. Exemple : /meteo Paris');
    }

    try {
        const response = await axios.get(https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric);
        const weatherData = response.data;
        const message = Météo à ${weatherData.name} : ${weatherData.weather[0].description}, Température : ${weatherData.main.temp}°C;
        ctx.reply(message);
    } catch (error) {
        ctx.reply('Erreur lors de la récupération des données météo. Vérifiez le nom de la ville ou votre clé API.');
    }
});
