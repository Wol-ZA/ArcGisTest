

const CACHE_NAME = 'map-app-cache-v5';
const STATIC_ASSETS = [
  '/ArcGisTest/',                     // your index.html
  '/ArcGisTest/ArcGis.html',           // explicitly cache index.html
  '/ArcGisTest/arcgis/init.js',
  '/ArcGisTest/arcgis/esri/themes/light/main.css',
  '/ArcGisTest/Flight.js'// Your local ArcGIS files or other static assets
];

// Install event: cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event: cleanup old caches (optional)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Fetch event: cache-then-network for tiles
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  // If request is for tiles (adjust domain as needed)
  if (requestURL.href.includes('/tile/') || requestURL.href.includes('/ArcGisTest/arcgis/rest/services/')) {
    event.respondWith(
      caches.open('tiles-cache').then(cache => 
        cache.match(event.request).then(response => 
          response || fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            return response; // Return cached if network fails
          })
        )
      )
    );
  } else {
    // Default for other requests
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});
