const ffmpegPath = require("ffmpeg-static");
const youtubedl = require("youtube-dl-exec");
const download = async (url) => {
  const fs = require("fs");
  // TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
  // TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
  // TypeScript: import ytdl = require('ytdl-core'); with neither of the above
  console.log(ffmpegPath);
  const data = await youtubedl(url, {
    output: `assets/music/%(id)s.%(ext)s`,
    ffmpegLocation: ffmpegPath,
    extractAudio: true,
    audioFormat: "m4a",
    embedThumbnail: true,
    embedMetadata: true,
    f: "bestaudio",
  }); //.then((output) => console.log(output));
  console.log(data);
  return data;
  /*ytdl(url).pipe(
    fs.createWriteStream("./assets/music/video.mp4") // yeah yeah sanitization ofc
  );*/
};
module.exports = { download };
