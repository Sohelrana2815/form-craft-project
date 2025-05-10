// src/utils/stringUtils.js
export const truncateString = (str, maxLength) => {
  if (!str) {
    return ""; // Handle cases where the string is null or undefined
  }
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
};
