// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../chunks/vec3f64","./projectBuffer"],function(c,e,f){const a=e.create();c.projectPointToVector=function(b,g,h,k=0){a[0]=b.x;a[1]=b.y;const d=b.z;a[2]=void 0!==d?d:k;return f.projectBuffer(a,b.spatialReference,0,g,h,0,1)};Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});