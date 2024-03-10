const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("map")
    .setDescription("Vous permet de voir la carte !")
    .addStringOption(option =>
      option.setName("lieu")
        .setDescription("Nom de la carte que vous voulez voir")
        .addChoices(
          ...getMaps()
        )
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const mapPath = interaction.options.getString('lieu');
    const mapName = path.basename(mapPath);
    const laCarte = new EmbedBuilder()
      .setTitle(mapName)
      .setImage(`attachment://${mapName}`);
    await interaction.editReply({ embeds: [laCarte], files: [mapPath] });
  },
};

function getMaps() {
  maps = []
  const foldersPath = path.join(__dirname, 'maps');
  const mapsFolders = fs.readdirSync(foldersPath);

  for (const file of mapsFolders) {
    const filePath = path.join(foldersPath, file);
    maps.push({ name: file, value: filePath })
  }
  return maps;
}
