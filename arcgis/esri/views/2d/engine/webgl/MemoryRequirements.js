// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(function(){class d{constructor(){this._byGeometryType=null}get satisfied(){return!this._byGeometryType}reset(){this._byGeometryType=null}verticesFor(a){return this._byGeometryType?this._byGeometryType[a].vertices:0}indicesFor(a){return this._byGeometryType?this._byGeometryType[a].indices:0}needMore(a,b,c){if(b||c)this._byGeometryType||(this._byGeometryType=[{vertices:0,indices:0},{vertices:0,indices:0},{vertices:0,indices:0},{vertices:0,indices:0},{vertices:0,indices:0}]),a=this._byGeometryType[a],
a.vertices+=b,a.indices+=c}}return d});