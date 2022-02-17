import { getUserId } from '@anu/utilities/settings';
import * as fields from '@anu/utilities/fields';

/**
 * Reads all progress stored in local storage and optionally removes expired data.
 *
 * @param {int} expireAfter
 *   If greater than 0, then course progress older than expireAfter milliseconds
 *   will be deleted from localStorage.
 */
const getLocalStorageProgress = (expireAfter = 0) => {
  const items = {};

  try {
    const keys = Object.keys(window.localStorage).filter((key) => key.startsWith('Anu.progress.'));
    let i = keys.length;
    while (i--) {
      const item = window.localStorage.getItem(keys[i]);
      if (!item || (expireAfter > 0 && item.updated < Date.now() - expireAfter)) {
        window.localStorage.removeItem(keys[i]);
      } else {
        items[keys[i]] = item;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return items;
};

/**
 * Returns localStorage key that depends on user id and course id.
 */
const courseProgressKey = (courseId) => `Anu.progress.u${getUserId()}.course${courseId}`;

/**
 * Bootstraps progress data based on server data and localStorage data.
 */
const prepareCourseProgress = (node) => {
  const linearProgressEnabled = fields.getBooleanValue(node, 'field_course_linear_progress');
  if (!linearProgressEnabled) {
    return null;
  }

  const courseId = fields.getNumberValue(node, 'nid');
  const serverProgress = fields.getObjectValue(node, 'progress');

  // Gather any progress newer than 1 month from localStorage.
  const items = getLocalStorageProgress(30 * 24 * 60 * 60 * 1000);
  const key = courseProgressKey(courseId);
  let result = serverProgress;
  if (items && items[key]) {
    const clientProgress = JSON.parse(items[key]);
    for (const [lessonId, serverData] of Object.entries(serverProgress)) {
      result[lessonId] = serverData;
      const clientData = clientProgress[lessonId];
      if (!clientData) {
        // Nothing to merge from the client.
        continue;
      }
      // Respect completed data from the client.
      if (!serverData.completed && clientData.completed) {
        result[lessonId].needsSync = 1;
        result[lessonId].completed = 1;
      }
      // Respect restricted data from the client if lesson structure hasn't been
      // changed on the server since then.
      if (clientData.restricted === 0 && clientData.prev === serverData.prev) {
        result[lessonId].restricted = 0;
      }
    }
  }
  try {
    // Write merged result back to localStorage with updated timestamp.
    window.localStorage.setItem(key, JSON.stringify({ ...result, updated: Date.now() }));
  } catch (error) {
    console.error(error);
  }

  return result;
};

/**
 * Returns lesson's isCompleted property based on progress data.
 */
const isLessonCompleted = (course, lessonId) => {
  if (
    course &&
    course.progress &&
    course.progress[lessonId] &&
    course.progress[lessonId].completed
  ) {
    return true;
  }

  return false;
};

/**
 * Returns lesson's isRestricted property based on progress data.
 */
const isLessonRestricted = (course, lessonId) => {
  if (
    course &&
    course.progress &&
    course.progress[lessonId] &&
    course.progress[lessonId].restricted
  ) {
    return true;
  }

  return false;
};

/**
 * Makes API request to mark given lesson ids as completed.
 */
const postCompletedLessons = async (lessonIds = []) => {
  if (!lessonIds.length) {
    return;
  }
  // Server side progress is not supported for anonymous users.
  if (getUserId() === '0') {
    return;
  }

  try {
    const token = await fetch(Drupal.url('session/token'));
    await fetch(Drupal.url('anu_lms/progress'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': await token.text(),
      },
      body: JSON.stringify(lessonIds),
    });
  } catch (error) {
    console.error('Progress sync is unsuccessful.', error);
  }
};

/**
 * Lesson "complete" callback.
 *
 * Marks a lesson as completed in localStorage and attempts to push all pending
 * completed lessons to the server.
 */
const completeLesson = async (course, lessonId) => {
  if (!course || !course.progress || !course.progress[lessonId]) {
    // Progress is not enabled. Nothing to do.
    return;
  }
  // Mark current lesson as completed.
  const updatedProgress = {
    ...course.progress,
    [lessonId]: {
      ...course.progress[lessonId],
      completed: 1,
      needsSync: 1,
    },
    updated: Date.now(),
  };

  // Mark next lesson as not restricted.
  if (course.progress[lessonId].next && updatedProgress[course.progress[lessonId].next]) {
    updatedProgress[course.progress[lessonId].next].restricted = 0;
  }
  try {
    window.localStorage.setItem(courseProgressKey(course.id), JSON.stringify(updatedProgress));
  } catch (error) {
    console.error(error);
  }

  const lessonIds = Object.keys(updatedProgress).filter(
    (lessonId) => updatedProgress[lessonId] && updatedProgress[lessonId].needsSync
  );
  await postCompletedLessons(lessonIds);
};

/**
 * Returns progress percent for the given course progress.
 */
const calculateProgressPercent = (progress) => {
  if (!progress) {
    return 0;
  }

  const lessons = Object.values(progress);
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((item) => item.completed).length;

  if (totalLessons > 0) {
    return Math.round((completedLessons * 100) / totalLessons);
  }

  return 0;
};

/**
 * Pushes all pending completed lessons across all courses to the server.
 * Should be triggered on network "online" event.
 */
const syncAll = async () => {
  const items = getLocalStorageProgress();
  const lessonIds = [];

  Object.values(items).forEach((data) => {
    const progress = JSON.parse(data);
    Object.keys(progress)
      .filter((lessonId) => progress[lessonId].needsSync)
      .forEach((lessonId) => lessonIds.push(lessonId));
  });

  await postCompletedLessons(lessonIds);
};

export {
  calculateProgressPercent,
  completeLesson,
  courseProgressKey,
  isLessonCompleted,
  isLessonRestricted,
  prepareCourseProgress,
  syncAll,
};
