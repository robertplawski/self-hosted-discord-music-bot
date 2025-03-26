const ffmpegPath = require("ffmpeg-static");
const youtubedl = require("youtube-dl-exec");
const { createFileFromId } = require("./path");

const getVideoIDs = async (url) => {
  const data = await youtubedl(url, {
    noDownload: true,
    getId: true,
    ignoreErrors: true,
  });
  console.log(data);
  return data;
};

const download = async (url, callback, interaction) => {
  const fs = require("fs/promises");

  // TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
  // TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
  // TypeScript: import ytdl = require('ytdl-core'); with neither of the above
  await interaction.editReply(`Getting videos from url...`);
  let songs = (await getVideoIDs(url)).split("\n"); //.split("\n");
  let i = 1;
  await interaction.editReply(`Got all videos from url`);

  const progressCallback = async (
    index,
    length,
    finished = false,
    loaded = false
  ) => {
    const word = loaded
      ? finished
        ? "Loaded"
        : "Loading"
      : finished
      ? "Downloaded"
      : "Downloading";
    await interaction.editReply(
      `${word} ${index} / ${length} - ${(index / length) * 100}%`
    );
  };

  progressCallback(0, songs.length);
  for (id of songs) {
    try {
      //await progressCallback(i, songs.length, false, true);
      await fs.access(createFileFromId(id));
      await callback([id]);
      await progressCallback(i, songs.length, true, true);
    } catch (e) {
      await progressCallback(i, songs.length, false);
      await youtubedl("https://youtube.com/watch/?v=" + id, {
        output: `assets/music/%(id)s.%(ext)s`,
        ffmpegLocation: ffmpegPath,
        extractAudio: true,
        audioFormat: "m4a",
        noOverwrites: true,
        noMtime: true,
        noPostOverwrites: true,
        concurrentFragments: 4,
        //exctractorArgs: "youtube:player_client=web",
        ignoreErrors: true,
        // noPlaylist:true,
        f: "bestaudio",
      });
      await callback([id]);
      await progressCallback(i, songs.length, true);
    }
    i++;
  }
  await interaction.editReply(
    `Finished loading all songs, adding to queue or playing if queue is empty`
  );

  setTimeout(() => interaction.deleteReply(), 5000);

  return { downloadedSongs: songs };
};
module.exports = { download };
