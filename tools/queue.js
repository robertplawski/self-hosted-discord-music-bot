var queue = {};

const prepareGuildQueue = (guild) => {
  if (queue && !queue[guild]) {
    queue[guild] = [];
  }
}

const clearQueue = (guild) => {
  prepareGuildQueue(guild)
  queue[guild] = [];
};

const pushToQueue = (songId, guild) => {
  prepareGuildQueue(guild)
  queue[guild].push(songId);
};

const getFromQueue = (guild) => {
  prepareGuildQueue(guild)
  return queue[guild][0];
};

const popFromQueue = (guild) => {
  prepareGuildQueue(guild)
  return queue[guild].shift() ;
};

const hasSongQueued = (guild) => {
  prepareGuildQueue(guild)
  return queue[guild].length > 0
};

const getQueueForGuild = (guild) => {
  prepareGuildQueue(guild)
  return queue[guild];
};

module.exports = {
  pushToQueue,
  popFromQueue,
  hasSongQueued,
  getFromQueue,
  getQueueForGuild,
  clearQueue,
};
