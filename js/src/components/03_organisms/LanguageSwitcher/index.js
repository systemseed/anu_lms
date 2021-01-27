import React from 'react';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

import LanguageLink from '../../01_atoms/LanguageLink';
import LanguageMenu from '../../02_molecules/LanguageMenu';
import { getLanguageSettings, getLangCode } from '../../../utils/settings';

const StyledBox = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.dark,
    paddingBottom: theme.spacing(0.5),
  },
}))(Box);

const useStyles = makeStyles(theme => ({
  link: {
    color: '#fff',
    lineHeight: '18px',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: 0,
    '&:hover': {
      backgroundColor: '#212121',
    },
  },
}));

const LanguageSwitcher = ({ label, width }) => {
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
        <Box
          ml={2}
          pt={0.5}
          position="absolute"
          display={isWidthUp('sm', width) ? 'block' : 'none'}
        >
          {label && <img height={30} src={label.url} alt={label.alt} />}
        </Box>

        <Container
          style={{
            display: 'flex',
            flexDirection: isWidthDown('xs', width) ? 'row' : 'row-reverse',
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box mr={2} pt={0.5} display={isWidthDown('xs', width) ? 'block' : 'none'}>
              {label && <img height={30} src={label.url} alt={label.alt} />}
            </Box>

            <Box>
              {mainLanguages.map(lang => (
                <LanguageLink
                  key={lang.code}
                  isActive={getLangCode() === lang.code}
                  label={lang.title}
                  url={lang.url}
                  className={classes.link}
                />
              ))}

              <LanguageMenu options={secondaryLanguages} />
            </Box>
          </Box>
        </Container>
      </StyledBox>
    )
  );
};

export default withWidth()(LanguageSwitcher);
