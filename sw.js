const CACHE_NAME = 'arcgis-map-cache-v14';

// Only cache same-origin resources here for install event
const urlsToCache = [
  '/ArcGisTest/',
  '/ArcGisTest/ArcGis.html',
  '/ArcGisTest/arcgis/init.js',
  '/ArcGisTest/arcgis/esri/layers/graphics/sources/geojson/GeoJSONSourceWorker.js',
  '/ArcGisTest/arcgis/esri/views/2d/layers/FeatureLayerView2D.js',
  '/ArcGisTest/arcgis/esri/views/2d/layers/LayerView2D.js',
  '/ArcGisTest/arcgis/esri/chunks/libtess.js',
  '/ArcGisTest/arcgis/esri/layers/TileLayer.js',
  '/ArcGisTest/arcgis/esri/layers/VectorTileLayer.js',
  '/ArcGisTest/arcgis/esri/t9n/basemaps_en.json',
  '/ArcGisTest/arcgis/esri/t9n/basemaps.json',
  '/ArcGisTest/arcgis/esri/widgets/Attribution/t9n/Attribution_en.json',
  '/ArcGisTest/arcgis/esri/views/2d/layers/VectorTileLayerView2D.js',
  '/ArcGisTest/arcgis/esri/views/2d/layers/TileLayerView2D.js',
  '/ArcGisTest/arcgis/esri/views/2d/layers/GraphicsLayerView2D.js',
  '/ArcGisTest/arcgis/esri/geometry/support/geodesicUtils.js',
  '/ArcGisTest/arcgis/esri/widgets/Zoom/t9n/Zoom_en.json',
  '/ArcGisTest/arcgis/esri/views/2d/layers/features/Pipeline.js',
  '/ArcGisTest/arcgis/esri/layers/support/labelUtils.js',
  '/ArcGisTest/arcgis/esri/layers/mixins/ArcGISCachedService.js',
  '/ArcGisTest/arcgis/esri/core/libs/libtess/libtess.wasm',
  '/ArcGisTest/arcgis/esri/views/layers/support/ClipRect.js',
  '/ArcGisTest/arcgis/esri/chunks/geometryEngineBase.js',
  '/ArcGisTest/arcgis/esri/core/workers/init.js',
  '/ArcGisTest/arcgis/esri/geometry/geometryAdapters/hydrated.js',
  '/ArcGisTest/arcgis/esri/views/2d/webglDeps.js',
  '/ArcGisTest/arcgis/esri/views/2d/mapViewDeps.js',
  '/ArcGisTest/arcgis/esri/views/layers/support/Path.js',
  '/ArcGisTest/arcgis/esri/geometry/Circle.js',
  '/ArcGisTest/arcgis/esri/views/MapView.js',
  '/ArcGisTest/arcgis/esri/layers/GraphicsLayer.js',
  '/ArcGisTest/arcgis/esri/layers/GeoJSONLayer.js',
  '/ArcGisTest/arcgis/esri/geometry/geometryEngine.js',
  '/ArcGisTest/arcgis/esri/views/SceneView.js',
  '/ArcGisTest/arcgis/esri/views/layers/support/Geometry.js',
  '/ArcGisTest/arcgis/esri/core/image/apng.js',
  '/ArcGisTest/arcgis/esri/layers/support/labelFormatUtils.js',
  '/ArcGisTest/arcgis/esri/layers/support/LercWorker.js',
  '/ArcGisTest/arcgis/esri/widgets/Popup.js',
  '/ArcGisTest/arcgis/esri/support/arcadeUtils.js',
  '/ArcGisTest/arcgis/esri/themes/light/main.css',
  '/ArcGisTest/Flight.js',
  '/ArcGisTest/styles.css',
  '/ArcGisTest/html.html',

  // GeoJSON files
  '/ArcGisTest/ATNS.geojson',
  '/ArcGisTest/ACCFIS.geojson',
  '/ArcGisTest/AORRA.geojson',
  '/ArcGisTest/ATZ_CTR.geojson',
  '/ArcGisTest/Aerodrome_AIC.geojson',
  '/ArcGisTest/Aerodrome_AIP.geojson',
  '/ArcGisTest/CTA.geojson',
  '/ArcGisTest/ENR.geojson',
  '/ArcGisTest/ENR12.geojson',
  '/ArcGisTest/ENR2.geojson',
  '/ArcGisTest/FAD_FAP_FAR.geojson',
  '/ArcGisTest/IORRA.geojson',
  '/ArcGisTest/Military.geojson',
  '/ArcGisTest/RNAV.geojson',
  '/ArcGisTest/SACAA.geojson',
  '/ArcGisTest/TMA.geojson',
  '/ArcGisTest/Un-Licensed.geojson',
  '/ArcGisTest/helistops.geojson',

  // Image icons
  '/ArcGisTest/ENR.png',
  '/ArcGisTest/Iorra.png',
  '/ArcGisTest/Rnav.png',
  '/ArcGisTest/aic.png',
  '/ArcGisTest/aic_1.png',
  '/ArcGisTest/aip.png',
  '/ArcGisTest/aip_1.png',
  '/ArcGisTest/atns.png',
  '/ArcGisTest/atns_1.png',
  '/ArcGisTest/fog.png',
  '/ArcGisTest/hazard.png',
  '/ArcGisTest/helistops.png',
  '/ArcGisTest/helistops_1.png',
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
  '/ArcGisTest/unlicensed.png',
  '/ArcGisTest/unlicensed_1.png',
  '/ArcGisTest/wind.png'
];

// INSTALL: Cache same-origin resources only
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(urlsToCache.map(url => cache.add(url)))
    )
  );
});

// ACTIVATE: Clean old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// FETCH: Cache-first for same-origin, network fallback with cache, fallback on failure
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);

  // Handle navigation requests (pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Optionally cache the page here if you want
          return response;
        })
        .catch(() => caches.match('/ArcGisTest/ArcGis.html'))
    );
    return;
  }

  // Handle tile requests fallback (images under /tile/)
  if (requestURL.pathname.includes('/tile/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/ArcGisTest/fallback-tile.png'))
    );
    return;
  }

  // For same-origin requests: cache first, then network
  if (requestURL.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request)
          .then(networkResponse => {
            // Optionally cache runtime new requests here
            return networkResponse;
          })
          .catch(() => {
            // Fallback for images
            if (event.request.destination === 'image') {
              return caches.match('/ArcGisTest/fallback-tile.png');
            }
          });
      })
    );
    return;
  }

  // For cross-origin requests, just try network, fallback empty response or nothing
  event.respondWith(
    fetch(event.request).catch(() => {
      // Could add fallback here if needed
      return new Response('', { status: 408, statusText: 'Request Timeout' });
    })
  );
});
