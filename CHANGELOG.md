# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
 - Fixed Course nested content clean up on deletion
 - Fixed Course redirecting for translated lesson

### Changed
 - Improve 'Hide correct answers' functionality to answers are not returned at all to front end on submission
 - Improve 'Make single submission' functionality to not allow submission in different browser window

### Added 
 - Add multiple highlight paragraph types: full width, with icon, marker – with four colors each

## [2.0.0] - 2021-07-14
### Added
 - Changelog for documenting features
 - New section 'Settings' for Quizzes for configuring quiz settings. Available to any user with the permission to add or edit
   quiz content.
 - New quiz setting 'Hide correct answers' which will hide the display of correct answers to users
   when they submit a quiz. Default value is disabled.
 - New quiz setting 'Make single submission' which will only allow one user submission per quiz. On clicking
   submit button, users will see an alert prompting them to confirm submission. Once submitted correct andswers and
   scores will be displayed. On page refresh the quiz displays the users answers, their score, and the quiz is not able to be
   submitted. Default value is disabled.
