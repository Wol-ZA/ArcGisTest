const CACHE_NAME = 'arcgis-map-cache-v6';

// Files to cache
const urlsToCache = [
  '/ArcGisTest/',                     // your index.html
  '/ArcGisTest/ArcGis.html',           // explicitly cache index.html
  '/ArcGisTest/arcgis/init.js',
  '/ArcGisTest/arcgis/esri/layers/graphics/sources/geojson/GeoJSONSourceWorker.js',
  '/ArcGisTest/arcgis/esri/views/2d/layers/FeatureLayerView2D.js',
  '/ArcGisTest/arcgis/esri/views/2d/layers/features/Pipeline.js',
  '/ArcGisTest/arcgis/esri/layers/support/labelUtils.js',
  '/ArcGisTest/arcgis/esri/layers/support/labelFormatUtils.js',
  '/ArcGisTest/arcgis/esri/support/arcadeUtils.js',
  '/ArcGisTest/arcgis/esri/themes/light/main.css',
  '/ArcGisTest/Flight.js',
  '/ArcGisTest/ATNS.geojson',
  '/ArcGisTest/ACCFIS.geojson',
  '/ArcGisTest/AORRA.geojson',
  '/ArcGisTest/ATZ_CTR.geojson',
  '/ArcGisTest/Aerodrome_AIC.geojson',
  '/ArcGisTest/Aerodrome_AIP.geojson',
  '/ArcGisTest/CTA.geojson',
  '/ArcGisTest/ENR.geojson',
  '/ArcGisTest/ENR.png',
  '/ArcGisTest/ENR12.geojson',
  '/ArcGisTest/ENR2.geojson',
  '/ArcGisTest/FAD_FAP_FAR.geojson',
  '/ArcGisTest/IORRA.geojson',
  '/ArcGisTest/Iorra.png',
  '/ArcGisTest/Military.geojson',
  '/ArcGisTest/RNAV.geojson',
  '/ArcGisTest/Rnav.png',
  '/ArcGisTest/SACAA.geojson',
  '/ArcGisTest/TMA.geojson',
  '/ArcGisTest/Un-Licensed.geojson',
  '/ArcGisTest/aic.png',
  '/ArcGisTest/aic_1.png',
  '/ArcGisTest/aip.png',
  '/ArcGisTest/aip_1.png',
  '/ArcGisTest/atns.png',
  '/ArcGisTest/atns_1.png',
  '/ArcGisTest/fog.png',
  '/ArcGisTest/hazard.png',
  '/ArcGisTest/helistops.geojson',
  '/ArcGisTest/helistops.png',
  '/ArcGisTest/helistops_1.png',
  '/ArcGisTest/html.html',
  '/ArcGisTest/markerdefault.png',
  '/ArcGisTest/markerend.png',
  '/ArcGisTest/markerstart.png',
  '/ArcGisTest/military.png',
  '/ArcGisTest/military_1.png',
  '/ArcGisTest/navaids.png',
  '/ArcGisTest/plane.png',
  '/ArcGisTest/plane_1.png',
  '/ArcGisTest/plane_2.png',
  '/ArcGisTest/rain.png',
  '/ArcGisTest/sacaa.png',
  '/ArcGisTest/sacaa_1.png',
  '/ArcGisTest/styles.css',
  '/ArcGisTest/unlicensed.png',
  '/ArcGisTest/unlicensed_1.png',
  '/ArcGisTest/wind.png'// Your local ArcGIS files or other static assets
];

// Install event: cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
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
