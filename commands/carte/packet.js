const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const path = require("path");


function getDeck() {
  deck = [];
  suits = ["Pique", "Trefle", "Carreau", "Coeur"];
  values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  for (let i = 0; i < this.suits.length; i++) {
    for (let x = 0; x < this.values.length; x++) {
      const card = { Value: this.values[x], Suit: this.suits[i] };
      this.deck.push(card);
    }
  }
  this.deck.push({ Value: "Joker", Suit: "Joker" });
  return deck;
}

function writeToFile(userId, deck) {
  const filePath = `./commands/carte/stockage/${userId}.json`;
  const data = JSON.stringify(deck);
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Deck written to ${filePath}`);
  });
}

function shuffle(array)
{
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];

	}
  return array;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("paquet")
    .setDescription("Info sur le paquet de carte"),

  async execute(interaction) {
    const userId = interaction.member.user.id;
    const filePath = path.join(
      `/home/hugo/Documents/VSCode/Igdryl/commands/carte/stockage/${userId}.json`
    );
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const deck = JSON.parse(data);

        interaction.reply({content:`Vous avez ${deck.length} cartes dans votre paquet`});
      });
    } else {
      const oui = new ButtonBuilder()
        .setCustomId("oui")
        .setLabel("Oui")
        .setStyle(ButtonStyle.Primary);

      const non = new ButtonBuilder()
        .setCustomId("non")
        .setLabel("Non")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(oui, non);

      const response = await interaction.reply({
        content:
          "Vous n'avez pas de paquet. Voulez vous créer un paquet de carte ?",
        components: [row],
        ephemeral: true,
      });

      const collectorFilter = (i) => i.user.id === interaction.user.id;

      try {
        const confirmation = await response.awaitMessageComponent({
          filter: collectorFilter,
          time: 15_000,
        });
        if (confirmation.customId === "oui") {
          await confirmation.update({
            content: `Le paquet a été crée`,
            components: [],
          });
          writeToFile(interaction.user.id, shuffle(getDeck()));
        } else if (confirmation.customId === "non") {
          await confirmation.update({
            content: `Le paquet n'a pas été crée`,
            components: [],
          });
        }
      } catch (e) {
        console.log(e);
        await interaction.editReply({
          content: "Pas de réponse, pas de paquet",
          components: [],
        });
      }
    }
  },
};
