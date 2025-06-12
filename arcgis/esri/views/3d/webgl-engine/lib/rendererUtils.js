// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","./ChangeSet"],function(f,g){f.splitRenderGeometryChangeSetByMaterial=function(c){const d=new Map,e=a=>{let b=d.get(a);b||(b=new g.MaterialChangeSet,d.set(a,b));return b};c.removes.forAll(a=>{1<=a.geometry.indexCount&&e(a.material).removes.push(a)});c.adds.forAll(a=>{1<=a.geometry.indexCount&&e(a.material).adds.push(a)});c.updates.forAll(a=>{1<=a.renderGeometry.geometry.indexCount&&e(a.renderGeometry.material).updates.push(a)});return d};Object.defineProperty(f,Symbol.toStringTag,
{value:"Module"})});