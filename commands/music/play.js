const { getVoiceConnection } = require("@discordjs/voice");
const { playMusic } = require("../../tools/voice.js");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays music from youtube"),
  async execute(interaction) {
    const { guild } = interaction;
    const result = await playMusic(guild);
    if (result) {
      await interaction.reply("Playing...");
    } else {
      await interaction.reply(
        "Something went wrong, probably bot is not in the voice channel."
      );
    }
  },
};
