module.exports = (bot) => {
  bot.command('start', (ctx) => {
    const userName = ctx.from.first_name; 

    const welcomeMessage = `👋 Bonjour ${userName} \n\nBienvenue chère utilisateur ou utilisatrice moi c'est Ronald Chatbot \n\n- /help consultez la liste de mes commandes \n\n veuillez contacter @Alexandre_Ronald_SORY si le bot à un problème 🤗`;

    ctx.reply(welcomeMessage);
  });
};
