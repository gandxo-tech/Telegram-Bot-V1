const axios = require('axios'); 

async function translateText(inputText, sourceLang, targetLang) {
    try {
        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(inputText)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data[0]) {
            return response.data[0][0][0]; 
        }
        return "Désolé, je n'ai pas pu traduire le texte.";
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API de traduction :", error.message);
        return "Désolé, une erreur s'est produite lors de la traduction.";
    }
}

module.exports = (bot) => {
    bot.command('translate', async (ctx) => {
        const args = ctx.message.text.split(' ').slice(1); 
        const inputText = args.slice(2).join(' '); 
        const sourceLang = args[0] || 'auto'; 
        const targetLang = args[1]; 

        
        if (!inputText || !targetLang) {
            return ctx.reply("Veuillez entrer un texte à traduire ainsi que la langue cible après la commande, comme : /translate <langue_source> <langue_cible> <texte>");
        }

        const translatedText = await translateText(inputText, sourceLang, targetLang);

        await ctx.reply(`Traduction (${sourceLang} → ${targetLang}):\n${translatedText}`);
    });
};
