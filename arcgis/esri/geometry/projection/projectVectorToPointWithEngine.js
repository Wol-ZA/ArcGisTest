// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../Point","../projection","./projectVectorToPoint"],function(b,f,g,h){b.projectVectorToPointWithEngine=async function(a,c,d,k){const e=h.projectVectorToPoint(a,c,d);if(null!=e)return e;a=new f({x:a[0],y:a[1],z:a[2],spatialReference:c,hasZ:!0});return g.projectWithZConversion(a,d,k)};Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})});