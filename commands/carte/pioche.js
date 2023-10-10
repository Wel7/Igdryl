const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("piocher")
    .setDescription("Pioche une carte"),

  async execute(interaction) {
    const userId = interaction.member.user.id;
    const filePath = path.join(
      `/home/hugo/Documents/VSCode/Igdryl/commands/carte/stockage/${userId}.json`
    );

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const deck = JSON.parse(data);
        const card = deck.pop();
        fs.writeFile(filePath, JSON.stringify(deck), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(
            `${interaction.member.user.username} a pioché la carte ${card}`
          );
          interaction.reply(`Vous avez pioché un ${card.Value} de ${card.Suit}`);
        });
      });
    }
    else {
      await interaction.reply("Vous n'avez pas de paquet de carte");
    }
  },
};
