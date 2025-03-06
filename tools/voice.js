const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
  joinVoiceChannel,
} = require("@discordjs/voice");
const { download } = require("./download");
const fs = require("fs").promises;
const { createReadStream } = require("node:fs");
const { join } = require("node:path");

const joinChannel = async (voiceChannel, guild) => {
  // interaction.user is the object representing the User who ran the command
  // interaction.member is the GuildMember object, which represents the user in the specific guild
  if (voiceChannel?.channelId) {
    await joinVoiceChannel({
      channelId: voiceChannel.channelId,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
  }
};

const getVoiceChannel = async (member, guild) => {
  /*const voiceChannel = guild.channels.cache.find(
    (channel) => channel.type === "voice" && channel.members.has(member.id)
  );*/
  console.log(guild.channels);
  const voiceChannel = await guild.voiceStates.fetch(member.id);
  console.log(voiceChannel);
  return voiceChannel;
};

async function probeAndCreateResource(readableStream) {
  const { stream, type } = await demuxProbe(readableStream);
  return createAudioResource(stream, { inputType: type });
}

const playMusic = async (interaction, url) => {
  const { member, guild } = interaction;
  await interaction.reply("Working..");

  try {
    let connection = getVoiceConnection(guild.id);
    if (!connection) {
      //https://www.youtube.com/watch?v=DqBuIaa2-_s&pp=ygURa2F6aWsgdGF0YSBkaWxlcmE%3D
      const voiceChannel = await getVoiceChannel(member, guild);
      await joinChannel(voiceChannel, guild);
      await interaction.editReply("Joined channel...");
    }
    connection = getVoiceConnection(guild.id);

    const player = createAudioPlayer();
    const subscription = connection.subscribe(player);

    const match = url.match(/(?<=v=)[^&]{11}/);
    if (!match) {
      console.log("invalid id");
      await interaction.editReply("Invalid id");
      return;
    }
    const id = match[0];
    const filedir = join(__dirname, `../assets/music/${id}.m4a`);

    try {
      await fs.access(filedir);
    } catch (e) {
      // # plaese download it here

      await interaction.editReply("Started the download...");
      await download(url);
      await interaction.editReply("Finished the download...");
    }

    //https://www.youtube.com/watch?v=rYNbuSzzNrs&pp=ygURa2F6aWsgdGF0YSBkaWxlcmE%3D
    const resource = await probeAndCreateResource(createReadStream(filedir));

    player.play(resource);
    await interaction.editReply("Playing...");

    return subscription;
  } catch (error) {
    console.error(error);
    return null;
  }
};
module.exports = { getVoiceChannel, playMusic };
