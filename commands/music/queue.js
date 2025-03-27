const { getVoiceConnection } = require("@discordjs/voice");

const { SlashCommandBuilder } = require("discord.js");
const { getQueueForGuild } = require("../../tools/queue");

const { EmbedBuilder } = require("discord.js");
const { getNowPlayingQueueEmbed, getQueueEmbed } = require("../../tools/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the queue"),
  async execute(interaction) {
    const { guild } = interaction;
    const queue = getQueueForGuild(guild.id);

    await interaction.reply({ embeds: [getQueueEmbed(queue)] });
  },
};
