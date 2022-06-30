import React from 'react';

/**
 * Returns keywords to highlight from URL parameter.
 */
const getKeywords = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const highlight = urlParams.get('hl');

  return highlight ? highlight.replace(/[<>]/, '') : null;
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

  // We need to wrap all keywords matches by `strong` tag
  // but have to ignore matches inside tag attributes,
  // like urls, class names etc.
  // The logic of regular expression is find only matches
  // between `>` and `<` symbols.
  keywords
    .split(' ')
    .forEach(
      (keyword) =>
        (highlighted = highlighted.replaceAll(
          new RegExp(`(>[^<]*?)(${keyword})(.*?<)`, 'gi'),
          '$1<strong class="highlight">$2</strong>$3'
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

  const keywordList = keywords.split(' ');
  const words = text.split(' ');
  let highlighted = [];

  words.map((word, i, words) => {
    let isReplaced = false;
    // Have to use `for` instead of `map` for being able to call `break`.
    for (var j = 0; j < keywordList.length; j++) {
      const keyword = keywordList[j];
      if (word.toLowerCase().includes(keyword.toLowerCase())) {
        const index = word.toLowerCase().indexOf(keyword.toLowerCase());
        // Part of the word from the beginning of the word to begging of the keyword.
        if (index > 0) {
          highlighted.push(word.substring(0, index));
        }
        // Keyword itself.
        highlighted.push(
          <strong className="highlight">{word.substring(index, index + keyword.length)}</strong>
        );
        // Part of the word from the end of the keyword to the end of the word.
        if (word.length > index + keyword.length) {
          highlighted.push(word.substring(index + keyword.length));
        }
        isReplaced = true;
        break;
      }
    }
    // No keywords, just put original word.
    if (!isReplaced) {
      highlighted.push(word);
    }
    // Space after every word.
    if (i + 1 !== words.length) {
      highlighted.push(' ');
    }
  });

  return (
    <>
      {highlighted.map((part, i) => (
        <React.Fragment key={i}>{part}</React.Fragment>
      ))}
    </>
  );

  /*
  The solution looks heavy.
  It would be great if more beautiful way will be found.
  Another considered solution - convert markup to node with
  `dangerouslySetInnerHTML` attribute.
  Main disadvantage of this solution - extra wrapper, like `div`
  around rendered output, which may cause unwanted consequences
  for inline elements:

  ```
  keywords.split(' ').forEach(keyword => 
    highlighted = highlighted.replace(new RegExp(`(${keyword})`, 'gi'), '<strong class="highlight">$1</strong>')
  );

  return <div dangerouslySetInnerHTML={{__html: highlighted}} />;
  ```
  */
};

export { getKeywords, highlightRawText, highlightText };
