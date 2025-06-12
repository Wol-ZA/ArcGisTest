// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../../core/MemCachePool","./TerrainAttributes"],function(d,e,f){class g{constructor(a){this._storage=new e.MemCachePool((c,b)=>a.newCache(c,b),"TileGeometry")}acquire(a){a=4*Math.ceil(a/4);const c=this._storage.pop(a.toString());if(c)return c;const b=f.terrainAttributesLayout.createBuffer(a);b.release=()=>this._release(b);return b}_release(a){this._storage.put(a.count.toString(),a)}clear(){this._storage.clear()}destroy(){this._storage.destroy()}}d.TerrainAttributesCache=g;Object.defineProperty(d,
Symbol.toStringTag,{value:"Module"})});