import React from 'react';
import Box from '@material-ui/core/Box';
import paragraphMappings from '@anu/utilities/paragraphMappings';

const Paragraphs = ({ items, ...props }) => {
  return items.map((item) => {
    if (item.bundle in paragraphMappings) {
      const Component = paragraphMappings[item.bundle];
      return (
        <Box mt={4} mb={4} key={item.id}>
          <Component {...props} {...item} />
        </Box>
      );
    }
    return null;
  });
};

export default Paragraphs;
