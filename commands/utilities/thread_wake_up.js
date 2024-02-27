const { SlashCommandBuilder, ChannelType } = require("discord.js");

/**
 * Does not do exactly what I want yet, but I know how to do it, now I just need to do it FoobOk
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName("wakeup")
        .setDescription("Réveille tous les threads du serveur sur lequel vous faites la commande"),
    async execute(interaction) {
        const channel = await interaction.guild.channels.fetch();
        let archivedThreads;

        console.log();
        channel.filter(channel => channel.type === ChannelType.GuildText).forEach(async (channel) => {
            archivedThreads = await channel.threads.fetchArchived();
            archivedThreads.forEach(async (thread) => {
                await thread.setArchived(false);
            })
        });

        
        await interaction.reply("Tous les threads ont été réveillés !");
    },
};
