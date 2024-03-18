const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const path = require("path");


/**
 * Creates a deck of cards with 52 standard cards and 1 Joker card.
 * @returns {Array} An array of card objects, each with a Value and Suit property.
 */
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

/**
 * Writes the given deck to a JSON file with the given user ID as the filename.
 * @param {string} userId - The ID of the user whose deck is being written to the file.
 * @param {object} deck - The deck object to be written to the file.
 */
function writeToFile(userId, deck) {
  const stockageDir = path.join(__dirname, "stockage");
  if (!fs.existsSync(stockageDir)) {
    fs.mkdirSync(stockageDir);
  }
  const filePath = path.join(stockageDir, `${userId}.json`);
  const data = JSON.stringify(deck);
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Deck créé ${filePath}`);
  });
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
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
    const filePath = path.join(__dirname, "stockage", `${userId}.json`);
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
          writeToFile(interaction.user.id, shuffle(getDeck()));
          await confirmation.update({
            content: `Le paquet a été crée`,
            components: [],
          });
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
