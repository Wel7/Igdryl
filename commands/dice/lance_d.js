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
    const nbr = (interaction.options.getInteger('nombre')?? 1)
    console.log(nbr);
    console.log(nbr == 1);
    let answer = nbr + " lancer(s) de " + interaction.options.getInteger('face') + " face(s) : ";
    let ttl = 0;
    for (let i = 0; i <  nbr; i++) {
      temp = Math.floor(Math.random() * (interaction.options.getInteger('face') - 1)) + 1
      answer += temp + " ";ttl += temp;
    }
    if(!nbr == 1){
      answer+="\nTotal = "+ttl;
    }
    
    await interaction.reply(answer);
  },
};
