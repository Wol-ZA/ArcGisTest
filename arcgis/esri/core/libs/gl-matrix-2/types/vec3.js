// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../../typedArrayUtil"],function(b,c){function d(a){return c.isFloat32Array(a)&&3<=a.length}function e(a){return(c.isFloat64Array(a)||Array.isArray(a))&&3<=a.length}b.isVec3=function(a){return d(a)||e(a)};b.isVec3f32=d;b.isVec3f64=e;Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})});