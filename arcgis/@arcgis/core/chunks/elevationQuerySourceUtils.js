/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import n from"../Ground.js";import{T as l,i as r,Q as t}from"./typedArrayUtil.js";import{g as u}from"./unitUtils.js";function i(r){if(null==r)return null;if(r instanceof n)return e(r);const t=r.tileInfo;if(null==t)return null;const i=l(t.lods);return null==i?null:i.resolution*u(t.spatialReference)}function e(n){if(null==n)return null;const l=n.layers.items.map(o).filter(r);return t(l)??null}function o(n){return n&&"tileInfo"in n?i(n):null}export{i as a,e as g};
