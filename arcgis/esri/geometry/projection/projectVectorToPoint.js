// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../chunks/vec3f64","../Point","./projectBuffer"],function(d,f,g,h){const a=f.create();d.projectVectorToPoint=function(k,e,c){if(null==e||null==c)return null;const b=new g({spatialReference:c});return h.projectBuffer(k,e,0,a,c,0,1)?(b.x=a[0],b.y=a[1],b.z=a[2],b):null};Object.defineProperty(d,Symbol.toStringTag,{value:"Module"})});