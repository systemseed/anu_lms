/**
 * Converts a string into camelCase.
 * See https://en.wikipedia.org/wiki/Letter_case#Special_case_styles
 * @param  {String} string The string to be converted to camelCase.
 * @return {String}        The resulting string converted to camelCase.
 */
const camelcase = str => (
  str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
);

export {
  camelcase,
};
