require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/Extent"
], function (
    Map, SceneView, GraphicsLayer, Graphic, Polyline, Point,
    SimpleLineSymbol, SimpleMarkerSymbol, PictureMarkerSymbol, Extent
) {
    const map = new Map({ basemap: "satellite" });
    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: { position: [0, 0, 10000], tilt: 45 }
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    let flightPath = [];  // Array to store waypoints
    let planeGraphic;      // Reference for animated plane

    // 🚀 Load Flight Path from Your Backend/API
    function loadFlightPath() {
        fetch('/api/getFlightPlan')  // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => {
                flightPath = data.waypoints.map(waypoint => ({
                    longitude: waypoint.longitude,
                    latitude: waypoint.latitude,
                    altitude: waypoint.altitude
                }));

                if (flightPath.length === 0) return;

                drawWaypoints(flightPath);
                drawFlightPath(flightPath);
                animatePlane(flightPath);
            })
            .catch(error => console.error("Error loading flight path:", error));
    }

    // 📍 Draw Waypoints on the Map
    function drawWaypoints(waypoints) {
        waypoints.forEach((point, index) => {
            const pointGraphic = new Graphic({
                geometry: new Point({ longitude: point.longitude, latitude: point.latitude, z: point.altitude }),
                symbol: new SimpleMarkerSymbol({ color: [255, 0, 0], size: 6, outline: { color: [255, 255, 255], width: 1 } })
            });
            graphicsLayer.add(pointGraphic);
        });
    }

    // ✈️ Draw Flight Path (Polyline) Connecting Waypoints
    function drawFlightPath(waypoints) {
        const pathCoordinates = waypoints.map(p => [p.longitude, p.latitude, p.altitude]);

        const polyline = new Polyline({
            paths: [pathCoordinates],
            spatialReference: { wkid: 4326 }
        });

        const lineSymbol = new SimpleLineSymbol({
            color: [0, 0, 255, 0.7],  // Blue line for visibility
            width: 2,
            style: "solid"
        });

        const lineGraphic = new Graphic({ geometry: polyline, symbol: lineSymbol });
        graphicsLayer.add(lineGraphic);

        // Set the view to the flight path area
        const extent = new Extent({
            xmin: Math.min(...waypoints.map(p => p.longitude)),
            ymin: Math.min(...waypoints.map(p => p.latitude)),
            xmax: Math.max(...waypoints.map(p => p.longitude)),
            ymax: Math.max(...waypoints.map(p => p.latitude)),
            spatialReference: { wkid: 4326 }
        });
        view.extent = extent.expand(1.2);
    }

    // 🛫 Animate Plane Along the Flight Path
    function animatePlane(waypoints) {
        if (!waypoints.length) return;

        if (!planeGraphic) {
            planeGraphic = new Graphic({
                geometry: new Point({ longitude: waypoints[0].longitude, latitude: waypoints[0].latitude, z: waypoints[0].altitude }),
                symbol: new PictureMarkerSymbol({ url: "plane-icon.png", width: "32px", height: "32px" }) // Replace with your plane icon
            });
            graphicsLayer.add(planeGraphic);
        }

        let index = 0;
        function movePlane() {
            if (index >= waypoints.length) return;
            
            const point = new Point({ longitude: waypoints[index].longitude, latitude: waypoints[index].latitude, z: waypoints[index].altitude });
            planeGraphic.geometry = point;
            index++;

            // Connect previous segment with polyline
            if (index > 1) {
                const previousPoint = waypoints[index - 1];
                const segment = new Polyline({
                    paths: [[[previousPoint.longitude, previousPoint.latitude, previousPoint.altitude], 
                             [point.longitude, point.latitude, point.z]]],
                    spatialReference: { wkid: 4326 }
                });

                const segmentGraphic = new Graphic({
                    geometry: segment,
                    symbol: new SimpleLineSymbol({ color: [0, 0, 255, 0.7], width: 2, style: "solid" })
                });

                graphicsLayer.add(segmentGraphic);
            }

            setTimeout(movePlane, 500); // Adjust speed
        }
        movePlane();
    }

    loadFlightPath();
});
