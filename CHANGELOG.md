# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
- Added automatic switching to the section with search keywords if the first section does not contain any
- Use "span" html tag instead of "marker" for highlighted paragraph
- Fixed allowed values for "align" property in ImageBulletItem component
- Changed default parse mode for search from "Single phrase" to "Multiple words" for better searchability

## [2.6.3]
- Changed range of weights on page where courses are sorted to support ordering of more than 40 courses per category.

## [2.6.2]
- Fixed Download button label translation for Resource paragraph.
- Added submodule which provides default configuration for LMS search functionality.
- Fixed course navigation overlapping by tables on mobiles.
- Added search keywords highlighting in lesson content.

## [2.6.1]
- Optimized heavy ->getAudios() method.
- Fixed ->getFirstAccessibleLesson() return type.
- Fixed Anu LMS module install on Drupal 9.4.4 by updating Pathauto configs.

## [2.6.0]
- Separated generic NodeNormalizer for all ANU nodes into individual normalizers
- Moved logic of getting page data from node managers to children of AnuLmsContentTypePluginBase (->getData() method)
- Added a patch to composer.json which improves performance of ->referencedEntities() for paragraphs
- For offline course download now we pass courses page urls instead of full course page entities
- Quiz node view handler now inherits from ModuleLesson instead of generic AnuLmsContentTypePluginBase (anu_lms_assessments)
- All methods related to Lesson manager now take lesson ID as an argument instead of loaded lesson node object
- Added strict types for method arguments and returning values for PHP
- Removed support of legacy Module node type for Groups (anu_lms_permissions) which prevented the module from install
- Removed handler of content type view for legacy Module node type
- Added a new method ->isOfflineSupported() which is a wrapper around checking whether pwa is enabled
- Optimized heavy ->getFirstAccessibleLesson() method
- Optimized heavy ->getLessonsAndQuizzes() method
- Optimized heavy ->getCourseProgress() method
- Optimized heavy ->getCoursesPagesByCourse() method
- LessonCompletedEvent now passes lesson_id instead of lesson object
- Method ->getPreviousLesson() was replaced with ->getPreviousLessonId()
- Method ->setPreviousLessonCompleted() was removed (it was unused)
- Added cache context to Normalizer for Groups permissions when anu_lms_assessment is enabled
- Enabled support of Normalizer caching when course progress is enabled
- Load certain parts of lessons and courses only when offline support is enabled (i.e. content_urls or audio)

## [2.5.7]
- Fixed Download button label translation for Resource paragraph.
- Fixed wrong domain name in the lesson sidebar on multi-domain sites.
- Fixed caching of unpublished content in the lesson sidebar.

## [2.5.6]
- Disabled cache when the progress is enabled.

## [2.5.5]
- Improved page loading performance by adding caching for serialized data.

## [2.5.4]
- Fixed issue with non-existing first lesson within the course progress.

## [2.5.3]
 - Added Event for completed all lessons.

## [2.5.2]
 - Fail CI build if there are uncommitted changes after `npm run build`.
 - Fix the issue when SW can't be registered due to a script redirect.
 - Fix course downloading the course from the courses page.

## [2.5.1]
 - Fixed bug when the quiz can't be finished due to missing complete callback.

## [2.5.1-beta]
 - Adding shamelessly forgotten built version of the app.

## [2.5.0-beta]
 - Added "Anu LMS Demo content" module.
 - Added path alias patterns for Anu LMS content types.
 - Added js-enabled basic testing.
 - Fixed no lesson error for quizzes.
 - Fixed bug with no previous lesson in quizzes.

## [2.5.0-alpha]
 - Move progress tracking to frontend and make progress available offline.
 - Add new DownloadCoursePopup component that offers to download courses with or without audio (for courses with audios)
 - Add a new isCompletedByUser helper method to lesson service.
 - Track the date when a lesson is completed.

## [2.4.13]
 - Fixed checkbox text wrap, so it is readable and go in multiple lines if text is longer

## [2.4.12]
 - Improved courses page loading performance by reducing the depth of references to load and explicitly loading lessons and quizzes urls.

## [2.4.11]
 - Fixed the finish button didn't respect language.

## [2.4.10]
 - Remove back button in header of lessons.
 - Deleted back button component.
 - Added back button in content navigation for easier navigation through lessons.
 - Small styles for buttons.

## [2.4.9]
 - Fixed Drupal 9 compatibility when pwa is enabled.
 - Fixed warning when PWA module didn't provide a version.
 - Added AudioPlayer and AudioBase components for handing audio.
 - Added Audio item for lessons.

## [2.4.8]
 - Updated REST endpoints for assessment to work with Drupal 9

## [2.4.7]
 - Do not lock drupal/shs and drupal/shs_chosen versions in composer

## [2.4.6]
 - Fixed a bug with denied access to lessons when course has linear progress enabled.

## [2.4.5]
 - Removed huge white space at the end of a lesson for mobile devices.

## [2.4.4]
 - Fix empty checkboxes bug.

## [2.4.3]
 - Fix service existence.
 - Fix empty quiz.

## [2.4.2]
 - Fix TypeError for content_moderation_entity_form_display_alter().

## [2.4.1]
 - Fixed static cache for lessons progress.
 - Fixed issue with not displaying unpublished courses on sorting of courses per category.
 - Refactored quiz submission API endpoint for better code readability, improved validation & access checks.
 - Refactored TODO list. Removed completed item.
 - Updated "ansi-regex" package to fix security vulnerabilities.
 - Added an event to be able to modify output of lesson page.
 - Added PHP code sniffer check to the CI.

## [2.4.0]
 - Quizzes submodule is optional and the core module has no longer a dependency on it.
 - Legacy module content type removed.
 - Use paragraph_selection to allow bundles to select the fields in which they appear as a choice.

## [2.3.19]
 - Fixed request for the correct answer to respect translation.

## [2.3.18]
 - Hides lesson/quiz title on mobile view (600px or smaller) based on results of user research.

## [2.3.17]
 - Added alignment option for "Highligt (with image)" paragraph.

## [2.3.16]
 - Added an event to be able to modify output of courses page.
 - Added an example module to show how to extend anu.

## [2.3.15]
 - Improved image quality for all image styles of ANU LMS.

## [2.3.14]
 - Added footnotes functionality for Table HTML format.

## [2.3.13]
 - Added Footnotes component.

## [2.3.12]
 - Fixed a bug where a course page with multiple categories timed out.
 - Fixed not working Finish button for quizzes.

## [2.3.11]
 - Reduced padding for `<p>` elements.
 - List bullets aligned to the top of the element.
 - Added ul/ol lists for Minimal HTML editor.

## [2.3.10]
 - Fixed bug where a course with no categories was displayed as locked.

## [2.3.9]
 - Added ability to sort order of courses in the same category.
 - Added locking of courses based on the order within their category.

## [2.3.8]
 - Added a progress bar for courses with linear progress enabled.
 - Added finish button at the end of courses without a quiz with customizable text and path.

## [2.3.7]
 - Updated @material-ui/core to the latest version.

## [2.3.6]
 - Fixed bug with not defined function in theme.js.

## [2.3.5]
 - Fixed compatibility with latest @material-ui version.

## [2.3.4]
 - Fixed Eslint errors and added jsx-a11y Eslint plugin to check for Accessibility problems.

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

## [2.1.0]
 - Navigation button for end of module quizzes to move to the next module if it exists.
 - Adds multiple highlight paragraph types: full width, with icon, marker – with four colors each.
 - Adds additional space at bottom of lesson content and quiz pages.

## [2.0.0]
 - Changelog for documenting features
 - New section 'Settings' for Quizzes for configuring quiz settings. Available to any user with the permission to add or edit
   quiz content.
 - New quiz setting 'Hide correct answers' which will hide the display of correct answers to users
   when they submit a quiz. Default value is disabled.
 - New quiz setting 'Make single submission' which will only allow one user submission per quiz. On clicking
   submit button, users will see an alert prompting them to confirm submission. Once submitted correct andswers and
   scores will be displayed. On page refresh the quiz displays the users answers, their score, and the quiz is not able to be
   submitted. Default value is disabled.
