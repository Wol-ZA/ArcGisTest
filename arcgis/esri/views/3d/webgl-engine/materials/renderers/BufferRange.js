// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports"],function(e){class g{constructor(a=0,b=0){this.from=a;this.to=b}get numElements(){return this.to-this.from}}e.BufferRange=g;e.mergeAdjacentRanges=function(a){const b=new Map;a.forAll(c=>b.set(c.from,c));let f=!0;for(;f;)f=!1,a.forEach(c=>{const d=b.get(c.to);d&&(c.to=d.to,b.delete(d.from),a.removeUnordered(d),f=!0)})};Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})});