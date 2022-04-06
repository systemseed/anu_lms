<?php

namespace Drupal\Tests\anu_lms\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Verify that the configured defaults load as intended.
 *
 * @group anu_lms
 */
class HealthCheckTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['anu_lms', 'anu_lms_demo_content'];

  /**
   * Set to TRUE to strict check all configuration saved.
   *
   * @var bool
   *
   * @see \Drupal\Core\Config\Testing\ConfigSchemaChecker
   */
  protected $strictConfigSchema = FALSE;

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * Tests that the admin works.
   */
  public function testOpenAdminPage() {
    $this->drupalGet('admin');
    $this->assertSession()->statusCodeEquals(403);
  }

}
