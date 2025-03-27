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

const downloadSingleSong = (id) => {
return youtubedl("https://youtube.com/watch/?v=" + id, {
  output: `assets/music/%(id)s.%(ext)s`,
  ffmpegLocation: ffmpegPath,
  extractAudio: true,
  audioFormat: "m4a",
  noOverwrites: true,
  noMtime: true,
  noPostOverwrites: true,
  concurrentFragments: 4,
  ignoreErrors: true,
  noPlaylist:true,
  f: "bestaudio",
});
}

const download = async (url, songLoadedCallback, statusChangedCallback) => {
  const fs = require("fs/promises");

  // TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
  // TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
  // TypeScript: import ytdl = require('ytdl-core'); with neither of the above
  await statusChangedCallback(`Getting videos from url...`);
  let songs = (await getVideoIDs(url)).split("\n"); //.split("\n");

  await statusChangedCallback(`Got all videos from url`);

  const progressCallback = async (
    word,
    index,
    length
  ) => {
 
    await statusChangedCallback(
      `${word}, ${index+1} / ${length} - ${((index+1) / length) * 100}%`
    );
  };

  progressCallback(0, songs.length);
  for (const [i, id] of songs.entries()) {
    try {
      //await progressCallback(i, songs.length, false, true);
      await fs.access(createFileFromId(id));
      await progressCallback("Loaded", i, songs.length);
    } catch (e) {
      await progressCallback("Downloading", i, songs.length);
      await downloadSingleSong(id)
      await progressCallback("Downloaded", i, songs.length);
    }

    await songLoadedCallback([id]);
    await progressCallback("Pushed to queue", i, songs.length);
  }

  await progressCallback(
    `Finished loading all songs, adding to queue or playing if queue is empty`
  );

  await setTimeout(() => {}, 5000);

//  return { downloadedSongs: songs };
};
module.exports = { download };
