const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Vous permez de lancer le dé que vous voulez")
    .addIntegerOption((option) =>
      option
        .setName("face")
        .setDescription("Le nombre de face du dé")
        .setRequired(true)
        .setMinValue(2)
        .setMaxValue(100)
    )

    .addIntegerOption((option) =>
      option
        .setName("nombre")
        .setDescription("Le nombre de lancer du dé")
        .setMinValue(1)
        .setMaxValue(10)
    ),

  async execute(interaction) {
    const userId = interaction.member.user.id;
    const serverID = interaction.guild.id;
    const nbr = interaction.options.getInteger("nombre") ?? 1;
    let answer =
      nbr +
      " lancer(s) de " +
      interaction.options.getInteger("face") +
      " face(s) : ";
    let ttl = 0;
    for (let i = 0; i < nbr; i++) {
      let temp =
        Math.floor(Math.random() * interaction.options.getInteger("face")) + 1;
      addToFile(serverID, userId, temp);
      answer += temp + " ";
      ttl += temp;
    }
    if (!nbr == 1) {
      answer += "\nTotal = " + ttl;
    }
    await interaction.reply(answer);
  },
};

function addToFile(serverID, userId, de) {
  const filePath = `./commands/dice/stats_d/${serverID}/${userId}.json`;
  if (!fs.existsSync(`./commands/dice/stats_d/${serverID}`)){
    fs.mkdirSync(`./commands/dice/stats_d/${serverID}`);
  } 
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const values = JSON.parse(data);
      values.push(de);
      fs.writeFile(filePath, JSON.stringify(values), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
  } else {
    fs.writeFile(filePath, JSON.stringify([de]), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    return;
  }
}
