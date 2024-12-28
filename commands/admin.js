const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../config.dev.json');
let config = require(configPath);

module.exports = (bot) => {
    bot.command('admin', async (ctx) => {
        if (ctx.from.id == config.admin_id) {
            const admins = config.additional_admins || [];
            let message = `👑 **Administrateurs actuels**:\n\n- **Admin principal**: ${ctx.from.first_name || 'Inconnu'} (@${ctx.from.username || 'aucun'})\n`;

            for (const adminId of admins) {
                try {
                    const adminInfo = await bot.telegram.getChat(adminId);
                    message += `- **Admin secondaire**: ${adminInfo.first_name || 'Inconnu'} (@${adminInfo.username || 'aucun'})\n`;
                } catch (error) {
                    message += `- **Admin secondaire**: ID ${adminId} (Impossible de récupérer les détails)\n`;
                }
            }

            ctx.replyWithMarkdown(message);
        } else {
            ctx.reply('❌ Vous n\'êtes pas autorisé à voir cette information.');
        }
    });

    bot.command('addadmin', (ctx) => {
        if (ctx.from.id != config.admin_id) {
            return ctx.reply('❌ Seul l\'administrateur principal peut ajouter d\'autres administrateurs.');
        }

        const args = ctx.message.text.split(' ').slice(1);
        if (args.length === 0) {
            return ctx.reply('⚠️ Veuillez fournir l\'ID Telegram de l\'utilisateur à ajouter en tant qu\'administrateur.');
        }

        const newAdminId = parseInt(args[0]);
        if (isNaN(newAdminId)) {
            return ctx.reply('⚠️ L\'ID doit être un nombre valide.');
        }

        if (!config.additional_admins) {
            config.additional_admins = [];
        }

        if (config.additional_admins.includes(newAdminId)) {
            return ctx.reply('⚠️ Cet utilisateur est déjà administrateur.');
        }

        config.additional_admins.push(newAdminId);
 
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        ctx.reply(`✅ L'utilisateur avec l'ID ${newAdminId} a été ajouté en tant qu'administrateur.`);
    });

    bot.command('removeadmin', (ctx) => {
        if (ctx.from.id != config.admin_id) {
            return ctx.reply('❌ Seul l\'administrateur principal peut retirer des administrateurs.');
        }

        const args = ctx.message.text.split(' ').slice(1);
        if (args.length === 0) {
            return ctx.reply('⚠️ Veuillez fournir l\'ID Telegram de l\'utilisateur à retirer des administrateurs.');
        }

        const removeAdminId = parseInt(args[0]);
        if (isNaN(removeAdminId)) {
            return ctx.reply('⚠️ L\'ID doit être un nombre valide.');
        }

        if (!config.additional_admins || !config.additional_admins.includes(removeAdminId)) {
            return ctx.reply('⚠️ Cet utilisateur n\'est pas administrateur.');
        }

        config.additional_admins = config.additional_admins.filter(id => id !== removeAdminId);

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        ctx.reply(`✅ L'utilisateur avec l'ID ${removeAdminId} a été retiré des administrateurs.`);
    });
};
