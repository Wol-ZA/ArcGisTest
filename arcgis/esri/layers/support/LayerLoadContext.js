// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../support/requestPresets"],function(c,e){class f{constructor(){this._serviceMetadatas=new Map}async fetchServiceMetadata(b,a){const d=this._serviceMetadatas.get(b);if(d)return d;a=await e.fetchArcGISServiceJSON(b,a);this._serviceMetadatas.set(b,a);return a}}c.LayerLoadContext=f;Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});