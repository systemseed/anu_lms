# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

  -

## [2.3.3]

 - Fixed error when a course had no modules

## [2.3.2]

 - Fixed non-clickable links in tables

## [2.3.1]

 - Adds text formatting ability for paragraph types: "Image with caption (thumbnail)" and "List"

## [2.3.0]

 - Adds offline mode support for using with Progressive Web App module
 - Adds ability to translate strings for quiz submit buttons and info message
 - Improve data migration script for update from 1.x
 - Improve Course card on Courses page to lead directly to first lesson
 - Adds Table lesson section item

## [2.2.0]

 - Added linear progress support for courses
 - Improve 'Hide correct answers' functionality to answers are not returned at all to front end on submission
 - Improve 'Make single submission' functionality to not allow submission in different browser window
 - Fixed Course nested content clean up on deletion
 - Fixed Course redirecting for translated lesson

## [2.1.0] - 2021-07-19
### Added
 - Navigation button for end of module quizzes to move to the next module if it exists.
 - Adds multiple highlight paragraph types: full width, with icon, marker – with four colors each.
 - Adds additional space at bottom of lesson content and quiz pages.

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
