require([
    "esri/Map", "esri/views/SceneView", "esri/geometry/Polygon",
    "esri/Graphic", "esri/layers/GraphicsLayer", "esri/geometry/Point",
    "esri/geometry/Polyline", "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/symbols/PictureMarkerSymbol", "esri/symbols/TextSymbol",
    "esri/layers/FeatureLayer", "esri/layers/support/LabelClass", "esri/geometry/Extent"
], function(Map, SceneView, Polygon, Graphic, GraphicsLayer, Point, Polyline, SimpleMarkerSymbol,
    SimpleFillSymbol, SimpleLineSymbol, PictureMarkerSymbol, TextSymbol, FeatureLayer, LabelClass, Extent) {

    const map = new Map({ basemap: "topo-vector", ground: "world-elevation" });
    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: { position: { latitude: -31.548, longitude: 24.34, z: 30000 }, tilt: 75 }
    });
    view.ui.remove("zoom");

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    let flightPath = [], planeGraphic = null, animationTimeout;

    window.loadFlightPath = function(flightData) {
        if (!flightData.length) return console.warn("No flight data provided.");
        graphicsLayer.removeAll();
        flightPath = flightData;

        let xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity;
        let pathCoordinates = [], graphicsBatch = [];

        flightData.forEach(({ latitude, longitude, altitude }) => {
            xmin = Math.min(xmin, longitude);
            ymin = Math.min(ymin, latitude);
            xmax = Math.max(xmax, longitude);
            ymax = Math.max(ymax, latitude);
            pathCoordinates.push([longitude, latitude, altitude]);

            graphicsBatch.push(new Graphic({
                geometry: new Point({ longitude, latitude, z: altitude }),
                symbol: new SimpleMarkerSymbol({ color: [255, 0, 0], size: 6, outline: { color: [255, 255, 255], width: 1 } })
            }));

            graphicsBatch.push(new Graphic({
                geometry: new Polyline({ paths: [[[longitude, latitude, altitude], [longitude, latitude, 0]]], spatialReference: { wkid: 4326 } }),
                symbol: new SimpleLineSymbol({ color: [255, 0, 0, 0.7], width: 2, style: "dash" })
            }));
        });

        graphicsBatch.push(new Graphic({
            geometry: new Polyline({ paths: [pathCoordinates] }),
            symbol: new SimpleLineSymbol({ color: [0, 0, 0, 0.5], width: 3, style: "solid" })
        }));
        graphicsLayer.addMany(graphicsBatch);

        view.extent = new Extent({ xmin, ymin, xmax, ymax, spatialReference: { wkid: 4326 } }).expand(1.2);

        setTimeout(() => {
            view.constraints = { altitude: { min: 10, max: 100000 }, tilt: { max: 180 } };
        }, 1000);

        planeGraphic = new Graphic({
            geometry: new Point({ longitude: flightPath[0].longitude, latitude: flightPath[0].latitude, z: flightPath[0].altitude }),
            symbol: new SimpleMarkerSymbol({ color: [0, 0, 255], size: 8, outline: { color: [255, 255, 255], width: 1 } })
        });
        graphicsLayer.add(planeGraphic);
    };

    let index = 0, animationRunning = false, paused = false;

    function animatePlane() {
        if (!animationRunning || paused || index >= flightPath.length) return;

        const { latitude, longitude, altitude } = flightPath[index++];
        planeGraphic.geometry = new Point({ longitude, latitude, z: altitude });

        document.getElementById("altitudeDisplay").innerText = `Altitude: ${Math.round(altitude * 3.28084)} ft`;

        graphicsLayer.addMany([
            new Graphic({
                geometry: new Point({ longitude, latitude, z: altitude }),
                symbol: new SimpleMarkerSymbol({ color: [255, 0, 0], size: 6, outline: { color: [255, 255, 255], width: 1 } })
            }),
            new Graphic({
                geometry: new Polyline({ paths: [[[longitude, latitude, altitude], [longitude, latitude, 0]]], spatialReference: { wkid: 4326 } }),
                symbol: new SimpleLineSymbol({ color: [255, 0, 0, 0.7], width: 2, style: "dash" })
            })
        ]);

        if (animationRunning) animationTimeout = setTimeout(animatePlane, 500);
    }

    window.startFlightSimulation = function () {
        if (!flightPath.length || animationRunning) return;
        graphicsLayer.removeAll();
        animationRunning = true;
        index = 0;
        animatePlane();
    };

    function pauseSimulation() { paused = true; clearTimeout(animationTimeout); }
    function resumeSimulation() { paused = false; animatePlane(); }
    function resetSimulation() { index = 0; graphicsLayer.removeAll(); animationRunning = false; startFlightSimulation(); }

    document.getElementById("pauseButton").addEventListener("click", pauseSimulation);
    document.getElementById("resumeButton").addEventListener("click", resumeSimulation);
    document.getElementById("resetButton").addEventListener("click", resetSimulation);

    function calculateDistance(point1, point2) {
        const R = 6371000, rad = Math.PI / 180;
        const lat1 = point1.latitude * rad, lat2 = point2.latitude * rad;
        const deltaLat = lat2 - lat1, deltaLon = (point2.longitude - point1.longitude) * rad;
        const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
});
