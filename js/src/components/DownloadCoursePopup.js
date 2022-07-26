import React from 'react';
import PropTypes from 'prop-types';
import { Detector } from 'react-detect-offline';
import { coursePropTypes } from '@anu/utilities/transform.course';
import { Box, Button, withStyles, Typography, Link } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SyncIcon from '@material-ui/icons/Sync';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SnackAlert from '@anu/components/SnackAlert';
import { transformLessonPage } from '@anu/utilities/transform.lesson';
import { getPwaSettings } from '@anu/utilities/settings';

import 'regenerator-runtime/runtime';

const DownloadCourseWrapper = withStyles(() => ({
  root: {
    position: 'relative',
    display: 'flex',
  },
}))(Box);

const PopupOverlay = withStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 110,
    textAlign: 'center',
    backgroundColor: theme.palette.common.darkBlue,
    borderRadius: '16px 16px 0 0',
    transition: '.3s max-height',
    maxHeight: 0,
  },
}))(Box);

const PopupHeading = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '1.4',
  },
}))(Typography);

const PopupButton = withStyles((theme) => ({
  root: {
    width: 'max-content',
    minWidth: '80%',
    marginBottom: theme.spacing(2),
    background: theme.palette.success.main,
    color: theme.palette.common.white,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(3),
    textTransform: 'none',
    fontWeight: 700,
    letterSpacing: 0,
    borderRadius: '4px',
  },
}))(Button);

const PopupDismiss = withStyles((theme) => ({
  root: {
    display: 'block',
    color: theme.palette.common.white,
    margin: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(6),
    fontWeight: 700,
  },
}))(Link);

const ManualTrigger = withStyles((theme) => ({
  root: {
    width: 'auto',
    margin: '4px',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: theme.palette.success.main,
    fontWeight: 700,
    textTransform: 'inherit',
    textDecoration: 'underline',
    letterSpacing: 0,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))(Button);

const AvailableOfflineMessage = withStyles((theme) => ({
  root: {
    color: theme.palette.success.main,
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '& p': {
      color: theme.palette.success.main,
      marginLeft: theme.spacing(1),
      fontSize: '1rem',
      lineHeight: '1rem',
    },
    '& svg': {
      fontSize: '20px',
    },
  },
}))(Box);

const SynchronizingBox = withStyles((theme) => ({
  root: {
    color: theme.palette.common.white,
    padding: theme.spacing(2),
    width: '220px',
    margin: '0 auto',
    '& p': {
      color: theme.palette.common.white,
      marginLeft: theme.spacing(1),
    },
  },
}))(Box);

/**
 * Evolution of the DownloadCourse component.
 */
class DownloadCoursePopup extends React.Component {
  constructor(props) {
    super(props);

    let localStoragePopupDismissed = null;
    let localStorageAvailableOffline = null;

    try {
      localStoragePopupDismissed = window.localStorage.getItem(
        `Anu.offline.${props.course.id}.popupDismissed`
      );
      localStorageAvailableOffline = window.localStorage.getItem(
        `Anu.offline.${props.course.id}.availableOffline`
      );
    } catch (e) {
      console.error(e);
    }

    this.state = {
      result: null,
      loading: false,
      alertOpen: false,
      popupOpen: props.openPopupAutomatically && localStoragePopupDismissed === null,
      availableOffline: localStorageAvailableOffline !== null,
    };

    this.handleDownload = this.handleDownload.bind(this);
    this.saveUrlToCache = this.saveUrlToCache.bind(this);
    this.cacheLessonsAndReturnLessonImages = this.cacheLessonsAndReturnLessonImages.bind(this);
    this.getParagraphImagesFromContent = this.getParagraphImagesFromContent.bind(this);
    this.dismissPopup = this.dismissPopup.bind(this);
    this.showPopup = this.showPopup.bind(this);
  }

  /**
   * Parses lesson content to get list of paragraph image urls.
   */
  getParagraphImagesFromContent(pageContent) {
    const regExpString = /<div id="anu-application" data-application="(.*?)">/g;
    const regExpResult = regExpString.exec(pageContent);

    // In an unlikely case when the page doesn't contain data-application don't
    // do anything.
    if (!regExpResult || !regExpResult[1]) {
      return [];
    }

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
    const uniqueUrls = lessonUrls.filter((url, i, array) => array.indexOf(url) === i);

    return Promise.all(
      uniqueUrls.map(async (url) => {
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

  async handleDownload(e) {
    const { course } = this.props;
    const includeAudios = e.currentTarget.getAttribute('data-include-audios');

    let urlsToCache = includeAudios ? course.audios : [];

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
      this.setState({
        loading: false,
        result: 'success',
        alertOpen: true,
        popupOpen: false,
        availableOffline: true,
      });
      // Do not offer the download again.
      window.localStorage.setItem(`Anu.offline.${course.id}.popupDismissed`, '1');
      window.localStorage.setItem(`Anu.offline.${course.id}.availableOffline`, '1');
    } catch (error) {
      // Updates loading status.
      this.setState({ loading: false, result: 'error', alertOpen: true });
      console.error(`Could not download course content: ${error}`);
    }
  }

  dismissPopup() {
    const { course } = this.props;
    this.setState({ popupOpen: false });
    try {
      window.localStorage.setItem(`Anu.offline.${course.id}.popupDismissed`, '1');
    } catch (e) {
      console.error(e);
    }
  }

  showPopup() {
    this.setState({ popupOpen: true });
  }
  /**
   * Save passed urls to the pwa cache.
   */
  async saveUrlToCache(urls) {
    const uniqueUrls = urls.filter((url, i, array) => array.indexOf(url) === i);
    // Put response to the pwa cache.
    const cacheName = getPwaSettings().current_cache;
    const cache = await caches.open(cacheName);
    return await cache.addAll(uniqueUrls);
  }

  render() {
    const { loading, result, alertOpen, popupOpen, availableOffline } = this.state;
    const { course, showButton } = this.props;

    const courseHasAudio = course.audios.length !== 0;
    const offlineButtonLabel = courseHasAudio
      ? Drupal.t('Yes, no audio (small size)', {}, { context: 'ANU LMS' })
      : Drupal.t('Yes, make available offline', {}, { context: 'ANU LMS' });

    // Handling values needs to be done for both conditions
    // for preventing glitches on alert closing.
    let message = '';
    let severity = 'success';
    if (result === 'success') {
      message = Drupal.t('This course is ready to be used offline.', {}, { context: 'ANU LMS' });
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
      <DownloadCourseWrapper>
        <Detector
          polling={false}
          render={({ online }) => (
            <>
              {online && showButton && !availableOffline && (
                <ManualTrigger variant="text" onClick={this.showPopup} startIcon={<SyncIcon />}>
                  {Drupal.t('Make course available offline', {}, { context: 'ANU LMS' })}
                </ManualTrigger>
              )}
            </>
          )}
        />
        {showButton && availableOffline && (
          <AvailableOfflineMessage display="flex" alignItems="center">
            <CheckCircleIcon />
            <Typography>
              {Drupal.t('This course is ready to be used offline', {}, { context: 'ANU LMS' })}
            </Typography>
          </AvailableOfflineMessage>
        )}

        <SnackAlert
          show={alertOpen}
          message={message}
          onClose={() => this.setState({ alertOpen: false })}
          severity={severity}
          variant="filled"
          spaced
          duration={5000}
        />
        <Detector
          polling={false}
          render={({ online }) => (
            <>
              <PopupOverlay style={{ maxHeight: online && popupOpen && !loading ? '1000px' : 0 }}>
                <PopupHeading>
                  {Drupal.t(
                    'Would you like make this course available offline?',
                    {},
                    { context: 'ANU LMS' }
                  )}
                </PopupHeading>

                <PopupButton
                  variant="contained"
                  color="default"
                  startIcon={<SyncIcon />}
                  onClick={this.handleDownload}
                  disabled={loading}
                  disableElevation
                >
                  {offlineButtonLabel}
                </PopupButton>
                {courseHasAudio && (
                  <PopupButton
                    variant="contained"
                    color="default"
                    startIcon={<SyncIcon />}
                    onClick={this.handleDownload}
                    disabled={loading}
                    disableElevation
                    data-include-audios="true"
                  >
                    {Drupal.t('Yes, with audio (large size)', {}, { context: 'ANU LMS' })}
                  </PopupButton>
                )}
                <PopupDismiss underline="always" href="#" onClick={this.dismissPopup}>
                  {Drupal.t('No, do not make available offline', {}, { context: 'ANU LMS' })}
                </PopupDismiss>
              </PopupOverlay>

              <PopupOverlay style={{ maxHeight: loading ? '1000px' : 0 }}>
                <SynchronizingBox display="flex" alignItems="center">
                  <CircularProgress size={24} color="inherit" />
                  <Typography style={{ color: 'white' }}>
                    {Drupal.t('Synchronizing ...', {}, { context: 'ANU LMS' })}
                  </Typography>
                </SynchronizingBox>
              </PopupOverlay>
            </>
          )}
        />
      </DownloadCourseWrapper>
    );
  }
}

DownloadCoursePopup.propTypes = {
  messagePosition: PropTypes.string,
  showButton: PropTypes.bool,
  course: coursePropTypes.isRequired,
  openPopupAutomatically: PropTypes.bool,
};

DownloadCoursePopup.defaultProps = {
  messagePosition: 'left',
  showButton: true,
  openPopupAutomatically: false,
};

export default DownloadCoursePopup;
