<?php

namespace Drupal\anu_lms;

/**
 * Interface for anu_lms_content_type plugins.
 */
interface AnuLmsContentTypeInterface {

  /**
   * Returns the translated plugin label.
   *
   * @return string
   *   The translated title.
   */
  public function label(): string;

  /**
   * Returns the libraries for the page.
   *
   * @return array
   *   The definition to use for an #attached in a render array.
   */
  public function getAttachments(): array;

}
