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
    const id = queue[0];

    await interaction.deferReply();
    if (!id) {
      await interaction.editReply("Nothing is playing right now!");
      return;
    }

    const { fulltitle, channel, duration } = await getSongMetadata(id);
    await interaction.editReply({
      embeds: [
        getNowPlayingQueueEmbed(
          `https://www.youtube.com/watch?v=${id}`,
          fulltitle,
          channel,
          user.username,
          `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
          duration
        ),
      ],
    });
    //await wait(10000);
    //await interaction.deleteReply();
  },
};
