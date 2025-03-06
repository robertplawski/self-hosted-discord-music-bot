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
    download(url);
  },
};
