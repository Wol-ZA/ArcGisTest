
require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/geometry/Polygon",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/layers/FeatureLayer",
     "esri/layers/support/LabelClass",
    "esri/geometry/Extent"
], function(Map, SceneView, Polygon,Graphic, GraphicsLayer, Point, Polyline, SimpleMarkerSymbol,SimpleFillSymbol, SimpleLineSymbol, PictureMarkerSymbol,TextSymbol,FeatureLayer,LabelClass, Extent) {
    // Define globally so it's accessible everywhere
    const map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation"
    });

const view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
        position: { latitude: -30.5595, longitude: 22.9375, z: 500000 },
        tilt: 75
    },
    extent: {
        xmin: 16.344976, // Western border (Namibia)
        ymin: -34.819166, // Southern tip (Cape Agulhas)
        xmax: 32.83012,  // Eastern border (Mozambique)
        ymax: -22.125424, // Northern border (Zimbabwe)
        spatialReference: { wkid: 4326 }
    }
});

view.constraints = {
    rotationEnabled: false,
    minZoom: 5,  // Prevents zooming out too much
    maxZoom: 18, // Allows zooming in for details
    extent: {
        xmin: 16.344976,
        ymin: -34.819166,
        xmax: 32.83012,
        ymax: -22.125424,
        spatialReference: { wkid: 4326 }
    }
};
     view.ui.remove("zoom");
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    let flightPath = [];
    let planeGraphic = null;

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

        return [longitude, latitude, altitude];
    });
      // **Plot Waypoints**
    flightData.forEach(({ latitude, longitude, altitude }) => {
    const waypointGraphic = new Graphic({
        geometry: new Point({
            longitude,
            latitude,
            z: altitude
        }),
        symbol: new SimpleMarkerSymbol({
            color: [255, 0, 0], // Red color
            size: 6, // Adjust size as needed
            outline: {
                color: [255, 255, 255], // White outline
                width: 1
            }
        })
    });

    graphicsLayer.add(waypointGraphic);
});
    flightData.forEach(({ latitude, longitude, altitude }) => {
    const verticalLine = new Polyline({
        paths: [
            [[longitude, latitude, altitude], [longitude, latitude, 0]]
        ],
        spatialReference: { wkid: 4326 }
    });

    const dottedLineSymbol = new SimpleLineSymbol({
        color: [255, 0, 0, 0.7], // Red color for visibility
        width: 2,
        style: "dash"
    });

    const verticalLineGraphic = new Graphic({
        geometry: verticalLine,
        symbol: dottedLineSymbol
    });

    graphicsLayer.add(verticalLineGraphic);
});
    // **Draw Flight Path Polyline**
    const polyline = new Polyline({ paths: [pathCoordinates] });

    const lineSymbol = new SimpleLineSymbol({
        color: [0, 0, 0, 0.5], // Black color with 50% transparency
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

    // 🔥 Unlock the Camera Controls After Zooming
    setTimeout(() => {
        view.constraints = {
            altitude: {
                min: 10,    // Minimum altitude to prevent camera from going underground
                max: 100000 // Maximum altitude for zooming out
            },
            tilt: {
                max: 180   // Allow full tilting
            }
        };
    }, 1000); // Delay to let the extent load first

        // **Add Plane Symbol as a Dot**
        planeGraphic = new Graphic({
            geometry: new Point({
                longitude: flightPath[0].longitude,
                latitude: flightPath[0].latitude,
                z: flightPath[0].altitude
            }),
            symbol: new SimpleMarkerSymbol({
                color: [0, 0, 255], // Blue color for the dot
                size: 8, // Adjust size as needed
                outline: {
                    color: [255, 255, 255], // White outline
                    width: 1
                }
            })
        });

        graphicsLayer.add(planeGraphic);

const labelLayer = new FeatureLayer({
    source: [],  // Initially empty
    objectIdField: "ObjectID",
    labelingInfo: [
        new LabelClass({
            labelExpressionInfo: { expression: "$feature.labelText" },
            symbol: {
                type: "text",
                color: "white",
                haloColor: "black",
                haloSize: 1,
                font: { size: 14, weight: "bold" }
            }
        })
    ],
    elevationInfo: { mode: "relative-to-ground" }
});

map.add(labelLayer);
    };

let animationRunning = false;
let paused = false;
let rewinding = false;
let index = 0;
let animationTimeout;

window.startFlightSimulation = function () {
    if (!flightPath.length || animationRunning) return;

    // Remove all markers and lines before starting the simulation
    graphicsLayer.removeAll();
    animationRunning = true;
    index = 0; // Reset index for new simulation
    animatePlane();
};

function animatePlane() {
    if (index >= flightPath.length || paused || rewinding) {
        if (index >= flightPath.length) {
            animationRunning = false;
        }
        return; // Exit if paused or rewinding or end of trip
    }

    const { latitude, longitude, altitude } = flightPath[index];

    // ✅ Add Waypoint
    const waypointGraphic = new Graphic({
        geometry: new Point({ longitude, latitude, z: altitude }),
        symbol: new SimpleMarkerSymbol({
            color: [255, 0, 0], // Red
            size: 6,
            outline: { color: [255, 255, 255], width: 1 }
        })
    });
    graphicsLayer.add(waypointGraphic);

    const altitudeFeet = Math.round(altitude * 3.28084);

    // ✅ Update Altitude Display in feet
    document.getElementById("altitudeDisplay").innerText = `Altitude: ${altitudeFeet} ft`;

    // ✅ Draw Vertical Line
    const verticalLine = new Polyline({
        paths: [[[longitude, latitude, altitude], [longitude, latitude, 0]]],
        spatialReference: { wkid: 4326 }
    });

    const verticalLineGraphic = new Graphic({
        geometry: verticalLine,
        symbol: new SimpleLineSymbol({ color: [255, 0, 0, 0.7], width: 2, style: "dash" })
    });
    graphicsLayer.add(verticalLineGraphic);

    // ✅ Update Plane Position
    if (!planeGraphic) {
        planeGraphic = new Graphic({
            geometry: new Point({ latitude, longitude, z: altitude }),
            symbol: new SimpleMarkerSymbol({
                color: [0, 0, 255], // Blue
                size: 8,
                outline: { color: [255, 255, 255], width: 1 }
            })
        });
        graphicsLayer.add(planeGraphic);
    } else {
        planeGraphic.geometry = new Point({ latitude, longitude, z: altitude });
    }

    // ✅ Draw Flight Path Polyline incrementally
    if (index > 0) {
        const previousPoint = flightPath[index - 1];
        const segment = new Polyline({
            paths: [[[previousPoint.longitude, previousPoint.latitude, previousPoint.altitude],
                    [longitude, latitude, altitude]]],
            spatialReference: { wkid: 4326 }
        });

        const segmentGraphic = new Graphic({
            geometry: segment,
            symbol: new SimpleLineSymbol({ color: [0, 0, 0, 0.5], width: 3, style: "solid" })
        });

        graphicsLayer.add(segmentGraphic);
    }

    index++;

    // Continue the animation if it's not paused or rewinding
    if (animationRunning) {
        animationTimeout = setTimeout(animatePlane, 500); // Set a timeout for smooth animation
    }
}

function pauseSimulation() {
    paused = true;
    clearTimeout(animationTimeout); // Stop the animation when paused
}

function resumeSimulation() {
    paused = false;
    animatePlane(); // Resume the animation from where it was paused
}

function rewindSimulation() {
    if (index > 0) {
        // Move back one step
        index--;

        // Get the previous point (since we want to go back to it)
        const { latitude, longitude, altitude } = flightPath[index];

        // Update the plane position to the previous waypoint
        planeGraphic.geometry = new Point({ latitude, longitude, z: altitude });

        // Update the altitude display
        const altitudeFeet = Math.round(altitude * 3.28084);
        document.getElementById("altitudeDisplay").innerText = `Altitude: ${altitudeFeet} ft`;

        // Remove the last waypoint (marker) and polyline (path)
        const lastGraphic = graphicsLayer.graphics.items[graphicsLayer.graphics.length - 1];
        const secondLastGraphic = graphicsLayer.graphics.items[graphicsLayer.graphics.length - 2];

        // Remove the last waypoint (marker) and vertical line (if it exists)
        if (lastGraphic) {
            graphicsLayer.remove(lastGraphic);
        }
        if (secondLastGraphic && secondLastGraphic.geometry.type === "polyline") {
            graphicsLayer.remove(secondLastGraphic); // Remove the last polyline (path)
        }

        // Redraw the previous waypoint (the one before the last)
        if (index > 0) {
            const previousPoint = flightPath[index - 1];
            const waypointGraphic = new Graphic({
                geometry: new Point({ longitude: previousPoint.longitude, latitude: previousPoint.latitude, z: previousPoint.altitude }),
                symbol: new SimpleMarkerSymbol({
                    color: [255, 0, 0], // Red
                    size: 6,
                    outline: { color: [255, 255, 255], width: 1 }
                })
            });
            graphicsLayer.add(waypointGraphic);

            // Redraw the path (polyline) from the previous point to the current point
            const segment = new Polyline({
                paths: [
                    [
                        [previousPoint.longitude, previousPoint.latitude, previousPoint.altitude],
                        [longitude, latitude, altitude]
                    ]
                ],
                spatialReference: { wkid: 4326 }
            });

            const segmentGraphic = new Graphic({
                geometry: segment,
                symbol: new SimpleLineSymbol({ color: [0, 0, 0, 0.5], width: 3, style: "solid" })
            });

            graphicsLayer.add(segmentGraphic);
        }

        // Optionally, if the vertical line should be part of the path, redraw it:
        const verticalLine = new Polyline({
            paths: [[[longitude, latitude, altitude], [longitude, latitude, 0]]],
            spatialReference: { wkid: 4326 }
        });

        const verticalLineGraphic = new Graphic({
            geometry: verticalLine,
            symbol: new SimpleLineSymbol({ color: [255, 0, 0, 0.7], width: 2, style: "dash" })
        });

        graphicsLayer.add(verticalLineGraphic);
    }
}

function resetSimulation() {
    // Reset the index to 0 to start from the beginning
    index = 0;

    // Remove all graphics (markers, paths, etc.)
    graphicsLayer.removeAll();

    // Restart the animation
    animationRunning = false; // Stop any ongoing animation
    startFlightSimulation();  // Restart the flight simulation process
}

// Add event listeners to buttons for controlling the simulation
document.getElementById("pauseButton").addEventListener("click", pauseSimulation);
document.getElementById("resumeButton").addEventListener("click", resumeSimulation);
document.getElementById("rewindButton").addEventListener("click", rewindSimulation);
document.getElementById("resetButton").addEventListener("click", resetSimulation);


     function calculateDistance(point1, point2) {
        const R = 6371000;
        const lat1 = point1.latitude * (Math.PI / 180);
        const lat2 = point2.latitude * (Math.PI / 180);
        const deltaLat = lat2 - lat1;
        const deltaLon = (point2.longitude - point1.longitude) * (Math.PI / 180);

        const a = Math.sin(deltaLat / 2) ** 2 +
                  Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
});
