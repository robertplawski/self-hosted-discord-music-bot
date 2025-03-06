const { getVoiceConnection } = require("@discordjs/voice");
const { download } = require("../../tools/download");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("download")
    .setDescription("Downloads a music file from youtube")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Url of youtube music video")
        .setRequired(true)
    ),
  async execute(interaction) {
    const url = interaction.options.getString("url");
    try {
      await interaction.reply("Starting a file download");
      await download(url);

      await interaction.editReply("File download finished");
    } catch (err) {
      console.error(err);
      interaction.reply(`Something went wrong when downloading a file`);
    }
  },
};
