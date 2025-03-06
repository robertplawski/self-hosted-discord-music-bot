const { getVoiceConnection } = require("@discordjs/voice");

const getVoiceChannel = async (member, guild) => {
  /*const voiceChannel = guild.channels.cache.find(
    (channel) => channel.type === "voice" && channel.members.has(member.id)
  );*/
  console.log(guild.channels);
  const voiceChannel = await guild.voiceStates.fetch(member.id);
  console.log(voiceChannel);
  return voiceChannel;
};

const playMusic = async (guild) => {
  try {
    const connection = getVoiceConnection(guild.id);
    const player = createAudioPlayer();
    const resource = createAudioResource("./assets/music/test.mp3");
    player.play(resource);
    const subscription = connection.subscribe(audioPlayer);

    // subscription could be undefined if the connection is destroyed!
    if (subscription) {
      // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
      setTimeout(() => {
        subscription.unsubscribe();
        player.stop();
      }, 5_000);
    }
    return subscription;
  } catch (error) {
    console.error(error);
    return null;
  }
};
module.exports = { getVoiceChannel, playMusic };
