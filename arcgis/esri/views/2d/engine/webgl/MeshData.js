// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(function(){class c{constructor(){this.vertexData=new Map;this.vertexCount=0;this.indexData=[]}clear(){this.vertexData.clear();this.vertexCount=0;this.indexData=[]}update(b,d,e){for(const a in b)this.vertexData.set(a,b[a]);for(const a in this.vertexData)null===b[a]&&this.vertexData.delete(a);this.vertexCount=d;this.indexData=e}}return c});