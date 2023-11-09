const { SlashCommandBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  VoiceConnectionStatus,
  createAudioResource,
} = require("@discordjs/voice");
const ytdlp = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("musique")
    .setDescription("Vous permez d'écouter une audio depuis youtube'")
    .addStringOption((option) =>
      option
        .setName("lien")
        .setDescription("Lien de la vidéo youtube")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      interaction.reply({
        content: "Tu dois être dans un channel vocal",
        ephemeral: true,
      });
    }

    const url = interaction.options.getString("lien");

    const musique = await ytdlp(url, { filter: "audioonly" });
    const ressource = await createAudioResource(musique);
    const player = await createAudioPlayer();

    const connection = await joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const subs = connection.subscribe(player);

    player.play(ressource);

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log("Le bot joue de la musique");
    });

    connection.on(VoiceConnectionStatus.Idle, () => {
      console.log("Le bot est pret à jouer de la musique");
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      console.log("Le bot c'est fait déco");
      if (subs) {
        setTimeout(() => subs.unsubscribe(), 1_000);
      }
      player.stop();
    });

    player.on("error", (error) => {
      console.error(`Erreur: ${error.message}`);
    });
  },
};
