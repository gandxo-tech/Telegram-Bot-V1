module.exports = (bot) => {
  bot.command('start', (ctx) => {
    const userName = ctx.from.first_name; 

    const welcomeMessage = `👋 Bonjour ${userName} Moi c'est Gandxochat_bot je suis créé par @GBAGUIDIexauce tape/help pour voir les commandes disponible 
#GANDXO 👨🏾‍💻🩵`;

    ctx.reply(welcomeMessage);
  });
};
