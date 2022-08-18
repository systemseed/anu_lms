import React from 'react';

/**
 * Grab search keywords from the URL if present.
 */
const urlParams = new URLSearchParams(window.location.search);

let searchKeywords = urlParams.get('hl');
if (searchKeywords) {
  searchKeywords = searchKeywords
    // Removes all special chars.
    .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, ' ')
    // Ensures no trailing whitespaces.
    .trim()
    // Separate string into array of keywords.
    .split(' ')
    // Filter out empty keywords.
    .filter((item) => !!item.trim());
}

/**
 * Indicates whether page has search keywords in the URL or not.
 * @type {boolean}
 */
const pageHasSearchKeywords = searchKeywords && searchKeywords.length > 0;

/**
 * Returns a text wrapped into html tag for visual highlighting of keywords.
 *
 * @param text
 *   Unprocessed text.
 * @param matchOnly
 *   Boolean indicating whether we need only to check if text matches any
 *   keyword.
 * @returns string|boolean
 *   Processed text with html tags wrapped around search keywords.
 */
const getHighlightedText = (text, matchOnly = false) => {
  // If no searched keywords in the URL then return unmodified text.
  if (!pageHasSearchKeywords) {
    return text;
  }

  let highlightedText = text;
  // Replace each occurrence of the searched keyword.
  try {
    let matches = [];
    searchKeywords.forEach((keyword) => {
      const searchRegexp = new RegExp(`(\\W|^)(${keyword})(\\W|$)`, 'gi');

      if (matchOnly) {
        const match = highlightedText.match(searchRegexp);
        if (match) {
          matches = [...matches, ...match];
        }
      } else {
        // Replace only full words (this is exactly what search api db
        // searches).
        highlightedText = highlightedText.replaceAll(
          searchRegexp,
          '$1<strong class="highlight">$2</strong>$3'
        );
      }
    });

    return matchOnly ? matches.length > 0 : highlightedText;
  } catch (e) {
    console.error('Error during search for highlighted keywords');
    console.error(e);
  }

  // Fallback to the default values in case if the error was thrown.
  return matchOnly ? false : text;
};

/**
 * Returns text with highlighted keywords as raw markup.
 * This method suitable for texts which will be rendered with
 * `dangerouslySetInnerHTML` attribute.
 * Usually it is used directly in `transform.paragraphs.js`.
 */
const highlightRawText = (text) => {
  return getHighlightedText(text);
};

/**
 * Returns text with highlighted keywords as a node.
 * This method suitable for texts which will be used
 * inside react fragment as a child.
 * Usually it should be used in component, for keeping
 * same props type for both cases, with highlighting and without.
 */
const highlightText = (text) => {
  return <span dangerouslySetInnerHTML={{ __html: getHighlightedText(text) }} />;
};

/**
 * Finds index of the first lesson section matching search keywords.
 * @param sections
 *   Array ot transformed lesson sections with paragraphs.
 * @returns number
 *   Index of the first lesson section matching search keywords.
 */
const getFirstSectionWithHighlightedKeywords = (sections) => {
  // Ensure sections present as an array.
  if (!sections || !Array.isArray(sections)) {
    return 0;
  }

  // Go through each section, find text strings and try to find keywords
  // in each of those. The first section which will be found matching any
  // of the keywords will be returned.
  const sectionIndex = sections.findIndex((section) => {
    let hasHighlightedText = false;
    section.forEach((paragraph) => {
      const textStrings = [];
      getAllTextStrings(paragraph, textStrings);
      textStrings.forEach((textString) => {
        const stringContainsKeywords = getHighlightedText(textString, true);
        hasHighlightedText = hasHighlightedText || stringContainsKeywords;
      });
    });
    return hasHighlightedText;
  });

  return sectionIndex > 0 ? sectionIndex : 0;
};

/**
 * Little helper which recursively collects all strings from paragraphs.
 * @param object
 *   Paragraph or paragraph child object with keys and values.
 * @param textStrings
 *   Array of all found text strings within paragraph.
 */
const getAllTextStrings = (object, textStrings) => {
  Object.entries(object).forEach(([, value]) => {
    if (typeof value === 'string') {
      textStrings.push(value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === 'string') {
          textStrings.push(item);
        } else if (typeof item === 'object' && item !== null) {
          getAllTextStrings(item, textStrings);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      getAllTextStrings(value, textStrings);
    }
  });
};

export {
  highlightRawText,
  highlightText,
  pageHasSearchKeywords,
  getFirstSectionWithHighlightedKeywords,
};
