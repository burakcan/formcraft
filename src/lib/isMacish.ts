export function isMacish() {
  var macOsPattern = /Mac|iPod|iPhone|iPad/;
  return typeof window !== "undefined" &&
    navigator.userAgent.match(macOsPattern)
    ? true
    : false;
}
