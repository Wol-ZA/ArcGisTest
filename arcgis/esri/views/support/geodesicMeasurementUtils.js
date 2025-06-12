// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../geometry/support/geodesicUtils","../../geometry/support/spatialReferenceUtils"],function(c,e,d){c.geodesicMeasure=function(a,f,g,h,...b){return d.isGeographic(a)&&e.isSupported(a)?f.apply(void 0,b):d.isWebMercator(a)?g.apply(void 0,b):h.apply(void 0,b)};Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});