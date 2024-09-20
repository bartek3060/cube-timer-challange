export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);

  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (minutes > 0) {
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}.${String(
      milliseconds
    ).slice(0, 2)}`;
  } else {
    return `${formattedSeconds}:${String(milliseconds).slice(0, 2)}`;
  }
}
