// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../RasterFunction"],function(c,e){c.createRasterFunction=function(f,a,b){Object.keys(a).forEach(d=>{null==a[d]&&delete a[d]});b||(b="unknown");return new e({functionName:f,functionArguments:a,outputPixelType:b})};Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});