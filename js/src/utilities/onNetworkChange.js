import { syncAll } from '@anu/utilities/progress';

/**
 * Global callback on app network change. Useful for syncing app data with the server.
 */
const onNetworkChange = (online) => {
  if (online) {
    // Sync completed lessons.
    return syncAll();
  }
};

export default onNetworkChange;
