const ffmpegPath = require("ffmpeg-static");
const youtubedl = require("youtube-dl-exec");
const { createFileFromId, doesSongExist } = require("./path");

const getVideoIDs = async (url) => {
  const data = await youtubedl(url, {
    noDownload: true,
    getId: true,
    ignoreErrors: true,
  });
  return data.split("\n");
};

const downloadSingleSong = (id) => {
  const url = "https://youtube.com/watch/?v=" + id;

  return youtubedl(url, {
    output: `assets/music/%(id)s.%(ext)s`,
    ffmpegLocation: ffmpegPath,
    extractAudio: true,
    audioFormat: "m4a",
    noOverwrites: true,
    noMtime: true,
    noPostOverwrites: true,
    concurrentFragments: 4,
    ignoreErrors: true,
    noPlaylist: true,
    f: "bestaudio",
  });
};

const getSongMetadata = async (id) => {
  const url = "https://youtube.com/watch/?v=" + id;
  const data = await youtubedl(url, {
    j: true,
  });
  return data;
};

const download = async (url, songLoadedCallback, statusChangedCallback) => {
  await statusChangedCallback(`Getting videos from url...`);
  try {
    let songs = await getVideoIDs(url);

    await statusChangedCallback(`Got all videos from url`);

    const progressCallback = async (word, index, length) => {
      await statusChangedCallback(
        `${word}, ${index + 1} / ${length} - ${((index + 1) / length) * 100}%`
      );
    };

    await progressCallback("Starting", 0, songs.length);
    for (const [i, id] of songs.entries()) {
      try {
        await doesSongExist(id);
        await progressCallback("Loaded", i, songs.length);
      } catch (e) {
        await progressCallback("Downloading", i, songs.length);
        await downloadSingleSong(id);
        await progressCallback("Downloaded", i, songs.length);
      }

      await songLoadedCallback(id);
      await progressCallback("Pushed to queue", i, songs.length);
    }

    await progressCallback(
      `Finished loading all songs, adding to queue or playing if queue is empty`
    );
  } catch (e) {
    await statusChangedCallback("Error occurred when downloading songs: " + e);
  }
};
module.exports = { download, getVideoIDs, getSongMetadata };
