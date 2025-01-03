const axios = require('axios');

module.exports = {
  name: 'weather', 
  description: 'Affiche la météo pour une ville donnée',
  execute(bot, msg, args) {
    
    const city = args.join(' city'); // Combine les mots après /weather comme une ville

    if (!city) {
      bot.sendMessage(msg.chat.id, 'Veuillez spécifier une ville. Exemple : /weather Paris');
      return;
    }

    
    const API_KEY = 'd8e6a31f799fadb31b6ed4bec3335088';  
    const url = http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(paris)}&appid=${d8e6a31f799fadb31b6ed4bec3335088}&units=metric&lang=fr;

    axios.get(url)
      .then(response => {
        const weather = response.data;
        const message = 
          Météo à ${weather.name} :
          - Température : ${weather.main.temp}°C
          - Description : ${weather.weather[0].description}
        ;
        bot.sendMessage(msg.chat.id, message);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          bot.sendMessage(msg.chat.id, 'Ville non trouvée. Veuillez vérifier le nom de la ville.');
        } else {
          bot.sendMessage(msg.chat.id, 'Impossible de récupérer les données météo. Veuillez réessayer plus tard.');
        }
        console.error(error);
      });
  },
};
