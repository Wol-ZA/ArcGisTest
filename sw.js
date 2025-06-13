

const CACHE_NAME = 'map-app-cache-v5';
const STATIC_ASSETS = [
  '/ArcGisTest/',                     // your index.html
  '/ArcGisTest/ArcGis.html',           // explicitly cache index.html
  '/ArcGisTest/arcgis/init.js',
  '/ArcGisTest/arcgis/esri/themes/light/main.css',
  '/ArcGisTest/Flight.js',
  '/ArcGisTest/ACCFIS.geojson',
  '/ArcGisTest/AORRA.geojson',
  '/ArcGisTest/ATZ_CTR.geojson',
  '/ArcGisTest/Aerodrome_AIC.geojson',
  '/ArcGisTest/Aerodrome_AIP.geojson',
  '/ArcGisTest/ArcGis.html',
  '/ArcGisTest/CTA.geojson',
  '/ArcGisTest/ENR.geojson',
  '/ArcGisTest/ENR.png',
  '/ArcGisTest/ENR12.geojson',
  '/ArcGisTest/ENR2.geojson',
  '/ArcGisTest/FAD_FAP_FAR.geojson',
  '/ArcGisTest/Flight.js',
  '/ArcGisTest/Home.html',
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
