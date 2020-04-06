import React from 'react';
import 'regenerator-runtime/runtime';
import { getNode } from '../../../utils/node';
import { getPwaSettings } from '../../../utils/settings';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetApp from '@material-ui/icons/GetApp';

class DownloadCourse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
    this.handleDownload = this.handleDownload.bind(this);
    this.saveUrlToCache = this.saveUrlToCache.bind(this);
    this.cacheLessonsAndReturnLessonImages = this.cacheLessonsAndReturnLessonImages.bind(this);
  }

  async handleDownload() {
    const { course } = this.props;
    let urlsToCache = [];

    // Indicate loading process.
    this.setState({ loading: true });
    try {
      // Cache some global pages.
      urlsToCache.push('/');
      urlsToCache.push('/courses');

      // Cache Course data.
      urlsToCache.push('/node/' + course.id);
      if (course.image && course.image.url) {
        urlsToCache.push(course.image.url);
      }

      // Prepare Module related urls to cache.
      let lessonUrls = [];
      const moduleUrls = course.modules.map((module) => {
        const urls = [];

        // Cache Module data.
        urls.push('/node/' + module.id);
        if (module.image && module.image.url) {
          urls.push(module.image.url);
        }

        // Find Module's lessons and return as a result,
        // they will be cached separately.
        const moduleLessonUrls = module.lessons.map((lesson) => '/node/' + lesson.id);
        lessonUrls = lessonUrls.concat(moduleLessonUrls);

        // Add Module's assessment.
        if (module.assessment && module.assessment.id) {
          lessonUrls.push('/node/' + module.assessment.id);
        }

        return urls;
      });

      // Add Module data for caching.
      urlsToCache = urlsToCache.concat(moduleUrls.flat());

      // Cache lessons and returns list of lesson images (from paragraphs) to cache.
      const lessonImageUrls = await this.cacheLessonsAndReturnLessonImages(lessonUrls);
      urlsToCache = urlsToCache.concat(lessonImageUrls.flat());

      // Save collected urls to cache.
      await this.saveUrlToCache(urlsToCache);

      // Updates loading status.
      this.setState({ loading: false });
    }
    catch (error) {
      // Updates loading status.
      this.setState({ loading: false });
      console.error('Could not download course content: ' + error);
      alert('Could not download the course content. Please contact site administrator.');
    }
  };

  /**
   * Cache lessons and returns list of lesson images (from paragraphs) to cache.
   */
  async cacheLessonsAndReturnLessonImages(lessonUrls) {
    return Promise.all(lessonUrls.map(async (url) => {
      // Makes request to get lessons data.
      const request = new Request(url);
      const response = await fetch(request, { mode: 'no-cors' });
      const responseClone = response.clone();

      // Parse lesson content to get Lesson json data.
      const responseContent = await response.text();
      const regExpString = /<script type="application\/json" data-drupal-selector="drupal-settings-json">(.*?)<\/script>/g;
      const regExpResult = regExpString.exec(responseContent);
      const lessonJson = JSON.parse(regExpResult[1]);

      // Get Lesson object from page json data.
      const lessonNode = getNode(lessonJson.node);

      const paragraphUrls = [];
      // Gather lesson images.
      if (lessonNode.type === 'module_lesson') {
        lessonNode.sections.map(section => {
          section.map(paragraph => {

            for (const [key, value] of Object.entries(paragraph)) {
              if (typeof value === 'object' && value.type && value.type === 'image') {
                paragraphUrls.push(value.url);
              }
            }
          })
        })
      }
      // Gather assessment images.
      if (lessonNode.type === 'module_assessment') {
        lessonNode.items.map(item => {
          for (const [key, value] of Object.entries(item)) {
            if (typeof value === 'object' && value.type && value.type === 'image') {
              paragraphUrls.push(value.url);
            }
          }
        })
      }

      // Put lesson to the pwa cache.
      const cacheName = getPwaSettings().current_cache;
      const cache = await caches.open(cacheName);
      await cache.put(request, responseClone);

      return paragraphUrls;
    }));
  }

  /**
   *
   * @param urls
   * @returns {Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>}
   */
  async saveUrlToCache(urls) {
    return Promise.all(urls.map(async (url) => {
      const request = new Request(url);
      const response = await fetch(request, { mode: 'no-cors' });
      const responseClone = response.clone();

      const cacheName = getPwaSettings().current_cache;
      const cache = await caches.open(cacheName);
      await cache.put(request, responseClone);
    }));
  }

  render() {
    const { loading } = this.state;

    return (
      <Button
        variant="outlined"
        color="primary"
        startIcon={<GetApp />}
        onClick={this.handleDownload}
        disabled={loading}
      >
        Download course

        {loading &&
        <CircularProgress
          size={24}
          style={{ position: 'absolute' }}
        />
        }
      </Button>
    )
  }
}

export default DownloadCourse;
