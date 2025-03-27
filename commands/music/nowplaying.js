const { SlashCommandBuilder } = require("discord.js");
const { getQueueForGuild } = require("../../tools/queue");

const { getNowPlayingQueueEmbed } = require("../../tools/embed");
const { getSongMetadata } = require("../../tools/download");

const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Shows song that is now playing"),
  async execute(interaction) {
    const { guild, user } = interaction;
    const queue = getQueueForGuild(guild.id);
    const song = queue[0];

    await interaction.deferReply();
    if (!song) {
      await interaction.editReply("Nothing is playing right now!");
      return;
    }

    await interaction.editReply({
      embeds: [getNowPlayingQueueEmbed(song)],
    });
    //await wait(10000);
    //await interaction.deleteReply();
  },
};
