### Beta release:
* Add path alias patterns
* Make “Back” button configurable
* Fix eslint warnings
* Provide documentation for recommended permission configuration after module's installation
* Add a validation for quiz content creating experience. I.e. do not allow multiple options for single option response.
* Add normal UI for errors handling on quizzes instead of ugly alert().
* Disable access to lessons when course is not in the group
* Add basic automated tests coverage

### Full release
* Disabled Slider has small balloon offset
* Create default courses page
* Create a style guide
* Documentation

### To discuss
* Potential issue with display of quiz scoring after the amount of quiz questions has changed (You scored X out of Y).
* Get rid of Features dependency - we may let developers decide how they want to get ANU LMS updates
* Get rid of Rest Entity Recursive dependency for better performance
