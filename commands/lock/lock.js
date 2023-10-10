const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Locks a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to echo into')),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    await channel.permissionOverwrites.create(channel.guild.roles.everyone, {ViewChannel: false});   

    await interaction.reply({
      content: "This channel has been locked.",
      ephemeral: true,
    });
  },
};
