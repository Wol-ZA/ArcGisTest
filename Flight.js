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
    "esri/geometry/projection"
], function(Circle, Extent, Map, MapView, SceneView, GeoJSONLayer, Graphic, Point, PictureMarkerSymbol, GraphicsLayer,Polygon,SpatialReference,geometryEngine,Polyline,projection) {

    // Create the map
   window.map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation"
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
                color: [226, 119, 40], // Orange
                width: 4
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

    return layer;
};

view.on("click", function (event) {
        view.hitTest(event).then(function (response) {
            if (response.results.length > 0) {
                response.results.forEach((result) => {
                    if (result.graphic) {
                        const attributes = result.graphic.attributes;
                        if (attributes && attributes.name) {
                            console.log("Clicked Layer:", result.layer.title || "Unknown Layer");
				WL.Execute("GetSectorName", attributes.name);
                        } else {
                            console.log("Feature has no 'name' property.");
                        }
                    }
                });
            } else {
                console.log("No feature clicked.");
            }
        }).catch(error => {
            console.error("Error in hitTest:", error);
        });
    });
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
        },
        popupTemplate: {
            title: "{name}",
            content: "{description}"
        }
    });

    // Only add labelingInfo for ENR.geojson
    if (url === "ENR.geojson") {
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
            minScale: 300000,
            maxScale: 0
        }];
    }

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
        // Here, alpha is applied directly to the RGBA color array for the polygon's fill
        const color = htmlToRGBA(colorHTML, alpha);  // Color with transparency
        const outlineColor = darkenColor(colorHTML, 1);  // Darken for outline
        const geometry = convertGeoJSONGeometry(feature.geometry);

        return new Graphic({
            geometry: geometry,
            symbol: {
                type: "simple-fill",
                color: color,  // Apply color with alpha transparency
                outline: {
                    color: outlineColor,  // Darken for outline
                    width: 2
                }
            }
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
    
 window.loadGeoJSONAndDisplay = function(url, opacity = 0.7) {
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
            })
            .catch(error => console.error('Error loading GeoJSON:', error));

        // Return the newly created GraphicsLayer
        return graphicsLayer;
    };

    // Define point layers and add to the map
   // const sacaaLayer = createIconGeoJSONLayer("SACAA.geojson", "SACAA_1.png");
	//const aerodromeAipLayer = createIconGeoJSONLayer("Aerodrome_AIP.geojson", "AIP_1.png");
	//const aerodromeAicLayer = createIconGeoJSONLayer("Aerodrome_AIC.geojson", "AIC_1.png");
	//const unlicensedLayer = createIconGeoJSONLayer("Un-Licensed.geojson", "unlicensed_1.png");
	//const atnsLayer = createIconGeoJSONLayer("ATNS.geojson", "ATNS_1.png");
	//const militaryLayer = createIconGeoJSONLayer("Military.geojson", "military_1.png");
	//const helistopsLayer = createIconGeoJSONLayer("helistops.geojson", "helistops_1.png");
	//const ENRLayer = createIconGeoJSONLayer("ENR.geojson", "ENR.png");
	//const RnavLayer = createIconGeoJSONLayer("RNAV.geojson", "Rnav.png");
	//const IorraLayer = createIconGeoJSONLayer("IORRA.geojson", "Iorra.png");
	//const AorraLayer = createIconGeoJSONLayer("AORRA.geojson", "Iorra.png");

    // Add point layers to the map
   // map.addMany([sacaaLayer, aerodromeAipLayer, aerodromeAicLayer, unlicensedLayer, atnsLayer, militaryLayer, helistopsLayer, ENRLayer, RnavLayer, IorraLayer, AorraLayer]);

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

function addUserLocationMarker(location, heading) {
    const userPoint = {
        type: "point",
        longitude: location[0],
        latitude: location[1]
    };

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
    const polylineGraphic = createDirectionalPolyline(location, heading);
    // Add or update the polyline graphic on the map
    if (!userGraphic.polylineGraphic) {
        userGraphic.polylineGraphic = polylineGraphic;
        graphicsLayer.add(userGraphic.polylineGraphic);
    } else {
        userGraphic.polylineGraphic.geometry = polylineGraphic.geometry; // Update existing polyline
    }

    if (!isUserInteracting) {
        // Calculate corrected map rotation
        const correctedRotation = 360 - heading;
        view.rotation = correctedRotation; // Rotate the map view
        view.center = userPoint; // Center map on user location
        //const intersections = checkIntersectionWithPolygons(polylineGraphic.geometry, userPoint);
        //console.log(intersections)
        //WL.Execute("ClosingInn", intersections);
    }
}
  
function checkIfInsidePolygon(userPoint) {
    let insideAnyPolygon = false;

    geoJSONPolygons .forEach((polygonData, index) => {
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

    geoJSONPolygons.forEach((polygonData) => {
        const { geometry: polygonGeometry, feature } = polygonData;

        // Ensure geometries are valid
        if (!polygonGeometry || !userPoint) {
            console.warn("Invalid geometry detected", polygonGeometry, userPoint);
            return; // Skip this iteration
        }

        // Check if the polyline intersects the polygon
        const intersects = geometryEngine.intersects(polylineGeometry, polygonGeometry);

        // Check if the user is inside this polygon
        const containsUser = geometryEngine.contains(polygonGeometry, userPoint);

        // Add to the array if it intersects and does not contain the user
        if (intersects && !containsUser && feature.properties?.name) {
            intersectingPolygons.push({ name: feature.properties.name });
        }
    });

    return intersectingPolygons;
}

function createDirectionalPolyline(userPoint, heading) {
    const nauticalMilesToMeters = 60 * 1852; // 20 nautical miles in meters
    const earthRadiusMeters = 6371000; // Earth's radius in meters

    // Convert heading to radians
    const headingRadians = heading * (Math.PI / 180);

    // Calculate the endpoint based on distance and heading
    const endLatitude = userPoint[1] + (nauticalMilesToMeters / earthRadiusMeters) * (180 / Math.PI) * Math.cos(headingRadians);
    const endLongitude = userPoint[0] + (nauticalMilesToMeters / earthRadiusMeters) * (180 / Math.PI) * Math.sin(headingRadians) / Math.cos(userPoint[1] * Math.PI / 180);

    // Create the polyline geometry
    const polylineGeometry = {
        type: "polyline",
        paths: [[userPoint[0], userPoint[1]], [endLongitude, endLatitude]]
    };

    // Define the line symbol
    const lineSymbol = {
        type: "simple-line",
        color: [255, 105, 180, 0.7],
        width: 2
    };

    // Return the polyline graphic
    return new Graphic({
        geometry: polylineGeometry,
        symbol: lineSymbol
    });
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
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    }
}

    // Function to stop tracking
window.EndTracking = function() {
    if (tracking) {
        tracking = false; // Set tracking status to false
        
        // Remove the user graphic, polyline graphic, and text graphic
        if (userGraphic) {
            if (userGraphic.polylineGraphic) {
                graphicsLayer.remove(userGraphic.polylineGraphic); // Remove the polyline
                userGraphic.polylineGraphic = null; // Clear the polyline reference
            }
            if (userGraphic.textGraphic) {
                graphicsLayer.remove(userGraphic.textGraphic); // Remove the text graphic
                userGraphic.textGraphic = null; // Clear the text reference
            }
            graphicsLayer.remove(userGraphic); // Remove the user marker
            userGraphic = null; // Clear the user graphic reference
        }
        
        navigator.geolocation.clearWatch(watchId); // Stop watching the position
        
        // Reset the view without replacing the map container
        view.container = null;
        const mapView = new MapView({
            container: "viewDiv",
            map: map,
            center: [22.4617, -33.9646],
            zoom: 12
        });
        
        view = mapView; // Update the view variable
    }
};
    
window.windy = function(){
    var center = view.center; // Get the map's current center
    var zoom = view.zoom;
    toggleWindyOverlay(center.latitude, center.longitude, zoom);
}
    
window.toggleWindyOverlay = function (lat,lon,zoom) {
    // Check if the Windy iframe already exists
    const existingIframe = document.getElementById("windyIframe");

    if (existingIframe) {
        // If the iframe exists, remove it
        existingIframe.remove();
    } else {
        // Define the iframe for the Windy API overlay
        const windyIframe = document.createElement("iframe");

        // Customize the iframe settings to match Windy overlay size and settings
        windyIframe.src = "https://embed.windy.com/embed2.html" +
                          `?lat=${lat}` + // Use dynamic latitude
                          `&lon=${lon}` + // Use dynamic longitude
                          `&zoom=${zoom}` + // Use dynamic zoom level
                          "&level=surface" +
                          "&overlay=wind" +
                          "&menu=&message=true" +
                          "&marker=&calendar=&pressure=&type=map" +
                          "&location=coordinates" +
                          "&detail=&detailLat=" +
                          "&metricWind=default&metricTemp=default";
        windyIframe.id = "windyIframe"; // Add an ID to the iframe for toggling
        windyIframe.width = "100%"; // Set full width
        windyIframe.height = "100%"; // Set full height
        windyIframe.style.position = "absolute";
        windyIframe.style.top = "0";
        windyIframe.style.left = "0";
        windyIframe.style.zIndex = "1000"; // Ensure it overlays map
        windyIframe.style.border = "none";

        // Append the iframe to the map container
        document.getElementById("viewDiv").appendChild(windyIframe);
    }
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

    const draggableGraphicsLayer = new GraphicsLayer({ zIndex: 1000 });
    window.draggableGraphicsLayer = draggableGraphicsLayer;
    map.add(draggableGraphicsLayer);
    draggableGraphicsLayer.removeAll();

    const polylineCoordinates = [];
    const markerGraphics = [];
    let activeCircleGraphic = null;
    let originalPosition = null; // Variable to track the original position of the marker

    // Create markers
    data.forEach((point, index) => {
        const { latitude, longitude, name, description } = point;
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
    });

    const polylineGraphic = new Graphic({
        geometry: { type: "polyline", paths: polylineCoordinates },
        symbol: { type: "simple-line", color: [0, 0, 255, 0.5], width: 4 }
    });
    draggableGraphicsLayer.add(polylineGraphic);
    zoomToFlightPlan(polylineCoordinates,window.view);

function zoomToFlightPlan(data, view) {
    if (!data || data.length < 2) {
        console.error("Insufficient data to zoom. Data:", data);
        return;
    }

    // Extract the start and end points
    const start = data[0];
    const end = data[data.length - 1];

    // Log coordinates for debugging
    console.log("Start point:", start);
    console.log("End point:", end);

    // Create an extent that covers the start and end points
    const extent = {
        xmin: Math.min(start[0], end[0]), // Min longitude
        ymin: Math.min(start[1], end[1]), // Min latitude
        xmax: Math.max(start[0], end[0]), // Max longitude
        ymax: Math.max(start[1], end[1]), // Max latitude
        spatialReference: { wkid: 4326 } // WGS 84 spatial reference
    };

    // Log extent for debugging
    console.log("Calculated extent:", extent);

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
    popup.style.position = "absolute";
    popup.style.background = "white";
    popup.style.border = "1px solid #ccc";
    popup.style.padding = "10px";
    popup.style.display = "none";
    popup.style.zIndex = "1000";
    popup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    popup.style.maxWidth = "90%"; // Prevent the popup from exceeding the screen width
    popup.style.maxHeight = "90%"; // Prevent the popup from exceeding the screen height
    popup.style.overflowY = "auto"; // Add scrolling for content that overflows
    popup.style.wordWrap = "break-word"; // Ensure long text doesn't overflow
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

        // Set initial position of the popup
        customPopup.style.left = `${screenPoint.x}px`;
        customPopup.style.top = `${screenPoint.y}px`;
        customPopup.style.display = "block";

        
        // Check if the popup overflows the screen horizontally (right side)
        const popupRect = customPopup.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

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
        
        // Adjust for horizontal overflow (right side)
        if (popupRect.right > screenWidth) {
            const offsetX = popupRect.right - screenWidth;
            customPopup.style.left = `${screenPoint.x - offsetX - 10}px`; // Adjust 10px for margin
        }

        // Adjust for vertical overflow (bottom side)
        if (popupRect.bottom > screenHeight) {
            const offsetY = popupRect.bottom - screenHeight;
            customPopup.style.top = `${screenPoint.y - offsetY - 10}px`; // Adjust 10px for margin
        }

        // Optionally: Adjust for overflow on the left side (if it's too far left)
        if (popupRect.left < 0) {
            const offsetX = popupRect.left;
            customPopup.style.left = `${screenPoint.x - offsetX + 10}px`; // Adjust 10px for margin
        }

        // Optionally: Adjust for overflow on the top side (if it's too far up)
        if (popupRect.top < 0) {
            const offsetY = popupRect.top;
            customPopup.style.top = `${screenPoint.y - offsetY + 10}px`; // Adjust 10px for margin
        }
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

    // Optional: Refresh the view, forcing a re-render
    if (view) {
        view.refresh();  // This triggers a re-render of the map if needed
    }
};
    
    // Initial layer visibility toggle
    toggleLayerVisibility();
});
