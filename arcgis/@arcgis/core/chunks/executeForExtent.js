/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import"../geometry.js";import{p as t}from"./utils6.js";import{c as r}from"./query.js";import o from"../rest/support/Query.js";import e from"../geometry/Extent.js";async function m(m,s,n){const p=t(m);return r(p,o.from(s),{...n}).then((t=>({count:t.data.count,extent:e.fromJSON(t.data.extent)})))}export{m as e};
