/**
 * Determines if the current device is running an older version of iOS (pre-iOS 10).
 * This is useful for applying platform-specific workarounds for older iOS devices.
 * 
 * @returns {boolean} True if the device is running an iOS version older than 10, false otherwise.
 */
export const isOldIOS = (): boolean => {
  if (typeof navigator === "undefined") return false;

  // Regex to match the iOS version in the user agent string.
  const match = /CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent);
  if (!match) return false;

  // Extract and normalize the iOS version number.
  const version = match[1]
    .replace("undefined", "3_2") // Default to iOS 3.2 if version is undefined.
    .replace("_", ".")          // Replace underscores with periods for standard decimal format.
    .replace("_", "");          // Remove any additional underscores.

  return parseFloat(version) < 10;
};
