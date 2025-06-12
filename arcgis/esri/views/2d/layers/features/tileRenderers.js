// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","./tileRenderers/HeatmapTileRenderer","./tileRenderers/SymbolTileRenderer"],function(a,d,e){a.createOrReuseTileRenderer=function(b,c){if(!b)return null;switch(b.type){case "symbol":return new e.SymbolTileRenderer(c);case "heatmap":return new d.HeatmapTileRenderer(c)}};Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});