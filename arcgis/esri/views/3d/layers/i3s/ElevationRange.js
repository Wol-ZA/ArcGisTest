// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports"],function(c){c.expandElevationRange=function(a,b,d){a&&("number"===typeof b?(a.elevationRangeMin=Math.min(a.elevationRangeMin,b),a.elevationRangeMax=Math.max(a.elevationRangeMax,d)):(a.elevationRangeMin=Math.min(a.elevationRangeMin,b.elevationRangeMin),a.elevationRangeMax=Math.max(a.elevationRangeMax,b.elevationRangeMax)))};Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});