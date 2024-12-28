const { Telegraf } = require("telegraf");

module.exports = (bot) => {
  bot.command("getid", async (ctx) => {
    try {
      const args = ctx.message.text.split(" ").slice(1); 
      
      if (ctx.message.reply_to_message) {
        const repliedUserID = ctx.message.reply_to_message.from.id;
        const repliedUsername = ctx.message.reply_to_message.from.username || "sans nom d'utilisateur";
        return ctx.reply(`🔍 L'ID de @${repliedUsername} est : ${repliedUserID}`);
      }

      if (args.length > 0) {
        const username = args[0].replace("@", ""); 
        const chatMembers = await ctx.getChatMembers(); 

        const user = chatMembers.find((member) => member.user.username === username);
        if (user) {
          return ctx.reply(`🔍 L'ID de @${username} est : ${user.user.id}`);
        } else {
          return ctx.reply("❌ Utilisateur non trouvé. Assurez-vous que le nom d'utilisateur est correct.");
        }
      }

      const userID = ctx.message.from.id;
      const username = ctx.message.from.username || "sans nom d'utilisateur";
      return ctx.reply(`🔍 Votre ID est :  ${userID}  (@${username})`);
    } catch (error) {
      console.error("Erreur avec la commande getid :", error);
      return ctx.reply("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  });
};
