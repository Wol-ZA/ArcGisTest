// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports"],function(c){function d(a){return"graphic"===a?.type}c.filterGraphicHits=function(a){return a.filter(d)};c.findFirstGraphicHit=function(a){return a.find(d)??null};c.hitTestSelectSimilarDistance=async function(a,b){if("2d"===a.type)return a.hitTest(b);a=await a.hitTest(b);if(0===a.results.length)return a;const e=1.05*(a.results[0].distance??0);b=a.results.findIndex(f=>(f.distance??0)>e);-1!==b&&(a.results=a.results.slice(0,b));return a};Object.defineProperty(c,Symbol.toStringTag,
{value:"Module"})});