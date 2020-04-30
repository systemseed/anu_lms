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

  return (
    languages && (
      <StyledBox>
        <StyledContainer>
          <Box display="flex">
            {orderedLanguages.map(lang => (
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
