<?php

namespace Drupal\anu_lms_search;

use Drupal\Core\Field\FieldItemList;
use Drupal\Core\TypedData\ComputedItemListTrait;
use Drupal\paragraphs\Entity\Paragraph;

/**
 * Definition of ModuleTitleItemList class.
 */
class ModuleTitleItemList extends FieldItemList {

  use ComputedItemListTrait;

  /**
   * {@inheritdoc}
   */
  protected function computeValue() {
    $this->ensurePopulated();
  }

  /**
   * Add property with the title of the module.
   */
  protected function ensurePopulated() {
    if (!isset($this->list[0])) {
      $lesson = $this->getEntity();

      // Ensure lesson owning this field actually exists.
      if (empty($lesson) || !$lesson->id()) {
        return;
      }

      /** @var \Drupal\anu_lms\Lesson $lesson_handler */
      $lesson_handler = \Drupal::service('anu_lms.lesson');

      // Ensure the lesson is inside a module.
      $module_id = $lesson_handler->getLessonModule($lesson->id());
      if (empty($module_id)) {
        return;
      }

      // Ensure that the paragraph with the module actually exists.
      $module = Paragraph::load($module_id);
      if (empty($module)) {
        return;
      }

      // If the current lesson matches the first lesson of a module, then we add
      // module's title to the index of this lesson.
      $lessons = $module->get('field_module_lessons')->getValue();
      if (!empty($lessons[0]['target_id']) && $lessons[0]['target_id'] === $lesson->id()) {
        $module_title = $module->get('field_module_title')->getString();
        $this->list[0] = $this->createItem(0, $module_title);
      }
    }
  }

}
