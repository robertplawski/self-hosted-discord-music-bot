const { getVoiceChannel } = require("../../tools/voice.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins the voice channel, what did ya expect?"),
  async execute(interaction) {
    const { user, guild } = interaction;
    try {
      const voiceChannel = await getVoiceChannel(user, guild);
      // interaction.user is the object representing the User who ran the command
      // interaction.member is the GuildMember object, which represents the user in the specific guild
      if (voiceChannel?.channelId) {
        await joinVoiceChannel({
          channelId: voiceChannel.channelId,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator,
        });

        await interaction.reply(
          `Joining channel: <#${voiceChannel.channelId}>`
        );
      }
    } catch (error) {
      console.log(error);
      await interaction.reply("You are not in a voice channel");
    }
  },
};
