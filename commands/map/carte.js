const { SlashCommandBuilder, EmbedBuilder  } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("map")
    .setDescription("Vous permet de voir la carte !")
    .addStringOption(option =>
        option.setName("lieu")
        .setDescription("Nom de la carte que vous voulez voir")
        .addChoices(
            {name:"Monde", value:'monde'},
            {name:"Aria", value:'aria'},
            {name:"Altabianca", value:'altabicanca'},
        )
        .setRequired(true)),
    
      

  async execute(interaction) {
    const map = "./commands/map/maps/" + (interaction.options.getString('lieu')) + ".png"
    const laCarte = new EmbedBuilder()
	.setTitle(interaction.options.getString('lieu').toUpperCase())
	.setImage('attachment://' + (interaction.options.getString('lieu')) + ".png");
    await interaction.channel.send({ embeds: [laCarte], files: [map] });
    
  },
};
