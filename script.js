// Initialize the map
const map = L.map('map').setView([-26.2041, 28.0473], 5); // Centered on South Africa

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Variables to store the fly marker and the heading (angle)
let flyMarker = null;
let flyAngle = 0;
let isTracking = false; // State variable to track if we are currently tracking
let watchId = null; // Store the watch ID for geolocation
let isAddingMarker = false; // State variable to track if adding a draggable marker

// Function to start tracking the user's location
function startTracking() {
    // Check if geolocation is available
    if (navigator.geolocation) {
        isTracking = true; // Set tracking state to true
        // Track the user's position in real time
        watchId = navigator.geolocation.watchPosition(updateFlyPosition, handleError, {
            enableHighAccuracy: true, // Use GPS if available
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Function to stop tracking the user's location
function stopTracking() {
    if (flyMarker) {
        map.removeLayer(flyMarker); // Remove the fly marker from the map
        flyMarker = null; // Reset the marker variable
    }
    if (watchId) {
        navigator.geolocation.clearWatch(watchId); // Stop watching the user's position
        watchId = null; // Reset the watch ID
    }
    isTracking = false; // Set tracking state to false
    isAddingMarker = false; // Reset marker adding state
}

let headingLine;
const nauticalMileInMeters = 1852; // 1 nautical mile is 1852 meters
const lineLengthNm = 20 * nauticalMileInMeters; // Line length in meters

function updateFlyPosition(position) {
    if (!isTracking) return; // Prevent updates if not tracking

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const heading = position.coords.heading; // Heading (if available, only on devices with compass)

    console.log("Latitude:", lat, "Longitude:", lng, "Heading:", heading); // Debugging

    // If the marker doesn't exist yet, create it at the current location
    if (!flyMarker) {
        flyMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'plane.png', // Path to the plane image
                iconSize: [50, 50],   // Size of the image
                iconAnchor: [25, 25], // Center the icon on the marker
            }),
            draggable: false
        }).addTo(map);

        // Center the map on the current location
        map.setView([lat, lng], 16); // Zoom level 16 to focus on the user
    } else {
        // If marker already exists, just update its position
        flyMarker.setLatLng([lat, lng]);
    }

    // If heading information is available and valid, rotate the marker and draw the line
    if (heading !== null && heading !== undefined && !isNaN(heading)) {
        flyAngle = heading;

        // Rotate the marker
        flyMarker.setRotationAngle(flyAngle);
        flyMarker.setRotationOrigin('center center'); // Ensure the rotation origin is the center of the image

        // Calculate the 20 nm position ahead of the plane
        const pointAhead = calculatePointAhead(lat, lng, heading, lineLengthNm);

        // If the heading line exists, update it. Otherwise, create it.
        if (!headingLine) {
            headingLine = L.polyline([ [lat, lng], pointAhead ], { color: 'red' }).addTo(map);
        } else {
            headingLine.setLatLngs([ [lat, lng], pointAhead ]);
        }
    } else {
        console.warn("Heading information not available.");
    }

    // Keep the map centered on the current position as you move
    map.panTo([lat, lng]);
}


// Function to calculate the point 20 nm ahead based on the heading
function calculatePointAhead(lat, lng, heading, distanceInMeters) {
    const R = 6371000; // Radius of the Earth in meters

    const bearing = heading * (Math.PI / 180); // Convert heading to radians
    const dist = distanceInMeters / R; // Angular distance in radians

    // Convert latitude and longitude from degrees to radians
    const latRad = lat * (Math.PI / 180);
    const lngRad = lng * (Math.PI / 180);

    // Calculate the new latitude
    const newLatRad = Math.asin(
        Math.sin(latRad) * Math.cos(dist) +
        Math.cos(latRad) * Math.sin(dist) * Math.cos(bearing)
    );

    // Calculate the new longitude
    const newLngRad = lngRad + Math.atan2(
        Math.sin(bearing) * Math.sin(dist) * Math.cos(latRad),
        Math.cos(dist) - Math.sin(latRad) * Math.sin(newLatRad)
    );

    // Convert back to degrees
    const newLat = newLatRad * (180 / Math.PI);
    const newLng = newLngRad * (180 / Math.PI);

    return [newLat, newLng];
}

// Enable rotation for the marker (using leaflet-rotatedmarker.js plugin)
L.Marker.include({
    setRotationAngle: function (angle) {
        this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + angle + 'deg)'; // Overwrite the transform
    }
});


function rotateMap(angle) {
    const tilePane = document.querySelector('.leaflet-tile-pane');
    tilePane.style.transform = `rotate(${-angle}deg)`; // Rotate only the tile layer
}




// Enable rotation for the marker (using leaflet-rotatedmarker.js plugin)
L.Marker.include({
    setRotationAngle: function (angle) {
        this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + angle + 'deg)'; // Overwrite the transform
    }
});



// Array of geojson file paths, colors, and icons
const geojsonFiles = [
    { file: 'ACCFIS.geojson', color: '#FFFF00', name: 'ACCFIS', opacity: 0.20, icon: 'accfis' },    // Yellow, 18%
    { file: 'CTA.geojson', color: '#00FF00', name: 'CTA', opacity: 0.03 },          // Green, 47%
    { file: 'FAD_FAP_FAR.geojson', color: '#0000FF', name: 'FAD_FAP_FAR', opacity: 0.25 }, // Blue, 87%
    { file: 'TMA.geojson', color: '#0000FF', name: 'TMA', opacity: 0.05 }, // Blue, 60%
    { file: 'ATZ_CTR.geojson', color: '#FF0000', name: 'ATZ_CTR', opacity: 0.01 },  // Red, 67%
    { file: 'SACAA.geojson', color: '#FF00FF', name: 'SACAA', icon: 'sacaa' }, // Magenta
    { file: 'Un-Licensed.geojson', color: '#00FFFF', name: 'Un-Licensed', icon: 'unlicensed' }, // Cyan
    { file: 'Aerodrome_AIC.geojson', color: '#FFA500', name: 'AIC', icon: 'aic' }, // Orange
    { file: 'Aerodrome_AIP.geojson', color: '#800080', name: 'AIP', icon: 'aip' }, // Purple
    { file: 'ATNS.geojson', color: '#808080', name: 'ATNS', icon: 'atns' }, // Gray
    { file: 'Military.geojson', color: '#000000', name: 'Military', icon: 'military' }, // Black
    { file: 'helistops.geojson', color: '#8B4513', name: 'Helistops', icon: 'helistops' } // SaddleBrown
];

// Define preset icons
const icons = {
    sacaa: L.icon({
        iconUrl: 'sacaa.png',
        iconSize: [13, 13],
        iconAnchor: [7, 5],
    }),
    unlicensed: L.icon({
        iconUrl: 'unlicensed.png',
        iconSize: [13, 13],
        iconAnchor: [7, 5],
    }),
    aic: L.icon({
        iconUrl: 'aic.png',
        iconSize: [13, 13],
        iconAnchor: [7, 5],
    }),
    aip: L.icon({
        iconUrl: 'aip.png',
        iconSize: [13, 13],
        iconAnchor: [7, 5],
    }),
    atns: L.icon({
        iconUrl: 'atns.png',
        iconSize: [13, 13],
        iconAnchor: [7, 5],
    }),
    military: L.icon({
        iconUrl: 'military.png',
        iconSize: [13, 13],
        iconAnchor: [7, 5],
    }),
    helistops: L.icon({
        iconUrl: 'helistops.png',
        iconSize: [13, 13],
        iconAnchor: [7, 5],
    }),
};

// Layer control
let geoJsonLayers = {};  // To store each GeoJSON layer for toggling
let overlays = {};       // For adding to the layer control

// Function to load GeoJSON data and return a Leaflet layer
function loadGeojson(file, color, opacity, iconKey, layerName) {
    return fetch(file)
        .then(response => response.json())
        .then(data => {
            let geoJsonLayer = L.geoJSON(data, {
                // Style for polygons and lines
                style: function (feature) {
                    return {
                        color: color,
                        weight: 2,
                        opacity: 1,
                        fillOpacity: opacity // Use the provided opacity
                    };
                },
                // For point features (markers), use the custom icons
                pointToLayer: function (feature, latlng) {
                    // Associate the geojson file name with the marker feature
                    feature.properties.geojsonFile = file; // Store the GeoJSON file name

                    if (iconKey && icons[iconKey]) {
                        return L.marker(latlng, { icon: icons[iconKey], feature: feature });
                    } else {
                        return L.circleMarker(latlng, {
                            radius: 6,
                            fillColor: color,
                            color: color,
                            fillOpacity: 0.8,
                            feature: feature
                        });
                    }
                }
            });

            // Add the GeoJSON layer to the map and store it
            geoJsonLayers[layerName] = geoJsonLayer;

            // Return the geoJsonLayer for further manipulation
            return geoJsonLayer;
        })
        .catch(error => {
            console.error('Error loading the GeoJSON file:', file, error);
        });
}

// Layer order and details for each GeoJSON file
const layerOrder = [
    { file: 'ACCFIS.geojson', color: '#FFFF00', name: 'ACCFIS', opacity: 0.20, icon: 'accfis' },    // Yellow, 18%
    { file: 'CTA.geojson', color: '#00FF00', name: 'CTA', opacity: 0.03 },          // Green, 47%
    { file: 'FAD_FAP_FAR.geojson', color: '#0000FF', name: 'FAD_FAP_FAR', opacity: 0.25 }, // Blue, 87%
    { file: 'TMA.geojson', color: '#0000FF', name: 'TMA', opacity: 0.05 }, // Blue, 60%
    { file: 'ATZ_CTR.geojson', color: '#FF0000', name: 'ATZ_CTR', opacity: 0.01 },  // Red, 67%
    { file: 'SACAA.geojson', color: '#FF00FF', name: 'SACAA', icon: 'sacaa' }, // Magenta
    { file: 'Un-Licensed.geojson', color: '#00FFFF', name: 'Un-Licensed', icon: 'unlicensed' }, // Cyan
    { file: 'Aerodrome_AIC.geojson', color: '#FFA500', name: 'AIC', icon: 'aic' }, // Orange
    { file: 'Aerodrome_AIP.geojson', color: '#800080', name: 'AIP', icon: 'aip' }, // Purple
    { file: 'ATNS.geojson', color: '#808080', name: 'ATNS', icon: 'atns' }, // Gray
    { file: 'Military.geojson', color: '#000000', name: 'Military', icon: 'military' }, // Black
    { file: 'helistops.geojson', color: '#8B4513', name: 'Helistops', icon: 'helistops' } // SaddleBrown
];

// Function to ensure layers are displayed in the correct order
function manageLayerOrder() {
    // Remove all layers
    Object.values(geoJsonLayers).forEach(layer => {
        map.removeLayer(layer);
    });

    // Re-add layers in the specified order, ensuring ATZ_CTR is on top
    layerOrder.forEach(layerInfo => {
        const layerName = layerInfo.name;
        if (geoJsonLayers[layerName]) {
            geoJsonLayers[layerName].addTo(map);
            if (layerName === 'ATZ_CTR') {
                geoJsonLayers[layerName].bringToFront(); // Ensure ATZ_CTR is always on top
            }
        }
    });
}

// Base layers for the control (can be left empty if not needed)
const baseLayers = {};

// Sequentially load layers
Promise.all(layerOrder.map(layer => 
    loadGeojson(layer.file, layer.color, layer.opacity, layer.icon, layer.name)
)).then(layers => {
    // Add layers to the overlays object for the control
    layers.forEach((layer, index) => {
        overlays[layerOrder[index].name] = layer;
    });

    // Create the Leaflet control with a collapsible option
    L.control.layers(baseLayers, overlays, {
    collapsed: true,
    position: 'bottomleft' // Set the position to bottom-right
    }).addTo(map);

    // Set the initial layer display order
    manageLayerOrder();
    
    console.log('All layers added to map in specified order with collapsible layer control.');
});

// Convert nautical miles to meters (1 nautical mile = 1852 meters)
const nauticalMileToMeters = 1852;
const radiusInNauticalMiles = 20;
const radiusInMeters = radiusInNauticalMiles * nauticalMileToMeters;

// Function to create a circle around the marker
function createCircle(latlng) {
    return L.circle(latlng, {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.1,
        radius: radiusInMeters,
        weight: 2,
        dashArray: '5, 5' // Dotted line
    }).addTo(map);
}

// Markers and polyline
let markers = [];
let polylines = [];
let circles = [];

// Function to update the polyline based on markers' positions
function updatePolyline() {
    if (polylines.length > 0) {
        polylines.forEach(polyline => map.removeLayer(polyline)); // Remove existing polylines
        polylines = []; // Clear polyline array
    }

    if (markers.length > 1) {
        const latlngs = markers.map(marker => marker.getLatLng());
        const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map); // Draw a polyline between markers
        polylines.push(polyline);
    }
}

// Function to add a draggable marker and the circle
// Function to add a draggable marker and the circle
function addDraggableMarkerAndCircle(latlng) {
     if (isTracking) return;
     isAddingMarker = true;
    const marker = L.marker(latlng, { draggable: true }).addTo(map);
    markers.push(marker);

    // Create a circle for the new marker
    const circle = createCircle(latlng);
    circles.push(circle); // Store the circle for future updates

    // Check for markers within the circle when added
    let geoJsonMarkersWithinRange = checkGeoJsonMarkersInRange(latlng, marker);
    updateMarkerPopup(marker, geoJsonMarkersWithinRange);
    updatePolyline();

    // Long press event handling
    let longPressTimeout;

    marker.on('mousedown', function () {
        longPressTimeout = setTimeout(() => {
            // Show a different popup on long press
            const longPressContent = `
                <div class="popup-container">
                    <div class="popup-header">
                        <span class="popup-title">Delete Waypoint?</span>
                    </div>
                    <div class="popup-content">
                        <p>Are you sure you want to delete this waypoint?</p>
                        <button class="popup-button" id="yes-button">Yes</button>
                        <button class="popup-button" id="no-button">No</button>
                    </div>
                </div>
            `;
            marker.bindPopup(longPressContent).openPopup();
        }, 500); // Long press duration (milliseconds)
    });

    marker.on('mouseup', function () {
        clearTimeout(longPressTimeout); // Clear the timeout if the mouse is released before the long press
    });

    marker.on('mouseleave', function () {
        clearTimeout(longPressTimeout); // Clear the timeout if the mouse leaves the marker
    });

    // Setup event listeners for the popup buttons
    marker.on('popupopen', function () {
        const yesButton = document.getElementById('yes-button');
        const noButton = document.getElementById('no-button');

        if (yesButton) {
            yesButton.onclick = function () {
                // Remove the marker from the map
                map.removeLayer(marker);
                // Remove the circle from the map
                const circleIndex = circles.findIndex(circle => {
                    const circleLatLng = circle.getLatLng();
                    return circleLatLng.lat === latlng.lat && circleLatLng.lng === latlng.lng; // Compare lat and lng directly
                });
                if (circleIndex !== -1) {
                    const circleToRemove = circles[circleIndex];
                    map.removeLayer(circleToRemove); // Remove the circle from the map
                    circles.splice(circleIndex, 1); // Remove from the circles array
                }
                // Remove the marker from the markers array
                markers = markers.filter(m => m !== marker);
                // Redraw the polyline
                updatePolyline();
            };
        }

        if (noButton) {
            noButton.onclick = function () {
                // Close the popup if "No" is clicked
                marker.closePopup();
            };
        }
    });

    // Update the circle position when the marker is dragged
    marker.on('drag', function (e) {
        const newLatLng = e.target.getLatLng();
        circle.setLatLng(newLatLng); // Move the circle with the marker
        updatePolyline(); // Update the polyline when the marker is dragged
        
        // Recalculate GeoJSON markers within range
        geoJsonMarkersWithinRange = checkGeoJsonMarkersInRange(newLatLng, marker);
        updateMarkerPopup(marker, geoJsonMarkersWithinRange); // Update popup with new info
    });
}







// Function to update the marker's popup with information about GeoJSON markers in range
function updateMarkerPopup(marker, geoJsonMarkersWithinRange) {
    if (geoJsonMarkersWithinRange.length > 0) {
        const popupContent = `
            <div class="popup-container">
                <div class="popup-header">
                    <span class="popup-title">Current Location</span>
                    <span class="popup-id">ID: EVEMU</span>
                </div>
                <div class="popup-add-waypoint">
                    <span>Add New Waypoint ▼</span>
                </div>
                ${geoJsonMarkersWithinRange.map(marker => `
                    <div class="popup-item">
                        <img src="${marker.iconUrl}" alt="Icon" class="popup-icon">
                        <span class="popup-description">${marker.description}</span>
                    </div>
                `).join('')}
            </div>
        `;
        marker.bindPopup(popupContent).openPopup(); // Bind the content to the marker's popup
    } else {
        marker.bindPopup("No GeoJSON markers within range.").openPopup(); // Default message if none found
    }
}


function checkGeoJsonMarkersInRange(centerLatLng, marker) {
    const geoJsonMarkersWithinRange = [];

    // Iterate through each GeoJSON layer to check for markers within the radius
    Object.values(geoJsonLayers).forEach(layer => {
        layer.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                const distance = centerLatLng.distanceTo(layer.getLatLng());
                if (distance <= radiusInMeters) {
                    const feature = layer.feature;

                    console.log('Feature properties:', feature.properties);

                    // Retrieve the associated GeoJSON file name
                    const geojsonFile = feature.properties.geojsonFile; // Get the GeoJSON file name
                    console.log('Associated GeoJSON file:', geojsonFile);

                    // Find the corresponding geojsonFile in the geojsonFiles array
                    const geojsonConfig = geojsonFiles.find(geojson =>
                        geojson.file.trim().toLowerCase() === geojsonFile.trim().toLowerCase());
                    console.log('Geojson config found:', geojsonConfig);

                    const iconKey = geojsonConfig ? geojsonConfig.icon : null;
                    console.log('Icon key:', iconKey);

                    // Get the icon URL based on the iconKey
                    const iconUrl = iconKey ? (icons[iconKey]?.options.iconUrl || 'default.png') : 'default.png';
                    console.log('Icon URL:', iconUrl);

                    geoJsonMarkersWithinRange.push({
                        description: feature.properties?.description || "Unknown",
                        iconUrl: iconUrl,
                        latlng: layer.getLatLng()
                    });
                }
            }
        });
    });

    console.log('GeoJSON markers within range:', geoJsonMarkersWithinRange);

    return geoJsonMarkersWithinRange; // Return the array for further processing
}

// Get the modal
const modal = document.getElementById("markerConfirmModal");
const confirmButton = document.getElementById("confirmButton");
const cancelButton = document.getElementById("cancelButton");
const closeButton = document.getElementsByClassName("close-button")[0];

// When the map is clicked
map.on('click', function (e) {
    // Show the modal
    modal.style.display = "block";

    // When the user clicks "Yes"
    confirmButton.onclick = function () {
        addDraggableMarkerAndCircle(e.latlng);
        modal.style.display = "none"; // Close the modal
    }

    // When the user clicks "No" or the close button
    cancelButton.onclick = closeButton.onclick = function () {
        modal.style.display = "none"; // Close the modal
    }
});

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none"; // Close the modal
    }
}


