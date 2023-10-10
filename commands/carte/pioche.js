const {
    SlashCommandBuilder,
  } = require("discord.js");
  const fs = require("fs");
  const path = require("path");
  
  

  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("paquet")
      .setDescription("Voir son paquer de carte"),
  
      async execute(interaction) {
        const userId = interaction.member.user.id;
        const filePath = path.join(
          `/home/hugo/Documents/VSCode/Igdryl/commands/carte/stockage/${userId}.json`
        );
  },
  };