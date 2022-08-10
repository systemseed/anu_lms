import React from 'react';

/**
 * Returns a text wrapped into html tag for visual highlighting of keywords.
 *
 * @param text
 *   Unprocessed text.
 * @returns string
 *   Processed text with html tags wrapped around search keywords.
 */
const getHighlightedText = (text) => {
  const urlParams = new URLSearchParams(window.location.search);
  let keywords = urlParams.get('hl');
  // If no searched keywords in the URL then return unmodified text.
  if (!keywords) {
    return text;
  }

  let highlightedText = text;
  // Remove whitespaces and convert a string into an array of searched keywords.
  keywords = keywords.trim().split(' ');
  // Replace each occurrence of the searched keyword.
  keywords.forEach((keyword) => {
    // Replace only full words (this is exactly what search api db searches).
    highlightedText = highlightedText.replaceAll(
      new RegExp(`(\\W|^)(${keyword})(\\W|$)`, 'gi'),
      '$1<strong class="highlight">$2</strong>$3'
    );
  });

  return highlightedText;
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
  const highlightedText = getHighlightedText(text);
  return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
};

export { highlightRawText, highlightText };
