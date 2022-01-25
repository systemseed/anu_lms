/**
 * Converts an HTML hexadecimal color code into a CSS rgba format with optional opacity argument.
 * Credit: https://stackoverflow.com/a/51564734
 * @param  {string} hex       The color in hex format as defined in the MUI theme.
 * @param  {Number} [alpha=1] The value for the target alpha (opacity).
 * @return {string}           The rgba value ready to use as a CSS value.
 */
const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

/**
 * Debounces any function by a given timeout.
 * Credit: https://www.vhudyma-blog.eu/debounce-in-react/
 * @param  {Function} callback The function to call when the debouncer ends.
 * @param  {Number} [wait=300] How many milliseconds to wait until debouncing occurs.
 * @return {Function}          The debounced function.
 */
const debounce = (callback, wait = 300) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), wait);
  };
};

const formatTime = (seconds) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
};

const pad = (string) => {
  return ('0' + string).slice(-2);
};

export { debounce, formatTime, hex2rgba };
