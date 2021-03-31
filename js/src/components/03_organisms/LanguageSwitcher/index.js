import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

import LanguageLink from '../../01_atoms/LanguageLink';
import LanguageDropdown from '../../02_molecules/LanguageDropdown';
import { getLanguageSettings, getLangCode } from '../../../utils/settings';

const LanguageSwitcher = ({ label, width }) => {
  const langSettings = getLanguageSettings();
  const languages =
    langSettings &&
    langSettings.links &&
    Object.keys(langSettings.links).map(code => ({
      code,
      ...langSettings.links[code],
    }));
  const orderedLanguages = languages.sort((a, b) => a.weight - b.weight);

  if (languages.length === 0) {
    return null;
  }

  let mainLanguages = [];
  let secondaryLanguages = [];

  orderedLanguages.forEach(lang => {
    if (lang.is_main) {
      mainLanguages.push(lang);
    } else {
      secondaryLanguages.push(lang);
    }
  });

  // No main languages defined
  if (mainLanguages.length === 0) {
    mainLanguages = orderedLanguages.slice(0, 6);
    if (orderedLanguages.length > 6) {
      secondaryLanguages = orderedLanguages.slice(6);
    } else {
      secondaryLanguages = [];
    }
  }

  return (
    languages && (
      <Toolbar style={{ minHeight: 45 }}>
        {label && <img height={30} src={label.url} alt={label.alt} />}

        <div style={{ flexGrow: 1 }} />

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
              />
            ))}

            <LanguageDropdown options={secondaryLanguages} />
          </Box>
        </Box>
      </Toolbar>
    )
  );
};

LanguageSwitcher.propTypes = {
  label: PropTypes.shape().isRequired,
  // Inherited from withWidth HOC.
  width: PropTypes.string.isRequired,
};

export default withWidth()(LanguageSwitcher);
