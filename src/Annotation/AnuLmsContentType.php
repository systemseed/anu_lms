<?php

namespace Drupal\anu_lms\Annotation;

use Drupal\Component\Annotation\Plugin;
use Drupal\Core\Annotation\Translation;

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
  public string $id;

  /**
   * The human-readable name of the plugin.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public Translation $title;

  /**
   * The description of the plugin.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public Translation $description;

}
