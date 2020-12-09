import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import LanguageLink from '../../01_atoms/LanguageLink';
import LanguageMenu from '../../02_molecules/LanguageMenu';
import { getLanguageSettings, getLangCode } from '../../../utils/settings';

const StyledBox = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.dark,
  },
}))(Box);

const StyledContainer = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
})(Container);

const useStyles = makeStyles({
  link: {
    color: '#fff',
    lineHeight: '18px',
    padding: '9px 12px',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: '#212121',
    },
  },
});

const LanguageSwitcher = () => {
  const classes = useStyles();
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

  let mainLanguages = [];
  let secondaryLanguages = [];

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
          <Box display="flex" flexWrap="wrap">

            {mainLanguages.map(lang => (
              <LanguageLink
                key={lang.code}
                isActive={getLangCode() === lang.code}
                label={lang.title}
                url={lang.url}
                className={classes.link}
              />
            ))}

            <LanguageMenu
              options={secondaryLanguages}
            />
              
          </Box>
        </StyledContainer>
      </StyledBox>
    )
  );
};

export default LanguageSwitcher;
