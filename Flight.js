require([
    "esri/geometry/Circle",
    "esri/geometry/Extent",
    "esri/Map",
    "esri/views/MapView",
    "esri/views/SceneView", // Import SceneView for 3D view
    "esri/layers/GeoJSONLayer",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Polygon",
     "esri/geometry/SpatialReference",
    "esri/geometry/geometryEngine",
    "esri/geometry/Polyline",
    "esri/geometry/support/webMercatorUtils",
    "esri/geometry/projection"
], function(Circle, Extent, Map, MapView, SceneView, GeoJSONLayer, Graphic, Point, PictureMarkerSymbol, GraphicsLayer,Polygon,SpatialReference,geometryEngine,Polyline,webMercatorUtils,projection) {

    // Create the map
   window.map = new Map({
        basemap: "osm"
    });

    // Create the MapView centered on George, South Africa
    window.view = new MapView({
        container: "viewDiv",
        map: map,
        center: [22.4617, -33.9646],
        zoom: 12,
        ui: { components: [] }
    });

window.removeRoute = function() {
    // Stop watching the user's location
    if (locationWatchId) {
        navigator.geolocation.clearWatch(locationWatchId);
        locationWatchId = null; // Reset the watch ID
    }

    // Remove the polyline graphic from the map view
    if (polylineGraphic) {
        view.graphics.remove(polylineGraphic);
        polylineGraphic = null; // Reset the polyline graphic
    }

    console.log("Route removed and location updates stopped.");
}    

function htmlToRGBA(colorHTML, alpha) {
    const hex = colorHTML.startsWith('#') ? colorHTML.slice(1) : colorHTML;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b, alpha];
}

function darkenColor(colorHTML, factor) {
    const hex = colorHTML.startsWith('#') ? colorHTML.slice(1) : colorHTML;
    const r = Math.max(0, parseInt(hex.slice(0, 2), 16) * factor);
    const g = Math.max(0, parseInt(hex.slice(2, 4), 16) * factor);
    const b = Math.max(0, parseInt(hex.slice(4, 6), 16) * factor);
    return [r, g, b, 1];
}

// Initialize global variables
let polylineGraphic;
let locationWatchId; // Renamed from watchId
	
window.recenterToUser = function() {
 if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPoint = new Point({
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                    spatialReference: { wkid: 4326 } // important!
                });

                view.goTo({
                    target: userPoint,
                    zoom: 14
                }).catch((err) => {
                    console.error("Failed to go to user location:", err);
                });
            },
            (error) => {
                console.error("Geolocation error:", error);
            },
            { enableHighAccuracy: true }
        );
    } else {
        console.warn("Geolocation is not supported by this browser.");
    }
}
	
// Function to draw a line from current location to a destination
window.drawRoute = function(destinationLat, destinationLong) {
    require(["esri/geometry/Polyline", "esri/Graphic"], function(Polyline, Graphic) {
        // Clear any existing polyline
        if (polylineGraphic) {
            view.graphics.remove(polylineGraphic);
        }

        // Function to update the line dynamically
        function updateLine(position) {
            const userLocation = [position.coords.longitude, position.coords.latitude];

            // Create a polyline geometry
            const polyline = new Polyline({
                paths: [userLocation, [destinationLong, destinationLat]],
                spatialReference: { wkid: 4326 } // WGS84
            });

            // Create a graphic for the polyline
            const lineSymbol = {
                type: "simple-line", // autocasts as new SimpleLineSymbol()
                color: [0, 0, 255], // Blue
                width: 2
            };

            const newPolylineGraphic = new Graphic({
                geometry: polyline,
                symbol: lineSymbol
            });

            // Add the new graphic to the map view
            if (polylineGraphic) {
                view.graphics.remove(polylineGraphic);
            }
            polylineGraphic = newPolylineGraphic;
            view.graphics.add(polylineGraphic);
        }

        // Watch the user's location and update the line
        if (navigator.geolocation) {
            if (locationWatchId) {
                navigator.geolocation.clearWatch(locationWatchId);
            }
            locationWatchId = navigator.geolocation.watchPosition(updateLine, (error) => {
                console.error("Error watching position:", error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    });
}

let geoJSONPolygons = [];

window.createGeoJSONLayer = function (url, colorHTML, alpha) {
    const layer = new GeoJSONLayer({
        url: url,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill",
                color: htmlToRGBA(colorHTML, alpha),
                outline: {
                    color: darkenColor(colorHTML, 1),
                    width: 2,
                    style: "solid"
                }
            }
        },
        fields: [
            { name: "name", type: "string" } // Ensure 'name' is recognized as an attribute
        ],
        outFields: ["*"], // Load all properties from the GeoJSON file
        opacity: 0.5
    });
    fetch(url)
        .then(response => response.json())
        .then(geojson => {
            geojson.features.forEach((feature, index) => {
                const graphic = createGeoJSONGraphic(feature, colorHTML, alpha); // Customize fill color and alpha
                // Only include polygon geometries
                if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
                    const name = feature.properties.name || `Polygon ${index + 1}`;
                    geoJSONPolygons.push({ geometry: graphic.geometry, feature });
                }
            });
        })
        .catch(error => console.error('Error loading GeoJSON:', error));	
    return layer;
};



let longPressTimeout;
let isLongPress = false;

view.on("pointer-down", function(event) {
    if (event.pointerType === "touch" && event.native.pointerId && event.native.isPrimary === false) {
        return;
    }

    isLongPress = false;

    longPressTimeout = setTimeout(() => {
        isLongPress = true;
        handleLongPress(event);
    }, 600);
});

function cancelLongPress() {
    clearTimeout(longPressTimeout);
}

view.on("pointer-move", cancelLongPress);
view.on("pointer-up", cancelLongPress);
view.on("pointer-leave", cancelLongPress);

	
	
function handleLongPress(event) {
    console.log("Long press triggered");
    view.hitTest(event).then(function (response) {
        if (!response.results.length) {
            showCustommPopup("<p>No features clicked.</p>");
            return;
        }

        let iconInfo = null;
        let polygonInfos = [];

        for (let result of response.results) {
            const graphic = result.graphic;
            if (!graphic || !graphic.attributes || !graphic.geometry) continue;

            const attributes = graphic.attributes;
            const geometryType = graphic.geometry.type;

            if (geometryType === "point" && !iconInfo) {
                iconInfo = {
                    name: attributes.name || attributes.id || "Unnamed Icon",
                    attributes
                };
            } else if (geometryType === "polygon") {
        	polygonInfos.push({
                    name: attributes.name || attributes.id || "Unnamed Polygon",
                    attributes	
                });
            }
		console.log(response.results);
        }
	
        let popupContent = "";

        if (iconInfo) {
            popupContent += `
    <h3>Icon Info</h3>
    <p style="display: flex; align-items: center; gap: 8px;">
        <span>Name: ${iconInfo.name}</span>
        <button 
            style="background-color: #007BFF; border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;" 
            title="Info"
            onclick="handleInfo('${iconInfo.name}')"
        >i</button>
        <button 
            style="border: none; color: black; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;" 
            title="Report"
            onclick="handleReport('${iconInfo.name}')"
        >⚠️</button>
    </p>
`;
        }
if (polygonInfos.length > 0) {
    let namesArray = []; // Collect name objects here
    popupContent += `<h3>Polygon Info</h3><ul>`;
    
    polygonInfos.forEach(p => {
        namesArray.push({ name: p.name }); // Push as object
        popupContent += `<li>${p.name}</li>`;
    });
    
    popupContent += `</ul>`;
    
    // Sort by name (optional, for the order you showed)
    namesArray.sort((a, b) => a.name.localeCompare(b.name));
    //WL.Execute("GetInfo", JSON.stringify(namesArray),popupContent);
}

if (!popupContent) {
    popupContent = "<p>No recognizable features clicked.</p>";
}
	
        showCustommPopup(popupContent);
    }).catch(error => {
        console.error("Error in hitTest:", error);
    });

}

window.handleInfo = function(name) {
    WL.Execute("PopupInfo", name);
};

window.handleReport = function(name) {
    WL.Execute("PopupReport", name);
};	

// Create or update a popup in the top-left corner
// Global references so we can clear them on repeat calls
let popupTimeout = null;
let countdownInterval = null;

window.showCustommPopup = function(htmlContent) {
    let popup = document.getElementById("customPopup");
    // Create popup if it doesn't exist
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "customPopup";
        popup.style.position = "fixed";
        popup.style.top = "150px";
        popup.style.left = "10px";
        popup.style.background = "white";
        popup.style.border = "1px solid #ccc";
        popup.style.borderRadius = "8px";
        popup.style.padding = "12px 16px";
        popup.style.zIndex = "9999";
        popup.style.maxWidth = "320px";
        popup.style.fontFamily = "'Segoe UI', Roboto, sans-serif";
        popup.style.fontSize = "13px";
        popup.style.color = "#333";
        popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        popup.style.lineHeight = "1.4";
        popup.style.pointerEvents = "auto";
        popup.style.willChange = "transform";
        popup.style.opacity = "1";

        document.body.appendChild(popup);
    }

    // Reset timer and countdown if they exist
    if (popupTimeout) clearTimeout(popupTimeout);
    if (countdownInterval) clearInterval(countdownInterval);

    // Set new content and countdown display
    popup.innerHTML = `
        <div style="border-bottom: 1px solid #ddd; margin-bottom: 8px; position: relative;">
            <h3 style="margin: 0 0 4px; font-size: 15px; color: #003366;">What's Here?</h3>
            <span id="countdownTimer" style="
                position: absolute;
                right: 0;
                top: 0;
                font-size: 12px;
                color: #999;
            ">10s</span>
        </div>
        ${htmlContent}
    `;

    // Start countdown
    let countdown = 10;
    const timerSpan = popup.querySelector("#countdownTimer");
    countdownInterval = setInterval(() => {
        countdown--;
        if (timerSpan) timerSpan.textContent = countdown + "s";
        if (countdown <= 0) clearInterval(countdownInterval);
    }, 1000);

    // Set timeout to remove popup
    popupTimeout = setTimeout(() => {
        popup.remove();
        popupTimeout = null;
        countdownInterval = null;
    }, 10000);
}


window.addWeatherReportsToMap = function(view, reportDataArray) {
  require([
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/PopupTemplate"
  ], function(Graphic, Point, PictureMarkerSymbol, PopupTemplate) {

    view.graphics.removeAll();

    const iconMap = {
      "Fog": "fog.png",
      "Rain": "rain.png",
      "Wind": "wind.png",
      "Hazard": "hazard.png"
    };

    // ~100 meters in degrees
    const proximityThreshold = 0.0009;

    // ~200 meters in degrees
    const OFFSET_DISTANCE = 0.0018;

    function areCloseEnough(lat1, lng1, lat2, lng2) {
      return Math.abs(lat1 - lat2) < proximityThreshold &&
             Math.abs(lng1 - lng2) < proximityThreshold;
    }

    // Group nearby reports
    const groups = [];

    reportDataArray.forEach(report => {
      const lat = parseFloat(report.Latitude);
      const lng = parseFloat(report.Longitude);
      let placed = false;

      for (const group of groups) {
        const base = group[0];
        if (areCloseEnough(lat, lng, parseFloat(base.Latitude), parseFloat(base.Longitude))) {
          group.push(report);
          placed = true;
          break;
        }
      }

      if (!placed) {
        groups.push([report]);
      }
    });

    // Create offset markers
    groups.forEach(group => {
      const baseLat = parseFloat(group[0].Latitude);
      const baseLng = parseFloat(group[0].Longitude);

      group.forEach((report, index) => {
        let lat = baseLat;
        let lng = baseLng;

        if (group.length > 1) {
          const angle = (index * 2 * Math.PI) / group.length;
          lat += OFFSET_DISTANCE * Math.cos(angle);
          lng += OFFSET_DISTANCE * Math.sin(angle);
        }

        const iconUrl = iconMap[report.Report_Type] || "default.png";

        const point = new Point({
          latitude: lat,
          longitude: lng
        });

        const symbol = new PictureMarkerSymbol({
          url: iconUrl,
          width: "42px",
          height: "42px"
        });

        const popupTemplate = new PopupTemplate({
          title: `${report.Report_Type} Report`,
          content: `
            <strong>Reported by:</strong> ${report.UserName}<br>
            <strong>Notes:</strong> ${report.Extra_Notes}<br>
            <strong>Time:</strong> ${new Date().toLocaleString()}
          `
        });

        const graphic = new Graphic({
          geometry: point,
          symbol: symbol,
          popupTemplate: popupTemplate
        });

        view.graphics.add(graphic);
      });
    });
  });
}




	
let GeoJsonIcons = [];

// Function to create a GeoJSONLayer with a specific icon for points
window.createIconGeoJSONLayer = function(url, iconUrl) {
    const layer = new GeoJSONLayer({
        url: url,
        renderer: {
            type: "simple",
            symbol: {
                type: "picture-marker",
                url: iconUrl,
                width: "16px",
                height: "16px"
            }
        }
    });

    layer.when(() => {
        layer.queryFeatures().then((result) => {
            if (result.features.length > 0) {
                const props = result.features[0].attributes;
                const nameField = Object.keys(props).find(key => key.toLowerCase().includes("name"));
                const descField = Object.keys(props).find(key => key.toLowerCase().includes("desc"));
            }
        });
    });
	
    // Labeling for ENR only
        layer.labelingInfo = [{
            labelExpressionInfo: { expression: "$feature.name" },
            symbol: {
                type: "text",
                color: "black",
                haloColor: "white",
                haloSize: "2px",
                font: {
                    size: "12px",
                    weight: "bold"
                }
            },
            labelPlacement: "above-center",
            minScale: 500000,
            maxScale: 0
        }];

    GeoJsonIcons.push({ layer });

    return layer;
}





     function convertGeoJSONGeometry(geometry) {
        if (geometry.type === "Polygon") {
            return new Polygon({
                rings: geometry.coordinates,
                spatialReference: SpatialReference.WGS84
            });
        }
        // Handle other geometry types as necessary (e.g., Point, Polyline, etc.)
        throw new Error(`Unsupported geometry type: ${geometry.type}`);
    }

    // Function to create the GeoJSON graphic for each polygon
function createGeoJSONGraphic(feature, colorHTML, alpha) {
    // Convert HTML color to RGBA with transparency
    const color = htmlToRGBA(colorHTML, alpha);
    const outlineColor = darkenColor(colorHTML, 1);
    const geometry = convertGeoJSONGeometry(feature.geometry);

    return new Graphic({
        geometry: geometry,
        symbol: {
            type: "simple-fill",
            color: color,  // Apply color with alpha transparency
            outline: {
                color: outlineColor,
                width: 2
            }
        },
        attributes: feature.properties // Attach properties to attributes
    });
}


window.updateMapLayers= function(layerStates) {
    for (const [layerToggleId, isVisible] of Object.entries(layerStates)) {
        const checkbox = document.getElementById(layerToggleId);
        if (checkbox) {
            checkbox.checked = isVisible; // Update checkbox state
            const layerName = getToggledLayerName({ target: checkbox });
            if (layerName && window[layerName]) {
                window[layerName].visible = isVisible; // Update layer visibility
            }
        }
    }
}
	
window.loadGeoJSONAndDisplay = function (url, opacity = 0.7, view) {
    const graphicsLayer = new GraphicsLayer({
        title: "GeoJSON Layer"
    });

    fetch(url)
        .then(response => response.json())
        .then(geojson => {
            // Iterate through the GeoJSON features and create individual graphics
            geojson.features.forEach((feature, index) => {    
                const color = colorSequences[index % colorSequences.length];  // Cycle color
                const graphic = createGeoJSONGraphic(feature, color, opacity);  // Apply color with alpha and opacity
                
                if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
                    const name = feature.properties.name || `Polygon ${index + 1}`; // Use `name` property or a default name
                    geoJSONPolygons.push({ geometry: graphic.geometry, feature });
                }
                
                // Add the graphic to the layer
                graphicsLayer.add(graphic);
            });

            // Setup click event after loading graphics
            //setupGraphicsLayerClickEvent(view, graphicsLayer);
        })
        .catch(error => console.error('Error loading GeoJSON:', error));

    // Return the newly created GraphicsLayer
    return graphicsLayer;
};

    // Create a GraphicsLayer for static graphics
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    // Create a variable to hold the user graphic
    let userGraphic;
    let tracking = false; // Variable to track the status of tracking
    let watchId; // Variable to hold the watch position ID

let isUserInteracting = false;

// Event listeners to detect user interaction on the map
view.on("drag", () => isUserInteracting = true);
view.on("mouse-wheel", () => isUserInteracting = true);
view.on("click", () => isUserInteracting = true);
view.on("pointer-move", () => isUserInteracting = true);

// Reset interaction flag after a delay to allow map updates
setInterval(() => isUserInteracting = false, 4000); // Adjust timing as needed
let flightPathPoints = []; // Stores all coordinates
let flightPathGraphic = null; // Holds the polyline graphic
let lastDotTimestamp = 0;
const dotInterval = 20000;
let trailDots = [];
function addUserLocationMarker(location, heading) {
		
    const userPoint = {
        type: "point",
        longitude: location[0],
        latitude: location[1]
    };
    flightPathPoints.push([userPoint.longitude, userPoint.latitude]);
	
    const now = Date.now();
	if (now - lastDotTimestamp >= dotInterval) {
    	lastDotTimestamp = now;

    	const dotGraphic = new Graphic({
        geometry: userPoint,
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: [0, 0, 255, 0.7], // Semi-transparent red
            size: 5,
            outline: {
                color: [255, 255, 255, 0.8],
                width: 1
            }
        }
    });

    graphicsLayer.add(dotGraphic);
    trailDots.push(dotGraphic);
}	
    // Limit trail length to 1000 points
    if (flightPathPoints.length > 1000) {
        flightPathPoints.shift();
    }

    const flightPath = {
        type: "polyline",
        paths: [flightPathPoints]
    };

    const trailSymbol = {
        type: "simple-line",
        color: [0, 0, 255, 0.7], // Blue trail
        width: 2
    };

    if (flightPathGraphic) {
        flightPathGraphic.geometry = flightPath;
    } else {
        flightPathGraphic = new Graphic({
            geometry: flightPath,
            symbol: trailSymbol
        });
        graphicsLayer.add(flightPathGraphic);
    }
    const markerSymbol = new PictureMarkerSymbol({
        url: "plane_1.png",
        width: "32px",
        height: "32px"
    });

    if (userGraphic) {
        userGraphic.geometry = userPoint;
    } else {
        userGraphic = new Graphic({
            geometry: userPoint,
            symbol: markerSymbol
        });
        graphicsLayer.add(userGraphic);
    }

    const adjustedHeading = (heading + view.rotation) % 360;
// Create the polyline graphic
const polylineGraphics = createDirectionalPolylineWithTicks([userPoint.longitude, userPoint.latitude], heading);

// Separate the main line from tick marks
const mainLineGraphic = polylineGraphics[0];
const tickGraphics = polylineGraphics.slice(1);
if (!userGraphic.polylineGraphic) {
    // First time: add main line and ticks
    userGraphic.polylineGraphic = mainLineGraphic;
    userGraphic.tickGraphics = tickGraphics;

    graphicsLayer.add(userGraphic.polylineGraphic);
    tickGraphics.forEach(tick => graphicsLayer.add(tick));
} else {
    // Update main polyline geometry
    userGraphic.polylineGraphic.geometry = mainLineGraphic.geometry;

    // Remove old ticks
    if (userGraphic.tickGraphics) {
        userGraphic.tickGraphics.forEach(tick => graphicsLayer.remove(tick));
    }

    // Add new ticks
    userGraphic.tickGraphics = tickGraphics;
    tickGraphics.forEach(tick => graphicsLayer.add(tick));
}

    if (!isUserInteracting) {
        // Calculate corrected map rotation
        const correctedRotation = 360 - heading;
        view.rotation = correctedRotation; // Rotate the map view
        view.center = userPoint; // Center map on user location
	console.log(mainLineGraphic.geometry);
	console.log(userGraphic.polylineGraphic);
        const intersections = checkIntersectionWithPolygons(mainLineGraphic.geometry, userPoint);
	console.log(intersections);    
        WL.Execute("ClosingInn", JSON.stringify(intersections));
    }
}
  
function checkIfInsidePolygon(userPoint) {
    let insideAnyPolygon = false;

    geoJSONPolygons.forEach((polygonData, index) => {
        const { geometry: polygonGeometry, feature } = polygonData;

        // Check if the point is inside the polygon
        if (geometryEngine.contains(polygonGeometry, userPoint)) {
            insideAnyPolygon = true;
        }
    });

    if (!insideAnyPolygon) {
        console.log("User is not inside any polygon.");
    }
}
    
function checkIntersectionWithPolygons(polylineGeometry, userPoint) {
    const intersectingPolygons = [];
    const defaultSR = { wkid: 4326 };

    if (!polylineGeometry?.spatialReference) {
        polylineGeometry.spatialReference = defaultSR;
    }

    geoJSONPolygons.forEach((polygonData) => {
        const { geometry: polygonGeometry, feature } = polygonData;

        if (!polygonGeometry || !polylineGeometry || !userPoint) {
            console.warn("Invalid geometry detected", { polygonGeometry, userPoint, polylineGeometry });
            return;
        }

        if (!polygonGeometry.spatialReference) {
            polygonGeometry.spatialReference = defaultSR;
        }

        if (!userPoint.spatialReference) {
            userPoint.spatialReference = defaultSR;
        }

        try {
            const convertedUserPoint = {
                type: "point",
                x: userPoint.longitude,
                y: userPoint.latitude,
                spatialReference: userPoint.spatialReference || defaultSR
            };

            const intersects = geometryEngine.intersects(polylineGeometry, polygonGeometry);
            const containsUser = geometryEngine.contains(polygonGeometry, convertedUserPoint);

            if (intersects && !containsUser && feature?.properties?.name) {
                const projectedPolyline = webMercatorUtils.geographicToWebMercator(polylineGeometry);
                const projectedPolygon = webMercatorUtils.geographicToWebMercator(polygonGeometry);
                const projectedUserPoint = webMercatorUtils.geographicToWebMercator(convertedUserPoint);

                const intersectionGeometry = geometryEngine.intersect(projectedPolyline, projectedPolygon);

                if (intersectionGeometry) {
                    let intersectionPoint = null;

                    if (intersectionGeometry.type === "polyline") {
                        const paths = intersectionGeometry.paths;
                        if (paths.length > 0 && paths[0].length > 0) {
                            const [x, y] = paths[0][0];
                            intersectionPoint = {
                                type: "point",
                                x,
                                y,
                                spatialReference: intersectionGeometry.spatialReference
                            };
                        }
                    } else if (intersectionGeometry.type === "point") {
                        intersectionPoint = intersectionGeometry;
                    }

                    if (intersectionPoint) {
                        const distance = geometryEngine.distance(projectedUserPoint, intersectionPoint, "nautical-miles");
                        if (distance != null) {
                            intersectingPolygons.push({
                                name: feature.properties.name,
                                distance: (Math.round(distance * 100) / 100).toFixed(2) // return as string
                            });
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Geometry engine error:", error);
        }
    });

    return intersectingPolygons;
}




function createDirectionalPolylineWithTicks(userPoint, heading) {
    const earthRadiusMeters = 6371000;
    const nauticalMileInMeters = 1852;
    const maxDistanceNm = 20;
    const segmentLengthNm = 5;
    const tickLengthMeters = 1500; // ~0.27 NM tick line

    const headingRadians = heading * (Math.PI / 180);
    const perpendicularHeading = heading + 90;
    const perpendicularRadians = perpendicularHeading * (Math.PI / 180);

    const pathPoints = [];
    const tickGraphics = [];

    for (let i = 0; i <= maxDistanceNm; i += segmentLengthNm) {
        const distanceMeters = i * nauticalMileInMeters;

        const deltaLat = (distanceMeters / earthRadiusMeters) * (180 / Math.PI) * Math.cos(headingRadians);
        const deltaLon = (distanceMeters / earthRadiusMeters) * (180 / Math.PI) * Math.sin(headingRadians) / Math.cos(userPoint[1] * Math.PI / 180);

        const lat = userPoint[1] + deltaLat;
        const lon = userPoint[0] + deltaLon;

        const mainPoint = [lon, lat];
        pathPoints.push(mainPoint);

        // Create a perpendicular tick mark at this point
        const tickDeltaLat = (tickLengthMeters / 2 / earthRadiusMeters) * (180 / Math.PI) * Math.cos(perpendicularRadians);
        const tickDeltaLon = (tickLengthMeters / 2 / earthRadiusMeters) * (180 / Math.PI) * Math.sin(perpendicularRadians) / Math.cos(lat * Math.PI / 180);

        const tickStart = [lon - tickDeltaLon, lat - tickDeltaLat];
        const tickEnd = [lon + tickDeltaLon, lat + tickDeltaLat];

        const tickGeometry = {
            type: "polyline",
            paths: [tickStart, tickEnd]
        };

        const tickSymbol = {
            type: "simple-line",
            color: [0, 0, 0, 1], // black tick
            width: 2
        };

        tickGraphics.push(new Graphic({
            geometry: tickGeometry,
            symbol: tickSymbol
        }));
    }

    // Create main polyline
    const polylineGeometry = {
        type: "polyline",
        paths: pathPoints
    };

    const lineSymbol = {
        type: "simple-line",
        color: [0, 0, 0, 1],
        width: 2
    };

    const mainLineGraphic = new Graphic({
        geometry: polylineGeometry,
        symbol: lineSymbol,
	spatialReference: { wkid: 4326 }
    });

    // Return main line + ticks
    return [mainLineGraphic, ...tickGraphics];
}

    
    // Function to toggle layer visibility based on checkbox states
function toggleLayerVisibility() {
    accfisLayer.visible = document.getElementById("accfisLayerToggle").checked;
    atzCtrLayer.visible = document.getElementById("atzCtrLayerToggle").checked;
    ctaLayer.visible = document.getElementById("ctaLayerToggle").checked;
    tmaLayer.visible = document.getElementById("tmaLayerToggle").checked;
    fadFapFarLayer.visible = document.getElementById("fadFapFarLayerToggle").checked;

    sacaaLayer.visible = document.getElementById("sacaaLayerToggle").checked;
    aerodromeAipLayer.visible = document.getElementById("aerodromeAipLayerToggle").checked;
    aerodromeAicLayer.visible = document.getElementById("aerodromeAicLayerToggle").checked;
    unlicensedLayer.visible = document.getElementById("unlicensedLayerToggle").checked;
    atnsLayer.visible = document.getElementById("atnsLayerToggle").checked;
    militaryLayer.visible = document.getElementById("militaryLayerToggle").checked;
    helistopsLayer.visible = document.getElementById("helistopsLayerToggle").checked;
    ENRLayer.visible = document.getElementById("ENRLayerToggle").checked;
    RnavLayer.visible = document.getElementById("RNAVLayerToggle").checked;
    IorraLayer.visible = document.getElementById("IORRALayerToggle").checked;
}

function getToggledLayerName(event) {
    const layerMap = {
        "accfisLayerToggle": "accfisLayer",
        "atzCtrLayerToggle": "atzCtrLayer",
        "ctaLayerToggle": "ctaLayer",
        "tmaLayerToggle": "tmaLayer",
        "fadFapFarLayerToggle": "fadFapFarLayer",
        "sacaaLayerToggle": "sacaaLayer",
        "aerodromeAipLayerToggle": "aerodromeAipLayer",
        "aerodromeAicLayerToggle": "aerodromeAicLayer",
        "unlicensedLayerToggle": "unlicensedLayer",
        "atnsLayerToggle": "atnsLayer",
        "militaryLayerToggle": "militaryLayer",
        "helistopsLayerToggle": "helistopsLayer",
        "ENRLayerToggle": "ENRLayer",
        "RNAVLayerToggle": "RnavLayer",
        "IORRALayerToggle": "IorraLayer"  
    };

    const layerName = layerMap[event.target.id];
    if (layerName) {
        console.log(`Layer toggled: ${layerName}, Visible: ${event.target.checked}`);
        return layerName;
    }
    return null;
}

// Add event listeners to the checkboxes
document.getElementById("accfisLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
    WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("atzCtrLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("ctaLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("tmaLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("fadFapFarLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});

document.getElementById("sacaaLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("aerodromeAipLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("aerodromeAicLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("unlicensedLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("atnsLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("militaryLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("helistopsLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});

document.getElementById("ENRLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
    WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("RNAVLayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
document.getElementById("IORRALayerToggle").addEventListener("change", (event) => {
    toggleLayerVisibility();
     WL.Execute("ToggleLayer", getToggledLayerName(event));
});
    
    // Function to start tracking
window.StartTracking = function() {
    if (!tracking) {
        tracking = true;
        watchId = navigator.geolocation.watchPosition(function(position) {
            if (position && position.coords) {
                const userLocation = [position.coords.longitude, position.coords.latitude];
                const heading = position.coords.heading || 0; // Default to 0 if heading is unavailable
                addUserLocationMarker(userLocation, heading); // Pass heading for rotation
            } else {
                console.error("Position is undefined or does not have coordinates.");
            }
        }, function(error) {
            console.error("Geolocation error: ", error);
        }, {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 5000
        });
    }
}

    // Function to stop tracking
window.EndTracking = function() {
    if (tracking) {
        tracking = false;

        // Remove the user graphic and related visuals
        if (userGraphic) {
            if (userGraphic.polylineGraphic) {
                graphicsLayer.remove(userGraphic.polylineGraphic);
                userGraphic.polylineGraphic = null;
            }
            if (userGraphic.tickGraphics) {
                graphicsLayer.removeMany(userGraphic.tickGraphics);
                userGraphic.tickGraphics = null;
            }
            if (userGraphic.textGraphic) {
                graphicsLayer.remove(userGraphic.textGraphic);
                userGraphic.textGraphic = null;
            }
            graphicsLayer.remove(userGraphic);
            userGraphic = null;
        }

        // ✅ Remove flight trail
        if (flightPathGraphic) {
            graphicsLayer.remove(flightPathGraphic);
            flightPathGraphic = null;
        }
        flightPathPoints = [];
	trailDots.forEach(dot => graphicsLayer.remove(dot));
	trailDots = [];
        // Stop geolocation tracking
        navigator.geolocation.clearWatch(watchId);

        // Reset the view
        view.container = null;
        const mapView = new MapView({
            container: "viewDiv",
            map: map,
            center: [22.4617, -33.9646],
            zoom: 12
        });

        view = mapView;
    }
};

    
// --- WINDY OVERLAY FIX ---
window.windy = function () {
  const center = view.center;
  const zoom = view.zoom;
  toggleWindyOverlay(center.latitude, center.longitude, zoom);
};

let windyAPIInstance = null;
let windyDiv = null;
let windyScriptLoaded = false;

// ✅ Dynamically load the Windy API if it's not present
// Load Windy script dynamically if needed
function loadWindyScript(callback) {
  if (typeof window.windyInit === "function") {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
  script.async = true;
  script.onload = callback;
  document.head.appendChild(script);
}

// Initialize Windy
loadWindyScript(() => {
  window.windyInit({
    key: "jxPFhDOiI68tIKHugP4K9Tg6ofYtIFyJ",
    lat: view.center.latitude,
    lon: view.center.longitude,
    zoom: view.zoom,
    container: "windy"
  }, (WindyAPI) => {
    console.log("Windy loaded!", WindyAPI);
    // Set overlay opacity
    document.getElementById("windy").style.opacity = 0.6;
  });
});

  windyScriptLoaded = true;
  console.log("🌬️ Loading Windy API script...");

  const script = document.createElement("script");
  script.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
  script.async = true;
  script.onload = () => {
    console.log("✅ Windy API script loaded");
    const check = setInterval(() => {
      if (typeof window.windyInit === "function") {
        clearInterval(check);
        callback();
      }
    }, 300);
  };
  document.head.appendChild(script);
}

// ✅ Wait until Windy is ready, then init
function initWindy(lat, lon, zoom) {
  console.log("🌬️ Initializing Windy overlay...");

  window.windyInit({
    key: "jxPFhDOiI68tIKHugP4K9Tg6ofYtIFyJ",
    lat,
    lon,
    zoom,
    container: "windy", // must match existing div
  }, (windyAPI) => {
    windyAPIInstance = windyAPI;

    // Set overlay opacity
    const windyDiv = document.getElementById("windy");
    if (windyDiv) windyDiv.style.opacity = "0.6";

    // Keep Windy synced with ArcGIS map
    view.watch(["center", "zoom"], () => {
      if (!windyAPIInstance) return;
      const { latitude, longitude } = view.center;
      windyAPIInstance.setPosition({ lat: latitude, lon: longitude, zoom: view.zoom });
    });
  });
}
// ✅ Toggle Windy overlay
window.toggleWindyOverlay = function (lat, lon, zoom) {
  // If overlay already exists, just toggle visibility
  if (windyDiv && windyAPIInstance) {
    const isHidden = windyDiv.style.display === "none";
    windyDiv.style.display = isHidden ? "block" : "none";
    return;
  }

  // Create transparent Windy overlay inside ArcGIS view
  windyDiv = document.createElement("div");
  windyDiv.id = "windyOverlay";
  windyDiv.style.position = "absolute";
  windyDiv.style.top = "0";
  windyDiv.style.left = "0";
  windyDiv.style.width = "100%";
  windyDiv.style.height = "100%";
  windyDiv.style.zIndex = "5";             // Below markers
  windyDiv.style.pointerEvents = "none";   // Pass clicks to ArcGIS
  windyDiv.style.opacity = "0.6";
  document.getElementById("viewDiv").appendChild(windyDiv);

  // ✅ Ensure Windy script is loaded, then init
  loadWindyScript(() => initWindy(lat, lon, zoom));
};

function highlightUpcomingSector(sector) {
    const highlightedSymbol = {
        type: "simple-fill",
        color: [255, 0, 0, 0.5], // Semi-transparent red fill
        outline: { color: [255, 0, 0], width: 2 }
    };

    // Update the sector's symbol
    sector.symbol = highlightedSymbol;

    // Optionally add it back to the layer to reflect the change
    graphicsLayer.add(sector);
}    


    
window.addMarkersAndDrawLine = function (data) {
    const layerIcons = {
        sacaaLayer: "sacaa.png",
        aerodromeAipLayer: "aip.png",
        aerodromeAicLayer: "aic.png",
        unlicensedLayer: "unlicensed.png",
        atnsLayer: "atns.png",
        militaryLayer: "military.png",
        helistopsLayer: "helistops.png",
        ENRLayer: "ENR.png",
        RnavLayer: "Iorra.png",
        IorraLayer:"Rnav.png"  
    };

    const layers = [
        sacaaLayer,
        aerodromeAipLayer,
        aerodromeAicLayer,
        unlicensedLayer,
        atnsLayer,
        militaryLayer,
        helistopsLayer,
        ENRLayer,
        RnavLayer,
        IorraLayer   
    ];

    const draggableGraphicsLayer = new GraphicsLayer({ zIndex: 2000 });
    window.draggableGraphicsLayer = draggableGraphicsLayer;
    map.add(draggableGraphicsLayer);
    draggableGraphicsLayer.removeAll();

	

    const polylineCoordinates = [];
    const markerGraphics = [];
    let activeCircleGraphic = null;
    let originalPosition = null; // Variable to track the original position of the marker

    // Create markers
    data.forEach((point, index) => {
        const { latitude, longitude, name, description, variation } = point;
        polylineCoordinates.push([longitude, latitude]);

        const markerUrl = index === 0
            ? "markerstart.png"
            : index === data.length - 1
            ? "markerend.png"
            : "markerdefault.png";

        const markerSymbol = {
            type: "picture-marker",
            url: markerUrl,
            width: "36px",
            height: "36px",
            yoffset: "18px", // Half the height of the marker (moves the anchor point to the bottom)
            anchor: "bottom-center"
        };

        const markerGraphic = new Graphic({
            geometry: { type: "point", longitude, latitude },
            symbol: markerSymbol,
            attributes: { name, description }
        });

        draggableGraphicsLayer.add(markerGraphic);
        markerGraphics.push(markerGraphic);

view.on("click", (event) => {
    view.hitTest(event).then((response) => {
        if (response.results.length) {
            const graphic = response.results.find(result => markerGraphics.includes(result.graphic))?.graphic;
            if (graphic) {
                view.draggedGraphic = graphic; // Set clicked marker as active
                originalPositionMark = graphic.geometry.clone(); // Store current position for cancel

                const mapPoint = graphic.geometry;
                
                getFeaturesWithinRadius(mapPoint, (pointsWithinRadius) => {
                    console.log("Points within radius:", pointsWithinRadius);

                    // Limit to 5 results
                    const limitedPoints = pointsWithinRadius.slice(0, 5);

                    // Create popup content
                    const content = limitedPoints.map(point => {
                        const truncatedDescription = point.description.length > 25
                            ? point.description.slice(0, 25) + "..."
                            : point.description;

                        return `
                            <div class="item">
                                <div class="icon">
                                    <img src="${point.icon}" alt="${point.name}" style="width: 16px; height: 16px; margin-right: 5px;">
                                    ${point.name}
                                </div>
                                <span class="identifier">${truncatedDescription}</span>
                            </div>
                        `;
                    }).join("");

                    console.log("Popup content:", content);

                    // Get screen position and show popup
                    const screenPoint = view.toScreen(mapPoint);
                    //showCustomPopup(content, screenPoint, limitedPoints);
                });
            }
        }
    });
});

    });

   const polylineGraphic = new Graphic({
        geometry: { type: "polyline", paths: [polylineCoordinates] },
        symbol: { type: "simple-line", color: [0, 0, 255, 0.5], width: 2 }
    });
    draggableGraphicsLayer.add(polylineGraphic);

 const path = polylineCoordinates[0]; // extract first path

function toRadians(deg) {
  return deg * Math.PI / 180;
}

function toDegrees(rad) {
  return rad * 180 / Math.PI;
}

function getDistanceNM(lat1, lon1, lat2, lon2) {
  const R = 3440.1;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

function getMagneticBearing(lat1, lon1, lat2, lon2, variation = 0) {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δλ = toRadians(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let bearing = toDegrees(Math.atan2(y, x));

  // Normalize true bearing to 0–360
  if (bearing < 0) {
    bearing = 360 - Math.abs(bearing);
  }

  // 🔹 Apply variation EXACTLY as in your working code (add)
  bearing += variation;

  // Normalize again to 0–360
  if (bearing >= 360) bearing -= 360;

  return Math.round(bearing * 100) / 100;
}



// 2. Draw directional triangle + distance/bearing text on each segment
for (let i = 0; i < polylineCoordinates.length - 1; i++) {
  const [lon1, lat1] = polylineCoordinates[i];
  const [lon2, lat2] = polylineCoordinates[i + 1];

  const midX = (lon1 + lon2) / 2;
  const midY = (lat1 + lat2) / 2;

  const angle = Math.atan2(lat2 - lat1, lon2 - lon1) * (180 / Math.PI);
  const distance = getDistanceNM(lat1, lon1, lat2, lon2);
  //const trueBearing = getBearing(lat1, lon1, lat2, lon2);
const variation = parseFloat(jsonData[i].variation); // get variation from source point

let magneticBearing = getMagneticBearing(lat1, lon1, lat2, lon2, variation, true);

// Normalize to 0–360
if (magneticBearing < 0) magneticBearing += 360;
if (magneticBearing >= 360) magneticBearing -= 360;

  // 2A. Add arrow slightly offset from start of segment
  const arrowX = lon1 + (lon2 - lon1) * 0.3;
  const arrowY = lat1 + (lat2 - lat1) * 0.3;

  const arrow = new Graphic({
    geometry: {
      type: "point",
      longitude: arrowX,
      latitude: arrowY
    },
    symbol: {
      type: "simple-marker",
      style: "triangle",
      color: [0, 0, 255, 1],
      size: 8,
      angle: angle,
      outline: {
        color: [0, 0, 255, 1],
        width: 1
      }
    }
  });
  draggableGraphicsLayer.add(arrow);

  // 2B. Add text label at midpoint
 const textGraphic = new Graphic({
  geometry: {
    type: "point",
    longitude: midX,
    latitude: midY
  },
  symbol: {
    type: "text",
    text: `${distance} nm\n${Math.round(magneticBearing)}° MB`,
    color: "black",
    font: {
      size: 10,
      weight: "bold",
      family: "Arial"
    },
    haloColor: "white",
    haloSize: 3,
    horizontalAlignment: "center",
    verticalAlignment: "middle",
    yoffset: 12
  }
});
draggableGraphicsLayer.add(textGraphic);
}

    zoomToFlightPlan(polylineCoordinates, window.view);
 	// Add custom buttons to view
	
    function zoomToFlightPlan(data, view) {
        if (!data || data.length < 2) {
            console.error("Insufficient data to zoom. Data:", data);
            return;
        }

        // Extract the start and end points
        const start = data[0];
        const end = data[data.length - 1];

        // Create an extent that covers the start and end points
        const extent = {
            xmin: Math.min(start[0], end[0]), // Min longitude
            ymin: Math.min(start[1], end[1]), // Min latitude
            xmax: Math.max(start[0], end[0]), // Max longitude
            ymax: Math.max(start[1], end[1]), // Max latitude
            spatialReference: { wkid: 4326 } // WGS 84 spatial reference
        };

        // Attempt to zoom to the extent
        view.goTo(extent).then(() => {
            console.log("Zoom to extent successful!");
        }).catch((error) => {
            console.error("Error zooming to extent:", error);
        });

        // Test direct zoom using a center and zoom level (for comparison)
        view.goTo({
            center: [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2], // Center the map at midpoint
            zoom: 6  // Set a reasonable zoom level for the flight path
        }).then(() => {
            console.log("Direct zoom successful!");
        }).catch((error) => {
            console.error("Error with direct zoom:", error);
        });
    }

    

    // Custom popup creation
    const customPopup = createPopup();

function createPopup() {
    const popup = document.createElement("div");
    popup.id = "custom-popup";
    popup.style.position = "fixed"; // Position relative to the viewport
    popup.style.background = "white";
    popup.style.border = "1px solid #ccc";
    popup.style.padding = "10px";
    popup.style.display = "block";
    popup.style.zIndex = "1000";
    popup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    popup.style.maxWidth = "90vw"; // Prevent the popup from exceeding the screen width
    popup.style.maxHeight = "80vh"; // Prevent the popup from exceeding the screen height
    popup.style.overflowY = "auto"; // Add scrolling for content that overflows
    popup.style.wordWrap = "break-word"; // Ensure long text doesn't overflow
    popup.style.display = "none";

    // **Always center it on screen**
    popup.style.left = "80%";
    popup.style.top = "50%";

    document.body.appendChild(popup);
    return popup;
}


    // Function to query features and build popup content
function getFeaturesWithinRadius(mapPoint, callback) {
    if (!activeCircleGraphic || !activeCircleGraphic.geometry) {
        console.warn("Active circle graphic or its geometry is null. Cannot query features.");
        callback([]); // Return an empty array as fallback
        return;
    }

    const pointsWithinRadius = [];

    // Create an array of promises for each layer's query, but only for visible layers
    const layerPromises = layers.map((layer) => {
        // Check if the layer is visible before querying
        if (layer.visible) {
            return layer.queryFeatures({
                geometry: activeCircleGraphic.geometry,
                spatialRelationship: "intersects", // Ensure spatial relationship is appropriate
                returnGeometry: true, // Ensure geometry is returned
                outFields: ["*"]
            }).then((result) => {
                result.features.forEach((feature) => {
                    if (feature.geometry) { // Ensure geometry exists
                        const layerName = Object.keys(layerIcons).find(key => layer === eval(key));
                        const iconUrl = layerIcons[layerName];

                        pointsWithinRadius.push({
                            name: feature.attributes.name || "Unknown",
                            description: feature.attributes.description || "No description available",
                            icon: iconUrl,
                            latitude: feature.geometry.latitude,
                            longitude: feature.geometry.longitude
                        });
                    } else {
                        console.warn("Feature geometry is null. Skipping:", feature);
                    }
                });
            }).catch((error) => {
                console.error("Error querying features:", error);
            });
        } else {
            console.log(`Layer ${layer.title} is not visible, skipping query.`);
            return Promise.resolve(); // Skip query for invisible layers
        }
    });

    // Use Promise.all to wait for all layer queries to complete
    Promise.all(layerPromises).then(() => {
        console.log("Points within radius:", pointsWithinRadius); // Log the points array
        callback(pointsWithinRadius); // Call the callback with the points
    }).catch((error) => {
        console.error("Error with layer queries:", error);
        callback([]); // Fallback to empty array in case of error
    });
}



    // Function to generate HTML for the popup
function generatePopupHTML(content, pointsWithinRadius) {
    const poiTags = pointsWithinRadius
    .map(point => `
        <span class="poi-tag" 
              data-latitude="${point.latitude}" 
              data-longitude="${point.longitude}" 
              data-name="${point.name}" 
              data-description="${point.description}">
            <img src="${point.icon}" alt="${point.name}" style="width: 16px; height: 16px; margin-right: 5px;">
            ${point.name}
        </span>
    `).join("");

    return `
        <h3>Current Location</h3>
        <div class="content">${content}</div>
        <div class="input-group">
            <label>Waypoint Name:</label>
            <input type="text" placeholder="Enter waypoint name">
            <label>Identifier:</label>
            <input type="text" placeholder="Enter identifier">
            <div class="button-group">
                <button class="create">Create</button>
                <button class="cancel">Cancel</button>
                <button class="delete-button"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
        <div class="poi-tags">
            ${poiTags}
        </div>`;
}



    let originalPositionMark = null;
    function showCustomPopup(content, screenPoint, pointsWithinRadius) {
    const popupHTML = generatePopupHTML(content, pointsWithinRadius);
    customPopup.innerHTML = popupHTML;

    // Set initial position
    customPopup.style.display = "block";

    // Wait for the popup to be fully rendered before adjusting position
    setTimeout(() => {
  // Get the popup dimensions AFTER rendering
        const popupRect = customPopup.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // **Correct centering**
        customPopup.style.left = `${(screenWidth - popupRect.width) / 2}px`;
        customPopup.style.top = `${(screenHeight - popupRect.height) / 2}px`;
    }, 0);

    // Attach event listeners to POI tags
    customPopup.querySelectorAll(".poi-tag").forEach((tag) => {
        tag.addEventListener("click", (event) => {
            const latitude = parseFloat(tag.dataset.latitude);
            const longitude = parseFloat(tag.dataset.longitude);
            const name = tag.dataset.name || "Unnamed POI";
            const description = tag.dataset.description || "No description available";

            if (view.draggedGraphic) {
                // Update the dragged marker's geometry
                const newPosition = { type: "point", latitude, longitude };
                view.draggedGraphic.geometry = newPosition;

                // Update the marker's attributes
                view.draggedGraphic.attributes.name = name;
                view.draggedGraphic.attributes.description = description;

                // Update the polyline coordinates
                const index = markerGraphics.indexOf(view.draggedGraphic);
                if (index !== -1) {
                    polylineCoordinates[index] = [longitude, latitude];
                    polylineGraphic.geometry = { type: "polyline", paths: [...polylineCoordinates] };
                    hitDetectionPolyline.geometry = { 
                        type: "polyline", 
                        paths: [...polylineCoordinates] 
                    };
                }

                // Notify the backend about the updated marker
                WL.Execute("AlertMe", getFlightPlanAsJSON());

                // Hide the popup after updating
                hideCustomPopup();
            }
        });
    });
}
    // Helper to hide custom popup
    function hideCustomPopup() {
        customPopup.style.display = "none";
    }

    let isDraggingMarker = false;

    function createCircle(mapPoint) {
        const circleGeometry = new Circle({
            center: mapPoint,
            radius: 9260, // 20 nautical miles in meters
            geodesic: true
        });

        const circleSymbol = {
            type: "simple-fill",
            color: [255, 0, 0, 0.2],
            outline: { color: [255, 0, 0, 0.8], width: 1 }
        };

        return new Graphic({
            geometry: circleGeometry,
            symbol: circleSymbol
        });
    }

		

    view.on("drag", (event) => {
        const { action } = event;
        const mapPoint = view.toMap({ x: event.x, y: event.y });	    

if (action === "start") {
    view.hitTest(event).then((response) => {
        if (response.results.length) {
            const graphic = response.results[0].graphic;
            if (markerGraphics.includes(graphic)) {
                originalPositionMark = graphic.geometry.clone();
                view.draggedGraphic = graphic;
                isDraggingMarker = true;

                // Create activeCircleGraphic
                activeCircleGraphic = createCircle(mapPoint);
                draggableGraphicsLayer.add(activeCircleGraphic);

                console.log("Active circle graphic initialized on start:", activeCircleGraphic);
                event.stopPropagation();
            }
        }
    });
} else if (action === "update" && isDraggingMarker && view.draggedGraphic) {
    // Update the marker's position
    view.draggedGraphic.geometry = mapPoint;

    // Update the corresponding polyline coordinates
    const index = markerGraphics.indexOf(view.draggedGraphic);
    if (index !== -1) {
        polylineCoordinates[index] = [mapPoint.longitude, mapPoint.latitude];
        polylineGraphic.geometry = {
            type: "polyline",
            paths: [...polylineCoordinates]
        };

        hitDetectionPolyline.geometry = {
            type: "polyline",
            paths: [...polylineCoordinates]
        };

        console.log("Polyline updated:", polylineGraphic.geometry);
    }

    // Update the active circle graphic
    if (activeCircleGraphic) {
        activeCircleGraphic.geometry = createCircle(mapPoint).geometry;
    }

    event.stopPropagation();
} else if (action === "end") {
    if (!isDraggingMarker) {
        console.log("Map pan detected. No marker drag to process.");
        return; // Exit early if it was a map pan
    }

    isDraggingMarker = false;

    if (!activeCircleGraphic) {
        console.warn("Active circle graphic was null. Recreating it.");
        activeCircleGraphic = createCircle(view.draggedGraphic.geometry);
    }

if (activeCircleGraphic && activeCircleGraphic.geometry) {
    const mapPoint = view.draggedGraphic.geometry;

    // Use getFeaturesWithinRadius to get points within the circle radius
    getFeaturesWithinRadius(mapPoint, (pointsWithinRadius) => {
        console.log("Points within radius:", pointsWithinRadius); // Debugging: Check the points passed

        // Limit the number of points to 5
        const limitedPoints = pointsWithinRadius.slice(0, 5);

        // Create content for the popup from the limited points
       const content = limitedPoints.map(point => {
    // Truncate description to 100 characters, and append "..." if it's longer than 100 characters
    const truncatedDescription = point.description.length > 25
        ? point.description.slice(0, 25) + "..."
        : point.description;

    return `
        <div class="item">
            <div class="icon">
                <img src="${point.icon}" alt="${point.name}" style="width: 16px; height: 16px; margin-right: 5px;">
                ${point.name}
            </div>
            <span class="identifier">${truncatedDescription}</span>
        </div>
    `;
}).join(""); // Combine all items into one string


        console.log("Popup content:", content); // Debugging: Log the final content string

        // Get the screen position for the popup and display it
        const screenPoint = view.toScreen(mapPoint);
        showCustomPopup(content, screenPoint, limitedPoints); // Show popup with content
    });
} else {
    console.warn("Active circle graphic or its geometry was still null after recreation.");
}

    // Clean up
    if (activeCircleGraphic) {
        draggableGraphicsLayer.remove(activeCircleGraphic);
        activeCircleGraphic = null;
    }

    console.log("Drag ended. Dragged graphic:", view.draggedGraphic);
}

    });

  customPopup.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button")) {
        console.log("Delete button clicked");

        if (view.draggedGraphic) {
            // Remove the dragged marker
            const index = markerGraphics.indexOf(view.draggedGraphic);
            if (index !== -1) {
                markerGraphics.splice(index, 1);
                polylineCoordinates.splice(index, 1);

                // Update the polyline
                polylineGraphic.geometry = { type: "polyline", paths: [...polylineCoordinates] };
                hitDetectionPolyline.geometry = { 
                    type: "polyline", 
                    paths: [...polylineCoordinates] 
                };

                // Remove from the graphics layer
                draggableGraphicsLayer.remove(view.draggedGraphic);
                console.log("Marker deleted:", view.draggedGraphic);
            }

            // Notify the backend (optional)
            WL.Execute("AlertMe", getFlightPlanAsJSON());

            // Hide popup after deletion
            hideCustomPopup();
        } else {
            console.warn("No marker selected for deletion.");
        }
    }
});


	
    // Event listener for Cancel button
 customPopup.addEventListener("click", (event) => {
    if (event.target.classList.contains("cancel")) {
        console.log("Cancel button clicked");

        if (view.draggedGraphic && originalPositionMark) {
            console.log("Resetting marker to:", originalPositionMark);

            // Reset marker position
            view.draggedGraphic.geometry = originalPositionMark.clone();

            // Force a refresh of the graphic
            draggableGraphicsLayer.remove(view.draggedGraphic);
            draggableGraphicsLayer.add(view.draggedGraphic);

            // Reset polyline coordinates
            const index = markerGraphics.indexOf(view.draggedGraphic);
            if (index !== -1) {
                polylineCoordinates[index] = [originalPositionMark.longitude, originalPositionMark.latitude];
                polylineGraphic.geometry = { type: "polyline", paths: [...polylineCoordinates] };
                hitDetectionPolyline.geometry = { 
                    type: "polyline", 
                    paths: [...polylineCoordinates] 
                };
                console.log("Polyline reset");
            }

            // Hide popup
            hideCustomPopup();
        } else {
            console.warn("No dragged graphic or original position found.");
        }
    }
});

customPopup.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON" && event.target.textContent.trim() === "Create") {
        console.log("Create button clicked");

        const waypointNameInput = customPopup.querySelector("input[placeholder='Enter waypoint name']");
        const identifierInput = customPopup.querySelector("input[placeholder='Enter identifier']");

        if (waypointNameInput && identifierInput) {
            const waypointName = waypointNameInput.value.trim();
            const identifier = identifierInput.value.trim();

            if (!waypointName || !identifier) {
                alert("Please fill in both the Waypoint Name and Identifier.");
                return;
            }

            if (view.draggedGraphic) {
                // Update the dragged graphic's attributes with new name and identifier
                view.draggedGraphic.attributes.name = waypointName;
                view.draggedGraphic.attributes.description = identifier;

                // Persist its current position as the "original position"
                originalPositionMark = view.draggedGraphic.geometry.clone();
                console.log("New position saved:", originalPositionMark);

                // Optionally update marker symbol to reflect the change
                draggableGraphicsLayer.remove(view.draggedGraphic);
                draggableGraphicsLayer.add(view.draggedGraphic);

                // Update the polyline with the new position
                const index = markerGraphics.indexOf(view.draggedGraphic);
                if (index !== -1) {
                    polylineCoordinates[index] = [
                        originalPositionMark.longitude,
                        originalPositionMark.latitude,
                    ];
                    polylineGraphic.geometry = { type: "polyline", paths: [...polylineCoordinates] };
                    hitDetectionPolyline.geometry = { 
                    type: "polyline", 
                    paths: [...polylineCoordinates] 
                    };
                    console.log("Polyline updated");
                }
                 WL.Execute("AlertMe", getFlightPlanAsJSON());
                // Hide the popup after saving
                hideCustomPopup();
            }
        } else {
            console.warn("Input fields not found in popup.");
        }
    }
});    

view.on("click", (event) => {
    if (customPopup.style.display === "block" && view.draggedGraphic && originalPositionMark) {
        console.log("Map clicked: Resetting marker to original position");

        // Reset marker position
        view.draggedGraphic.geometry = originalPositionMark.clone();

        // Force a refresh of the graphic
        draggableGraphicsLayer.remove(view.draggedGraphic);
        draggableGraphicsLayer.add(view.draggedGraphic);

        // Reset polyline coordinates
        const index = markerGraphics.indexOf(view.draggedGraphic);
        if (index !== -1) {
            polylineCoordinates[index] = [originalPositionMark.longitude, originalPositionMark.latitude];
            polylineGraphic.geometry = { type: "polyline", paths: [...polylineCoordinates] };
            hitDetectionPolyline.geometry = { 
             type: "polyline", 
            paths: [...polylineCoordinates] 
            };
            console.log("Polyline reset");
        }

        // Hide the popup
        hideCustomPopup();
    }
});
view.on("click", (event) => {
    view.hitTest(event).then((response) => {
        const graphic = response.results[0]?.graphic;

        if (graphic === hitDetectionPolyline) {
            const clickedPoint = view.toMap(event);
            const segmentIndex = findClosestSegment(clickedPoint, polylineCoordinates);
            if (segmentIndex !== -1) {
                addMarkerBetween(clickedPoint, segmentIndex);
            }
        }
    });
});

// Function to find the closest segment of the polyline
function findClosestSegment(point, coordinates) {
    let closestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < coordinates.length - 1; i++) {
        const [x1, y1] = coordinates[i];
        const [x2, y2] = coordinates[i + 1];
        const distance = distanceToSegment(point, { x1, y1, x2, y2 });
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
        }
    }

    return closestIndex;
}

// Function to compute the distance to a line segment
function distanceToSegment(point, segment) {
    const { x1, y1, x2, y2 } = segment;

    // Vector projection math to find the closest point on the segment
    const dx = x2 - x1;
    const dy = y2 - y1;
    const t = ((point.longitude - x1) * dx + (point.latitude - y1) * dy) / (dx * dx + dy * dy);

    const clampedT = Math.max(0, Math.min(1, t));
    const nearestX = x1 + clampedT * dx;
    const nearestY = y1 + clampedT * dy;

    const distance = Math.sqrt(
        Math.pow(nearestX - point.longitude, 2) + Math.pow(nearestY - point.latitude, 2)
    );
    return distance;
}
    const hitDetectionPolyline = new Graphic({
    geometry: polylineGraphic.geometry,
    symbol: {
        type: "simple-line",
        color: [0, 0, 0, 0], // Fully transparent line
        width: 20 // Increase the width for hit detection
    }
});
draggableGraphicsLayer.add(hitDetectionPolyline);
    

// Function to add a marker between two existing ones
function addMarkerBetween(mapPoint, segmentIndex) {
    const newMarkerSymbol = {
        type: "picture-marker",
        url: "markerdefault.png",
        width: "36px",
        height: "36px",
        yoffset: "18px", // Half the height of the marker (moves the anchor point to the bottom)
        anchor: "bottom-center"
    };

    const newMarkerGraphic = new Graphic({
        geometry: { type: "point", longitude: mapPoint.longitude, latitude: mapPoint.latitude },
        symbol: newMarkerSymbol,
        attributes: { name: "New Marker", description: "Inserted Marker" }
    });

    // Add the new marker graphic to the layer
    draggableGraphicsLayer.add(newMarkerGraphic);

    // Insert the new marker in the correct position
    markerGraphics.splice(segmentIndex + 1, 0, newMarkerGraphic);
    polylineCoordinates.splice(segmentIndex + 1, 0, [mapPoint.longitude, mapPoint.latitude]);

    // Update the polyline geometry
    polylineGraphic.geometry = { type: "polyline", paths: [...polylineCoordinates] };
    hitDetectionPolyline.geometry = { 
        type: "polyline", 
        paths: [...polylineCoordinates] 
    };
}  

function getFlightPlanAsJSON() {
    const flightPlan = markerGraphics.map((graphic, index) => ({
        name: graphic.attributes.name || Waypoint `${index + 1}`,
        description: graphic.attributes.description || "No description",
        latitude: graphic.geometry.latitude,
        longitude: graphic.geometry.longitude
    }));
    return JSON.stringify(flightPlan, null, 2); // Pretty-printed JSON
}
};
    
view.on("click", function () {
        if (layerTogglePanel.style.display === "none" || layerTogglePanel.style.display === "") {
        } else {
            layerTogglePanel.style.display = "none"; // Hide the panel
        }
    });

window.removeMarkersAndLines = function() {
    // Ensure you're removing from the correct graphics layers
    if (draggableGraphicsLayer) {
        draggableGraphicsLayer.removeAll();  // Clear all graphics from draggable layer
    }
    
    if (graphicsLayer) {
        graphicsLayer.removeAll();  // Clear all graphics from the main graphics layer
    }

};
    
    // Initial layer visibility toggle
    toggleLayerVisibility();
});
