// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../../engine/webgl/DisplayId"],function(b,c){class d{constructor(){this._freeIds=[];this._idCounter=1}createId(a=!1){return c.createDisplayId(this._getFreeId(),a)}releaseId(a){this._freeIds.push(a)}_getFreeId(){return this._freeIds.length?this._freeIds.pop():this._idCounter++}}b.DisplayIdGenerator=d;Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})});