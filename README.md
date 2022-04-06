[![CircleCI](https://circleci.com/gh/systemseed/anu_lms/tree/2.x.svg?style=svg)](https://circleci.com/gh/systemseed/anu_lms/tree/2.x)

## ANU LMS

Drupal module which adds E-Learning capabilities with knowledge assessment tools.

## Development

### Installation

If you don't have a local dev environment yet, we recommend [DDEV](https://ddev.com/) as it comes with all necessary tooling for Anu LMS development.

1. Install a clean Drupal 9 site ([Instructions for DDEV](https://ddev.readthedocs.io/en/latest/users/cli-usage/#drupal-9-quickstart)).
2. Prepare composer for Anu LMS installation:
  ```
  composer config minimum-stability dev
  composer config repositories.anu vcs git@github.com:systemseed/anu_lms.git
  composer req  --prefer-source systemseed/anu_lms:"2.x-dev"
  ```
3. Enable Anu LMS module and the demo content
```
drush pm:enable anu_lms anu_lms_demo_content
drush cex
```
4. Disable Drupal cache to see your code changes immediately. [Instructions](https://www.drupal.org/node/2598914).
5. Install and configure [PWA](https://www.drupal.org/project/pwa) module to
enable Anu offline capabilities.

### React development

Node.js & NPM are required to build Javascript files.

The React app sources are stored in `./js/src` folder of the module. To prepare React app for development, perform the following:

1. `cd` into `anu_lms/js` foloder
2. Run `npm install`
3. Run `npm run watch`
4. Make changes to JS code. After page refresh you should see your changes in your local Drupal site.
5. When the changes are ready, run `npm run format`, `npm run lint-fix` and `npm run lint` and fix any code styling issues. Some IDEs can handle it automatically.
6. Run `npm run build` to build final JS bundle files.

## Demo content

To install some demo content for learning and testing, enable “Anu LMS Demo
content” module.

```
drush pm:enable anu_lms_demo_content
```

Demo courses page will be available at /anu-demo after module installation.

All demo content is deleted on module uninstall.

## TODO List

### Beta release:
* Add path alias patterns https://github.com/systemseed/anu_lms/issues/160
* Provide documentation for recommended permission configuration after module's installation
* Add a validation for quiz content creating experience. I.e. do not allow multiple options for single option response.
* Add normal UI for errors handling on quizzes instead of ugly alert().
* Disable access to lessons when course is not in the group
* Add basic automated tests coverage https://github.com/systemseed/anu_lms/issues/157

### Full release
* https://github.com/systemseed/anu_lms/issues/161
* Disabled Slider has small balloon offset
* Create default courses page https://github.com/systemseed/anu_lms/issues/158
* Create a style guide
* Documentation
* Integration with [Drupal.org](https://www.drupal.org/project/anu_lms)

### To discuss
* Potential issue with display of quiz scoring after the amount of quiz questions has changed (You scored X out of Y).
* Get rid of Features dependency - we may let developers decide how they want to get ANU LMS updates
* Get rid of Rest Entity Recursive dependency for better performance
