import React from 'react';

/**
 * Returns keywords to highlight from URL parameter.
 */
const getKeywords = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const highlight = urlParams.get('hl');

  return highlight ?? null;
};

/**
 * Returns text with highlighted keywords as raw markup.
 * This method suitable for texts which will be rendered with
 * `dangerouslySetInnerHTML` attribute.
 * Usually it can be used directly in `transform.paragraphs.js`.
 */
const highlightRawText = (text) => {
  const keywords = getKeywords();
  if (!keywords) {
    return text;
  }

  let highlighted = text;

  keywords
    .split(' ')
    .forEach(
      (keyword) =>
        (highlighted = highlighted.replace(
          new RegExp(`(${keyword})`, 'gi'),
          '<strong class="highlight">$1</strong>'
        ))
    );

  return highlighted;
};

/**
 * Returns text with highlighted keywords as a node.
 * This method suitable for texts which will be used
 * inside react fragment as a child.
 * Usually it should be used in component, for keeping
 * same props type for both cases, with highlighting and without.
 */
const highlightText = (text) => {
  const keywords = getKeywords();
  if (!keywords) {
    return text;
  }

  let regexList = [];
  keywords.split(' ').forEach((keyword) => regexList.push(new RegExp(`(${keyword})`, 'gi')));

  const words = text.split(' ');
  return (
    <>
      {words.map((word, i, words) => (
        <React.Fragment key={i}>
          {regexList.some((rx) => rx.test(word)) ? (
            <strong className="highlight">{word}</strong>
          ) : (
            <>{word}</>
          )}
          {i + 1 !== words.length && <> </>}
        </React.Fragment>
      ))}
    </>
  );

  /*
  The solution looks a bit heavy.
  It would be great if more beautiful way will be found.
  Another considered solution - convert markup to node with
  `dangerouslySetInnerHTML` attribute.
  Main disadvantage of this solution - extra wrapper, like `div`
  around rendered output:

  ```
  keywords.split(' ').forEach(keyword => 
    highlighted = highlighted.replace(new RegExp(`(${keyword})`, 'gi'), '<strong class="highlight">$1</strong>')
  );

  return <div dangerouslySetInnerHTML={{__html: highlighted}} />;
  ```
  */
};

export { getKeywords, highlightRawText, highlightText };
