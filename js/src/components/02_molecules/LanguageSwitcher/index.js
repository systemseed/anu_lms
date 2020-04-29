import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';

import LanguageLink from '../../01_atoms/LanguageLink';
import { getLanguageSettings } from '../../../utils/settings';

const StyledContainer = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row-reverse',
    backgroundColor: theme.palette.secondary.dark,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))(Container);

const LanguageSwitcher = () => {
  const langSettings = getLanguageSettings();
  const curentLang = langSettings && langSettings.current_language;
  const languages = langSettings
    && langSettings.links
    && Object.keys(langSettings.links).map(code => ({
      code,
      ...langSettings.links[code]
    }));
  const orderedLanguages = languages.sort((a, b) => a.weight - b.weight);

  return (
    languages && (
      <StyledContainer>
        <Box display="flex">
          {orderedLanguages.map(lang => (
            <Box ml={3}>
              <LanguageLink
                isActive={curentLang === lang.code}
                label={lang.title}
                url={lang.url}
              />
            </Box>
          ))}
        </Box>
      </StyledContainer>
    )
  );
};

export default LanguageSwitcher;
