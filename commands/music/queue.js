const { getVoiceConnection } = require("@discordjs/voice");

const { SlashCommandBuilder } = require("discord.js");
const { getQueueForGuild } = require("../../tools/queue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the queue"),
  async execute(interaction) {
    const { guild } = interaction;
    const queue = getQueueForGuild(guild.id);
    console.log(queue);
    if (queue.length == 0) {
      await interaction.reply("The queue is empty try playing something");

      return;
    }
    await interaction.reply(JSON.stringify(queue));
  },
};
