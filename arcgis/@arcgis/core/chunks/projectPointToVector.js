/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{c as o}from"./vec3f64.js";import{p as r}from"./projectBuffer.js";function e(o,e,s,c=0){t[0]=o.x,t[1]=o.y;const f=o.z;return t[2]=void 0!==f?f:c,r(t,o.spatialReference,0,e,s,0,1)}const t=o();export{e as p};
