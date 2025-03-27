function secondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
}

const getProgressBar = (now, end, length = 20) => {
  const percentage = now / end;
  const fillBarLength = Math.round(percentage * length);
  const emptyBarLength = length - fillBarLength;

  const fillBar = "#".repeat(fillBarLength);
  const emptyBar = "-".repeat(emptyBarLength);

  return `${secondsToTime(now)} [${fillBar}${emptyBar}] ${secondsToTime(end)}`;
};

module.exports = { getProgressBar };
