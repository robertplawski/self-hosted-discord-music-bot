const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
} = require("@discordjs/voice");
const { createReadStream } = require("node:fs");
const { join } = require("node:path");
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

const playMusic = async (guild, url) => {
  try {
    const connection = getVoiceConnection(guild.id);

    const player = createAudioPlayer();
    const subscription = connection.subscribe(player);

    const match = url.match(/(?<=v=)[^&]{11}/);
    if (!match) {
      console.log("invalid id");
      return null;
    }
    const id = match[0];
    const filedir = join(__dirname, `../assets/music/${id}.m4a`);
    const resource = await probeAndCreateResource(createReadStream(filedir));
    console.log(resource);
    player.on("error", (error) => {
      console.error(
        `Error: ${error.message} with resource ${error.resource.metadata.title}`
      );
    });
    player.play(resource);
    /*
    // subscription could be undefined if the connection is destroyed!
    if (subscription) {
      // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
      setTimeout(() => {
        subscription.unsubscribe();
        player.stop();
      }, 5_000);
    }*/
    return subscription;
  } catch (error) {
    console.error(error);
    return null;
  }
};
module.exports = { getVoiceChannel, playMusic };
