<?php

namespace Drupal\Tests\anu_lms\FunctionalJavascript;

use Drupal\FunctionalJavascriptTests\WebDriverTestBase;

/**
 * Test the courses.
 *
 * @group anu_lms
 */
class CoursesTest extends WebDriverTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = ['anu_lms_demo_content'];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'classy';

  /**
   * Set to TRUE to strict check all configuration saved.
   *
   * @var bool
   *
   * @see \Drupal\Core\Config\Testing\ConfigSchemaChecker
   */
  protected $strictConfigSchema = FALSE;

  /**
   * Test there is some courses.
   */
  public function testCoursesPage() {
    $assert = $this->assertSession();

    // Get the main page.
    $this->drupalGet('anu-demo');
    $categoryTitle = $assert->waitForElementVisible('css', '#anu-application h2');
    $this->assertNotEmpty($categoryTitle);
    $this->assertEqual($categoryTitle->getText(), 'Getting started [DEMO]');

    $courseTitle = $assert->waitForElementVisible('css', '#anu-application h3');
    $this->assertNotEmpty($courseTitle);
    $this->assertEqual($courseTitle->getText(), 'Learn Anu lesson item types [DEMO]');
    $courseTitle->click();
  }

}
