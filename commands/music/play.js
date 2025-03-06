const { getVoiceConnection } = require("@discordjs/voice");
const { playMusic } = require("../../tools/voice.js");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays music from youtube")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Url of youtube music video")
        .setRequired(true)
    ),

  async execute(interaction) {
    const url = interaction.options.getString("url");

    const { guild } = interaction;
    const result = await playMusic(guild, url);
    if (result) {
      await interaction.reply("Playing...");
    } else {
      await interaction.reply(
        "Something went wrong, probably bot is not in the voice channel or you dunce didn't provide an actual youtube link"
      );
    }
  },
};
