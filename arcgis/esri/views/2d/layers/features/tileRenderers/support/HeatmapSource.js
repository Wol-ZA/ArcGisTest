// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../../../../../renderers/support/heatmapUtils"],function(a,b){class c{constructor(){this.gradient=null;this.height=512;this.intensities=null;this.width=512}render(d){b.drawHeatmap(d,512,this.intensities,this.gradient,this.minDensity,this.maxDensity)}}a.HeatmapSource=c;Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});