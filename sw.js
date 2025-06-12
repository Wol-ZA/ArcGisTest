const CACHE_NAME = 'arcgis-map-cache-v1';

// Files to cache
const urlsToCache = [
  '/ArcGisTest/',                     // your index.html
  '/ArcGisTest/ArcGis.html',           // explicitly cache index.html
  '/ArcGisTest/arcgis/init.js',
  '/ArcGisTest/arcgis/esri/themes/light/main.css' // ArcGIS CSS
];

// Install event: cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: cleanup old caches (if needed)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event: serve cached files if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the request is in the cache, return it
        if (response) {
          return response;
        }
        // Otherwise, fetch from network
        return fetch(event.request);
      })
  );
});
