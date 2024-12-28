const axios = require('axios');

module.exports = (bot) => {
  bot.command('ai', async (ctx) => {
    const prompt = ctx.message.text.split(' ').slice(1).join(' '); 

    if (!prompt) {
      return ctx.reply('Veuillez poser une question après la commande, comme : /ai Quelle est la capitale de la France ?');
    }

    try {
      
      const { data: { response } } = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=${ctx.from.id}`); //thank you kaiz

      const parts = [];
      for (let i = 0; i < response.length; i += 1999) {
        parts.push(response.substring(i, i + 1999));
      }

      for (const part of parts) {
        await ctx.reply(part);
      }

    } catch (error) {
      ctx.reply('Une erreur est survenue lors de la génération de la réponse. Veuillez réessayer plus tard.');
      console.error('Erreur lors de l\'appel à l\'API GPT-4o:', error.message);
    }
  });
};
