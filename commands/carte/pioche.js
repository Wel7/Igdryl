const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("piocher")
    .setDescription("Pioche une carte"),

  async execute(interaction) {
    const userId = interaction.member.user.id;
    const filePath = path.join(__dirname, "stockage", `${userId}.json`);

    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const deck = JSON.parse(data);
        const card = deck.pop();
        ret = ""
        fs.writeFile(filePath, JSON.stringify(deck), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          if(deck.length<11 && deck.length>0){
            ret += `Il ne reste plus que ${deck.length} cartes dans ton packet...\n La folie de la fin approche \n`
          }
          if(deck.length==0){
            ret += `La folie de la fin t'attrape, et ton âme disparait dans les ténèbres.`
          }
          ret += `Vous avez pioché un ${card.Value} de ${card.Suit}`
          interaction.reply(ret);
        });
      });
    }
    else {
      await interaction.reply("Vous n'avez pas de paquet de carte");
    }
  },
};
