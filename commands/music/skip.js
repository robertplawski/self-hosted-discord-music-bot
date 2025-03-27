//skipItemFromQueue
const { SlashCommandBuilder } = require("discord.js");
const { getQueueForGuild, getFromQueue } = require("../../tools/queue");

const { getQueueEmbed } = require("../../tools/embed");
const { skipItemFromQueue } = require("../../tools/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips songs from queue"),
  async execute(interaction) {
    const { guild } = interaction;
    const { fulltitle, channel, requestedBy } = getFromQueue(guild.id);
    skipItemFromQueue(guild.id);
    await interaction.reply(
      `Skipping ${fulltitle} - ${channel}, requested by ${requestedBy}`
    );
  },
};
