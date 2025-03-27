const { EmbedBuilder } = require("discord.js");
const { getProgressBar } = require("./progressBar");

const COLOR = 0x0099ff;

const getNowPlayingQueueEmbed = ({
  url,
  title,
  channel,
  requestedBy,
  thumbnail,
  duration,
}) => {
  return new EmbedBuilder()
    .setTitle(`${title} - ${channel} `)
    .setDescription(getProgressBar(0, duration))
    .setColor(COLOR)
    .setURL(url)
    .setAuthor({
      name: `(requested by ${requestedBy.tag})`,
      url,
    })

    .setImage(thumbnail)
    .setTimestamp();
};

const getQueueEmbed = (queue) => {
  const defaultFields = [
    { name: "Queue is empty", value: "Try playing something..." },
  ];
  const fields =
    queue.length == 0
      ? defaultFields
      : queue.map(({ id, title, channel, requestedBy }, index) => {
          return {
            name: `${index + 1}. ${title} - ${channel} (${id})`,
            value: `Added by ${requestedBy}`,
          };
        }); //[{ name: "1. song - author ()", value: "Added by ..." }];

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
      .addFields(fields)
  );
};

module.exports = { getNowPlayingQueueEmbed, getQueueEmbed };
