// Legacy download course button. Will be removed on next release.
import React from 'react';
import PropTypes from 'prop-types';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { Box, Button, withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SyncIcon from '@material-ui/icons/Sync';
import SnackAlert from '@anu/components/SnackAlert';
import { transformLessonPage } from '@anu/utilities/transform.lesson';
import { getPwaSettings } from '@anu/utilities/settings';

import 'regenerator-runtime/runtime';

const ButtonWrapper = withStyles(() => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: ({ messageposition }) => (messageposition === 'left' ? 'row' : 'column'),
    alignItems: ({ messageposition }) => (messageposition === 'left' ? 'center' : 'flex-start'),
  },
}))(Box);

const ResultMessage = withStyles((theme) => ({
  root: {
    fontSize: '0.8rem',
    color: theme.palette.success.main,
    width: 280,
    position: 'absolute',
    bottom: ({ messageposition }) => (messageposition === 'left' ? 'auto' : 'calc(100% - 12px)'),
    left: ({ messageposition }) => (messageposition === 'left' ? 'auto' : theme.spacing(1)),
    right: ({ messageposition }) => (messageposition === 'left' ? '100%' : 'auto'),
    textAlign: ({ messageposition }) => (messageposition === 'left' ? 'right' : 'left'),
  },
}))(Box);

const StyledButton = withStyles((theme) => ({
  root: {
    width: 'max-content',
    margin: theme.spacing(1),
    marginTop: ({ messageposition }) =>
      messageposition === 'left' ? theme.spacing(1) : theme.spacing(2),
    background: '#f6f7f8',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(3),
    textTransform: 'none',
    fontWeight: 'normal',
  },
}))(Button);

class DownloadCourse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      loading: false,
      alertOpen: false,
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
          for (const [, value] of Object.entries(paragraph)) {
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
        for (const [, value] of Object.entries(item)) {
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
      if (course.courses_page_urls) {
        course.courses_page_urls.forEach((courses_page_url) => urlsToCache.push(courses_page_url));
      }

      // Cache Course page (redirect).
      urlsToCache.push(course.url);

      // Cache Course image for preview on Courses page.
      if (course.image && course.image.url) {
        urlsToCache.push(course.image.url);
      }

      // Getting lessons and quizzes urls.
      const lessonUrls = course.content_urls;

      // Cache lessons and returns list of lesson images (from paragraphs) to cache.
      const lessonImageUrls = await this.cacheLessonsAndReturnLessonImages(lessonUrls);
      urlsToCache = urlsToCache.concat(lessonImageUrls.flat());

      // Save collected urls to cache.
      await this.saveUrlToCache(urlsToCache);

      // Updates loading status.
      this.setState({ loading: false, result: 'success', alertOpen: true });
    } catch (error) {
      // Updates loading status.
      this.setState({ loading: false, result: 'error', alertOpen: true });
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
    const { loading, result, alertOpen } = this.state;
    const { messagePosition } = this.props;

    // Handling values needs to be done for both conditions
    // for preventing glitches on alert closing.
    let message = '';
    let severity = 'success';
    if (result === 'success') {
      message = Drupal.t('Successfully downloaded to your device!', {}, { context: 'ANU LMS' });
      severity = 'success';
    } else if (result === 'error') {
      message = Drupal.t(
        'Could not download the course. Please contact site administrator.',
        {},
        { context: 'ANU LMS' }
      );
      severity = 'warning';
    }

    return (
      <ButtonWrapper messageposition={messagePosition}>
        {result && result === 'success' && (
          <ResultMessage messageposition={messagePosition}>
            {Drupal.t('Successfully downloaded to your device!', {}, { context: 'ANU LMS' })}
          </ResultMessage>
        )}

        {result && result === 'error' && (
          <ResultMessage messageposition={messagePosition}>
            {Drupal.t(
              'Could not download the course. Please contact site administrator.',
              {},
              { context: 'ANU LMS' }
            )}
          </ResultMessage>
        )}

        <StyledButton
          variant="contained"
          color="default"
          startIcon={<SyncIcon />}
          onClick={this.handleDownload}
          disabled={loading}
          disableElevation
          messageposition={messagePosition}
        >
          {Drupal.t('Make available offline', {}, { context: 'ANU LMS' })}

          {loading && <CircularProgress size={24} style={{ position: 'absolute' }} />}
        </StyledButton>

        <SnackAlert
          show={alertOpen}
          message={message}
          onClose={() => this.setState({ alertOpen: false })}
          severity={severity}
          variant="filled"
          spaced
          duration={5000}
        />
      </ButtonWrapper>
    );
  }
}

DownloadCourse.propTypes = {
  messagePosition: PropTypes.string,
  course: coursePropTypes.isRequired,
};

export default DownloadCourse;
