// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../chunks/vec3f64","./projectBuffer"],function(c,d,e){const b=d.create();c.projectVectorToDehydratedPoint=function(f,g,a){return e.projectBuffer(f,g,0,b,a.spatialReference,0,1)?(a.x=b[0],a.y=b[1],a.z=b[2],a):null};Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});