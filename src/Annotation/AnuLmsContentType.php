<?php

namespace Drupal\anu_lms\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines anu_lms_content_type annotation object.
 *
 * @Annotation
 */
class AnuLmsContentType extends Plugin {

  /**
   * The plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The human-readable name of the plugin.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $title;

  /**
   * The description of the plugin.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $description;

}
