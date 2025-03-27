const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  demuxProbe,
  joinVoiceChannel,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { download } = require("./download");
const fs = require("fs").promises;
const { createReadStream } = require("node:fs");
const { join } = require("node:path");
const {
  pushToQueue,
  getFromQueue,
  popFromQueue,
  hasSongQueued,
} = require("./queue");
const { createFileFromId } = require("./path");
const { extractIdFromUrl } = require("./regex");
var player;

const joinChannel = async (voiceChannel, guild) => {
  if (voiceChannel?.channelId) {
    await joinVoiceChannel({
      channelId: voiceChannel.channelId,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
  }
};

const getVoiceChannel = async (member, guild) => {
  const voiceChannel = await guild.voiceStates.fetch(member.id);
  return voiceChannel;
};

async function probeAndCreateResource(readableStream) {
  const { stream, type } = await demuxProbe(readableStream);
  return createAudioResource(stream, { inputType: type });
}

const playFromQueue = async (guild) => {
  const { id } = getFromQueue(guild);
  const songPath = createFileFromId(id);
  if (songPath) {
    const resource = await probeAndCreateResource(createReadStream(songPath));

    player.play(resource);
  }
};

const skipItemFromQueue = async (guild) => {
  popFromQueue(guild.id);
  playFromQueue(guild.id);
};

const playMusic = async (interaction, url) => {
  const { member, guild, user } = interaction;
  const changeStatus = (status) => interaction.editReply(status);

  await interaction.reply("Acknowledged...");

  try {
    let connection = getVoiceConnection(guild.id);
    if (!connection) {
      const voiceChannel = await getVoiceChannel(member, guild);
      await joinChannel(voiceChannel, guild);
      await changeStatus("Joined channel...");
    }
    connection = getVoiceConnection(guild.id);

    if (!player) {
      player = createAudioPlayer();
    }

    const subscription = connection.subscribe(player);

    const id = extractIdFromUrl(url);

    if (!id) {
      throw Error("User provided invalid url, cannot extract id");
    }

    const playWaitingSong = async () => {
      if (!hasSongQueued(guild.id)) {
        const resource = await probeAndCreateResource(
          createReadStream(join(__dirname, `../assets/music/difficulty.m4a`))
        );

        player.play(resource);
      }
    };

    await playWaitingSong();

    const songLoadedCallback = (song) => {
      const hadSongQueued = hasSongQueued(guild.id);
      if (song) {
        pushToQueue(song, guild.id);
      }

      if (hadSongQueued) {
        return;
      }

      playFromQueue(guild.id);
    };

    download(url, songLoadedCallback, changeStatus, user).then(() =>
      interaction.deleteReply()
    );

    player.on(AudioPlayerStatus.Idle, async () => {
      popFromQueue(guild.id);
      playFromQueue(guild.id);
    });

    return subscription;
  } catch (error) {
    await changeStatus(
      "An error occurred when trying to play a song with message: " +
        error.message
    );
    await setTimeout(() => interaction.deleteReply(), 3000);
    console.error(error);
    return null;
  }
};

module.exports = { getVoiceChannel, playMusic, skipItemFromQueue };
