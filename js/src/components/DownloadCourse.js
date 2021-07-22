import React from 'react';
import { Box, Button, withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SyncIcon from '@material-ui/icons/Sync';

import { transformLessonPage } from '@anu/utilities/transform.lesson';

import 'regenerator-runtime/runtime';

const getPwaSettings = () => (drupalSettings && drupalSettings.pwa_settings) || null;

const ResultMessage = withStyles((theme) => ({
  root: {
    fontSize: '0.8rem',
    marginTop: theme.spacing(1),
    color: '#ffab00',
  },
}))(Box);

class DownloadCourse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      loading: false,
    };

    this.handleDownload = this.handleDownload.bind(this);
    this.saveUrlToCache = this.saveUrlToCache.bind(this);
    this.cacheLessonsAndReturnLessonImages = this.cacheLessonsAndReturnLessonImages.bind(this);
    this.getParagraphImagesFromContent = this.getParagraphImagesFromContent.bind(this);
  }

  /**
   * Parses lesson content to get list of paragraph image urls.
   */
  getParagraphImagesFromContent(pageContent) {
    const regExpString = /<div id="anu-application" data-application="(.*?)">/g;
    const regExpResult = regExpString.exec(pageContent);

    // Unescape application data value,
    // see https://stackoverflow.com/a/34064434/2220424
    const escapedAppData = new DOMParser().parseFromString(regExpResult[1], 'text/html');
    const unescapedAppData = escapedAppData.documentElement.textContent;

    const parsedAppData = JSON.parse(unescapedAppData);

    // Get object from page json data.
    // const lessonNode = getNode(lessonJson.node);
    const transformedAppData = transformLessonPage(parsedAppData);
    const paragraphUrls = [];

    // Gather lesson images.
    if (transformedAppData.lesson) {
      transformedAppData.lesson.sections.map((section) => {
        section.map((paragraph) => {
          for (const [key, value] of Object.entries(paragraph)) {
            if (typeof value === 'object' && value.type && value.type === 'image') {
              paragraphUrls.push(value.url);
            }
          }
        });
      });
    }

    // Gather quiz images.
    if (transformedAppData.quiz) {
      transformedAppData.quiz.questions.map((item) => {
        for (const [key, value] of Object.entries(item)) {
          if (typeof value === 'object' && value.type && value.type === 'image') {
            paragraphUrls.push(value.url);
          }
        }
      });
    }

    return paragraphUrls;
  }

  /**
   * Cache lessons and returns list of lesson images (from paragraphs) to cache.
   */
  async cacheLessonsAndReturnLessonImages(lessonUrls) {
    return Promise.all(
      lessonUrls.map(async (url) => {
        // Makes request to get lessons data.
        const request = new Request(url);
        const response = await fetch(request, { mode: 'no-cors' });
        const responseClone = response.clone();
        // Parse lesson content to get Lesson json data.
        const responseContent = await response.text();
        const paragraphUrls = this.getParagraphImagesFromContent(responseContent);
        // Put lesson to the pwa cache.
        const cacheName = getPwaSettings().current_cache;
        const cache = await caches.open(cacheName);

        await cache.put(request, responseClone);

        // Returns parsed lesson paragraph urls.
        return paragraphUrls;
      })
    );
  }

  async handleDownload() {
    const { course } = this.props;
    let urlsToCache = [];

    // Indicate loading process.
    this.setState({ loading: true });

    try {
      // Cache Homepage with language prefix.
      urlsToCache.push(Drupal.url(''));

      // Cache Courses pages where course categories referenced.
      if (course.courses_pages) {
        course.courses_pages.map((coursesPage) => urlsToCache.push(coursesPage.url));
      }

      // Cache Course page (redirect).
      urlsToCache.push(course.url);

      // Cache Course image for preview on Courses page.
      if (course.image && course.image.url) {
        urlsToCache.push(course.image.url);
      }

      // Prepare Module related urls to cache.
      let lessonUrls = [];
      course.content.map((module) => {
        // Module's lessons urls.
        const moduleLessonUrls = module.lessons.map((lesson) => lesson.url);
        lessonUrls = lessonUrls.concat(moduleLessonUrls);

        // Quiz url.
        if (module.quiz && module.quiz.url) {
          lessonUrls.push(module.quiz.url);
        }
      });

      // Cache lessons and returns list of lesson images (from paragraphs) to cache.
      const lessonImageUrls = await this.cacheLessonsAndReturnLessonImages(lessonUrls);
      urlsToCache = urlsToCache.concat(lessonImageUrls.flat());

      // Save collected urls to cache.
      await this.saveUrlToCache(urlsToCache);

      // Updates loading status.
      this.setState({ loading: false, result: 'success' });
    } catch (error) {
      // Updates loading status.
      this.setState({ loading: false, result: 'error' });
      console.error(`Could not download course content: ${error}`);
    }
  }

  /**
   * Save passed urls to the pwa cache.
   */
  async saveUrlToCache(urls) {
    return Promise.all(
      urls.map(async (url) => {
        // Makes request to get data.
        const request = new Request(url);
        const response = await fetch(request, { mode: 'no-cors' });
        const responseClone = response.clone();

        // Put response to the pwa cache.
        const cacheName = getPwaSettings().current_cache;
        const cache = await caches.open(cacheName);
        await cache.put(request, responseClone);
      })
    );
  }

  render() {
    const { loading, result } = this.state;

    return (
      <>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<SyncIcon />}
          onClick={this.handleDownload}
          disabled={loading}
          style={{ width: 'max-content', margin: 8 }}
        >
          {Drupal.t('Make available offline', {}, { context: 'ANU LMS' })}

          {loading && <CircularProgress size={24} style={{ position: 'absolute' }} />}
        </Button>

        {result && result === 'success' && (
          <ResultMessage>
            {Drupal.t('Successfully downloaded to your device!', {}, { context: 'ANU LMS' })}
          </ResultMessage>
        )}

        {result && result === 'error' && (
          <ResultMessage>
            {Drupal.t(
              'Could not download the course. Please contact site administrator.',
              {},
              { context: 'ANU LMS' }
            )}
          </ResultMessage>
        )}
      </>
    );
  }
}

export default DownloadCourse;
