/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{f as e}from"./requestPresets.js";async function t(t,r){const a=await e(t,r);i(a),n(a);const s={serviceJSON:a};if((a.currentVersion??0)<10.5)return s;const y=await e(t+"/layers",r);return i(y),n(y),s.layersJSON={layers:y.layers,tables:y.tables},s}function r(e){return"Feature Layer"===e.type||"Oriented Imagery Layer"===e.type}function a(e){return"Table"===e.type}function n(e){e.layers=e.layers?.filter(r),e.tables=e.tables?.filter(a)}function s(e){e.type||="Feature Layer"}function y(e){e.type||="Table"}function i(e){e.layers?.forEach(s),e.tables?.forEach(y)}export{t as f};
