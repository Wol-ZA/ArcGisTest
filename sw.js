const CACHE_NAME = 'arcgis-map-cache-v10';

// Files to cache
const urlsToCache = [
  '/ArcGisTest/',
  '/ArcGisTest/ArcGis.html',
  '/ArcGisTest/arcgis/init.js',
  '/ArcGisTest/arcgis/esri/layers/graphics/sources/geojson/GeoJSONSourceWorker.js',
  '/ArcGisTest/arcgis/esri/views/2d/layers/FeatureLayerView2D.js',
  '/ArcGisTest/arcgis/esri/views/2d/layers/LayerView2D.js',
  '/ArcGisTest/arcgis/esri/chunks/libtess.js',
  '/ArcGisTest/arcgis/esri/views/2d/layers/features/Pipeline.js',
  '/ArcGisTest/arcgis/esri/layers/support/labelUtils.js',
  '/ArcGisTest/arcgis/esri/layers/mixins/ArcGISCachedService.js',
  '/ArcGisTest/arcgis/esri/views/layers/support/ClipRect.js',
  '/ArcGisTest/arcgis/esri/core/workers/init.js',
  'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/styles/root.json',
  'https://cdn.arcgis.com/sharing/rest/content/items/7dc6cea0b1764a1f9af2e679f642f0f5/resources/styles/root.json?f=json',
  'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer?f=json',
  'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/sprites/sprite.json',
  'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/sprites/sprite.png',
  'https://static.arcgis.com/fonts/Arial Unicode MS Regular/0-255.pbf',
  'https://static.arcgis.com/fonts/Arial Unicode MS Regular/256-511.pbf',
  'https://static.arcgis.com/fonts/Arial Unicode MS Regular/512-767.pbf',
  'https://static.arcgis.com/fonts/Arial Unicode MS Regular/768-1023.pbf',
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

// Install event: Cache files gracefully (continue even if some fail)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(urlsToCache.map((url) => cache.add(url)))
    )
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cache) => cache !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      )
    )
  );
});

// Fetch event: Cache first → then Network fallback → fallback for navigation and tiles
self.addEventListener('fetch', (event) => {
  // Handle navigation requests (like index.html or ArcGis.html)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/ArcGisTest/ArcGis.html'))
    );
    return;
  }

  // Handle tile requests fallback
  if (event.request.url.includes('/tile/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/ArcGisTest/fallback-tile.png'))
    );
    return;
  }

  // Default: Try cache first → then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
