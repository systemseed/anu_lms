<?php

/**
 * @file
 * Post update functions for anu_lms.
 */

/**
 * Enable paragraphs_selection.
 */
function anu_lms_post_update_paragraphs_selection() {
  \Drupal::service("module_installer")->install(['paragraphs_selection']);
}
