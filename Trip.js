require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/Extent"
], function(Map, SceneView, Graphic, GraphicsLayer, Point, Polyline, SimpleMarkerSymbol, SimpleLineSymbol, PictureMarkerSymbol, Extent) {

    const map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation"
    });

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: { latitude: -31.548, longitude: 24.34, z: 30000 },
            tilt: 75
        }
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    let flightPath = [];
    let planeGraphic = null;
    let animationRunning = false;

    window.loadFlightPath = function(flightData) {
        graphicsLayer.removeAll();
        flightPath = flightData;

        if (flightPath.length === 0) {
            console.warn("No flight data provided.");
            return;
        }

        let xmin = Infinity, ymin = Infinity, xmax = -Infinity, ymax = -Infinity;

        const pathCoordinates = flightData.map(({ latitude, longitude, altitude }) => {
            xmin = Math.min(xmin, longitude);
            ymin = Math.min(ymin, latitude);
            xmax = Math.max(xmax, longitude);
            ymax = Math.max(ymax, latitude);

            const point = new Point({ latitude, longitude, z: altitude });

            // **Plot Waypoints**
            const markerSymbol = new SimpleMarkerSymbol({
                color: [0, 0, 255, 0.6],
                size: 8,
                outline: { color: "white", width: 2 }
            });

            const pointGraphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
            });
            graphicsLayer.add(pointGraphic);

            // **Create Vertical Line from Point to Ground**
            const verticalLine = new Polyline({
                paths: [
                    [longitude, latitude, altitude],
                    [longitude, latitude, 0]
                ]
            });

            const verticalLineSymbol = new SimpleLineSymbol({
                color: [0, 0, 0, 0.3],
                width: 1,
                style: "dash"
            });

            const verticalLineGraphic = new Graphic({
                geometry: verticalLine,
                symbol: verticalLineSymbol
            });
            graphicsLayer.add(verticalLineGraphic);

            return [longitude, latitude, altitude];
        });

        // **Draw Flight Path Polyline**
        const polyline = new Polyline({ paths: [pathCoordinates] });

        const lineSymbol = new SimpleLineSymbol({
            color: [255, 0, 0, 0.7],
            width: 3,
            style: "solid"
        });

        const lineGraphic = new Graphic({
            geometry: polyline,
            symbol: lineSymbol
        });

        graphicsLayer.add(lineGraphic);

        // **Adjust View to Fit the Flight Path**
        const extent = new Extent({ xmin, ymin, xmax, ymax, spatialReference: { wkid: 4326 } });
        view.extent = extent.expand(1.2);

        // **Add Plane Symbol for Animation**
        planeGraphic = new Graphic({
            geometry: new Point({
                longitude: flightPath[0].longitude,
                latitude: flightPath[0].latitude,
                z: flightPath[0].altitude
            }),
            symbol: new PictureMarkerSymbol({
                url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Airplane_silhouette.png",
                width: "32px",
                height: "32px",
                angle: 0
            })
        });

        graphicsLayer.add(planeGraphic);
    };

    window.startFlightSimulation = function() {
        if (!flightPath.length || animationRunning) return;

        animationRunning = true;
        let index = 0;

        function animatePlane() {
            if (index >= flightPath.length) {
                animationRunning = false;
                return;
            }

            const { latitude, longitude, altitude } = flightPath[index];
            planeGraphic.geometry = new Point({ latitude, longitude, z: altitude });

            index++;
            setTimeout(animatePlane, 200); // Adjust speed as needed
        }

        animatePlane();
    };
});
