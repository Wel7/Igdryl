const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Vous permez de lancer le dé que vous voulez")
    .addIntegerOption(option =>
      option.setName("face")
      .setDescription("Le nombre de face du dé")
      .setRequired(true)
      .setMinValue(2)
      .setMaxValue(100))
      
      
    .addIntegerOption(option =>
      option.setName("nombre")
      .setDescription("Le nombre de lancer du dé")
      .setMinValue(1)
      .setMaxValue(10)),
      

  async execute(interaction) {
    let answer = (interaction.options.getInteger('nombre')?? 1) + " lancer(s) de " + interaction.options.getInteger('face') + " face(s) : ";
    for (let i = 0; i <  (interaction.options.getInteger('nombre')?? 1); i++) {
      answer += Math.floor(Math.random() * interaction.options.getInteger('face'));
    }
    await interaction.reply(answer);
  },
};
