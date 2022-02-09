import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { RangeRequestsPlugin } from 'workbox-range-requests';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

if (drupalSettings && drupalSettings.current_cache) {
  // Enable range requests support for cached audio files via Workbox.
  registerRoute(
    ({ request }) => request.destination === 'audio',
    new CacheFirst({
      cacheName: drupalSettings.current_cache,
      matchOptions: {
        ignoreVary: true,
        ignoreSearch: true,
      },
      plugins: [new CacheableResponsePlugin({ statuses: [200] }), new RangeRequestsPlugin()],
    })
  );
}
