/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{f as e}from"./index.js";import{c as o}from"./observers.js";
/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
 * v1.9.2
 */const t=new Set;let s;const n={childList:!0};function r(e){s||(s=o("mutation",i)),s.observe(e.el,n)}function c(e){t.delete(e.el),i(s.takeRecords()),s.disconnect();for(const[e]of t.entries())s.observe(e,n)}function i(o){o.forEach((({target:o})=>{e(o)}))}export{r as c,c as d};
