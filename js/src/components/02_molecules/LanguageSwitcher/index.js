import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';

import LanguageLink from '../../01_atoms/LanguageLink';
import { getLanguageSettings, getLangCode } from '../../../utils/settings';

const StyledBox = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.dark,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))(Box);

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
})(Container);

const LanguageSwitcher = () => {
  const langSettings = getLanguageSettings();
  const languages = langSettings
    && langSettings.links
    && Object.keys(langSettings.links).map(code => ({
      code,
      ...langSettings.links[code],
    }));
  const orderedLanguages = languages.sort((a, b) => a.weight - b.weight);

  if (languages.length === 0) {
    return null;
  }

  const mainLanguages = [];
  const secondaryLanguages = [];

  orderedLanguages.forEach((lang) => {
    if (lang.is_main) {
      mainLanguages.push(lang);
    } else {
      secondaryLanguages.push(lang);
    }
  });

  // No main languages defined
  if (mainLanguages.length === 0) {
    mainLanguages = orderedLanguages.slice(0,6);
    if (orderedLanguages.length > 6) {
      secondaryLanguages = orderedLanguages.slice(6);
    } else {
      secondaryLanguages = [];
    }
  }

  return (
    languages && (
      <StyledBox>
        <StyledContainer>
          <Box display="flex">
            {mainLanguages.map(lang => (
              <LanguageLink
                key={lang.code}
                isActive={getLangCode() === lang.code}
                label={lang.title}
                url={lang.url}
              />
            ))}
            {(secondaryLanguages.length > 0) && (
              <LanguageLink
                key="more"
                label="More"
                url="#"
              />
            ) && secondaryLanguages.map(lang => (
              <LanguageLink
                key={lang.code}
                isActive={getLangCode() === lang.code}
                label={lang.title}
                url={lang.url}
              />
            ))}
          </Box>
        </StyledContainer>
      </StyledBox>
    )
  );
};

export default LanguageSwitcher;
