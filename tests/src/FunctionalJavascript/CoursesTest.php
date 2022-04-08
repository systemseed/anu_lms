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
  protected static $modules = [
    'pathauto',
    'anu_lms_demo_content',
  ];

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
    $this->drupalGet('courses/courses-demo');
    $categoryTitle = $assert->waitForElementVisible('css', '#anu-application h2');
    $this->assertNotEmpty($categoryTitle);
    $this->assertEqual($categoryTitle->getText(), 'Getting started [DEMO]');

    $courseTitle = $assert->waitForElementVisible('css', '#anu-application h3');
    $this->assertNotEmpty($courseTitle);
    $this->assertEqual($courseTitle->getText(), 'Learn Anu lesson item types [DEMO]');
    $courseTitle->click();

    // After clicking on the title it should be inside the course.
    $courseTitle = $assert->waitForElementVisible('css', '#anu-application h1');
    $this->assertNotEmpty($courseTitle);
    $this->assertEqual($courseTitle->getText(), 'Learn Anu lesson item types [DEMO]');

    // Check for the second category.
    $this->drupalGet('courses/courses-demo');
    $categoryTitle = $assert->waitForElementVisible('css', '#anu-application div[data-anu-lms-section-heading]:nth-of-type(3) h2');
    $this->assertNotEmpty($categoryTitle);
    $this->assertEqual($categoryTitle->getText(), 'Developer guides [DEMO]');

    $courseTitle = $assert->waitForElementVisible('css', '#anu-application [data-anu-lms-section]:nth-of-type(4) h3');
    $this->assertNotEmpty($courseTitle);
    $this->assertEqual($courseTitle->getText(), 'Modules, lessons and sections [DEMO]');
    $courseTitle->click();

    // After clicking on the title it should be inside the course.
    $courseTitle = $assert->waitForElementVisible('css', '#anu-application h1');
    $this->assertNotEmpty($courseTitle);
    $this->assertEqual($courseTitle->getText(), 'Modules, lessons and sections [DEMO]');
  }

  /**
   * Test lesson content.
   */
  public function testLessons() {
    $assert = $this->assertSession();
    $this->drupalGet('lesson/headings');

    // Inside the course. Check the sidebar active element.
    $active = $assert->waitForElementVisible('css', 'div[data-anu-lms-navigation-item-status=active]');
    $this->assertNotEmpty($active);
    $this->assertEqual($active->getText(), 'Headings');

    $headingThree = $assert->waitForElementVisible('css', '#anu-application h3');
    $this->assertNotEmpty($headingThree);
    $this->assertEqual($headingThree->getText(), 'Lesson heading - h3');

    $next = $assert->waitForElementVisible('css', '[aria-label=Next]');
    $next->click();
    $lessonTitle = $assert->waitForElementVisible('css', '#anu-application h4');
    $this->assertNotEmpty($lessonTitle);
    $this->assertEqual($lessonTitle->getText(), 'Text');

    $linkInBody = $assert->waitForElementVisible('css', 'a[href="https://github.com/systemseed/anu_lms"]');
    $this->assertNotEmpty($linkInBody);
    $this->assertEqual($linkInBody->getText(), 'Link to GitHub repository.');

    $assert->waitForElementVisible('css', '[aria-label=Next]')->click();

    $assert->waitForElementVisible('css', '#anu-application ul li');
    // Check third item.
    $this->assertJsCondition('document.querySelector("#anu-application ul li:nth-child(3) div[data-anu-lms-list-item-text]").textContent === "Vanilla"');

    $assert->waitForElementVisible('css', '[aria-label=Next]')->click();

    $image = $assert->waitForElementVisible('css', '#anu-application img');
    $this->assertNotEmpty($image);
    $this->assertEqual($image->getAttribute('alt'), 'Image with caption');

    $assert->waitForElementVisible('css', '[aria-label=Finish]')->click();
    $assert->addressEquals('courses/courses-demo');
  }

}
