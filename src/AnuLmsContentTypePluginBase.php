<?php

namespace Drupal\anu_lms;

use Drupal\Component\Plugin\PluginBase;

/**
 * Base class for anu_lms_content_type plugins.
 */
abstract class AnuLmsContentTypePluginBase extends PluginBase implements AnuLmsContentTypeInterface {

  /**
   * {@inheritdoc}
   */
  public function label(): string {
    // Cast the label to a string since it is a TranslatableMarkup object.
    return (string) $this->pluginDefinition['label'];
  }

  /**
   * {@inheritdoc}
   */
  public function getAttachments(): array {
    return [
      'library' => ['anu_lms/lesson'],
    ];
  }

}
