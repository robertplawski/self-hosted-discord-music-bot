const { EmbedBuilder } = require("discord.js");
const { getProgressBar } = require("./progressBar");

const COLOR = 0x0099ff;

const getNowPlayingQueueEmbed = (
  url,
  title,
  author,
  requestedBy,
  thumbnail,
  duration
) => {
  return new EmbedBuilder()
    .setTitle(`${title} - ${author} `)
    .setDescription(getProgressBar(0, duration))
    .setColor(COLOR)
    .setURL(url)
    .setAuthor({
      name: `(requested by ${requestedBy})`,
      url,
    })

    .setImage(thumbnail)
    .setTimestamp();
};

const getQueueEmbed = (queue) => {
  return (
    new EmbedBuilder()
      .setTitle(`Music queue`)
      //.setDescription(getProgressBar(0, duration))
      .setColor(COLOR)
      //.setURL(url)
      //.setAuthor({
      /// name: `(requested by ${requestedBy})`,
      // url,
      ///})
      .setTimestamp()
      .addFields({ name: "1. Stab - Mortician", value: "Added by" })
  );
};

module.exports = { getNowPlayingQueueEmbed, getQueueEmbed };
