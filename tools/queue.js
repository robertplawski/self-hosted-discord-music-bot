var queue = {};

const pushToQueue = (songId, guild) => {
  console.log(queue);

  if (!queue[guild]) {
    queue[guild] = [];
  }
  queue[guild].push(songId);
};

const getFromQueue = (guild) => {
  if (queue && !queue[guild]) {
    return;
  }

  return queue[guild][0];
};

const popFromQueue = (guild) => {
  console.log(queue);
  if (queue && !queue[guild]) {
    return;
  }
  return queue[guild].shift();
};

const hasSongQueued = (guild) => {
  if (queue && !queue[guild]) {
    return;
  }
  if (queue[guild].length == 0) {
    return false;
  }
  return true;
};

const getQueueForGuild = (guild) => {
  if (queue && !queue[guild]) {
    return [];
  }
  return queue[guild];
};

module.exports = {
  pushToQueue,
  popFromQueue,
  hasSongQueued,
  getFromQueue,
  getQueueForGuild,
};
