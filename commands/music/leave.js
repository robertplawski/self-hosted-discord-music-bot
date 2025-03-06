const { getVoiceConnection } = require("@discordjs/voice");

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves the voice channel - self explenatory..."),
  async execute(interaction) {
    const { guild } = interaction;
    const connection = getVoiceConnection(guild.id);

    try {
      connection.destroy();

      await interaction.reply(`Leaving the Voice Channel...`);
    } catch (error) {
      console.log(error);
      await interaction.reply("Error leaving voice channel");
    }
  },
};
