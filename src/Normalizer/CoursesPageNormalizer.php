<?php

namespace Drupal\anu_lms\Normalizer;

/**
 * Converts Courses Page node object structure to a JSON array structure.
 */
class CoursesPageNormalizer extends NodeNormalizerBase {

  /**
   * {@inheritdoc}
   */
  protected array $supportedBundles = ['courses_page'];

}
