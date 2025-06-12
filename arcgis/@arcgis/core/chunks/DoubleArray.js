/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{p as r,q as a}from"./typedArrayUtil.js";function n(a,n=!1){return a<=r?n?new Array(a).fill(0):new Array(a):new Float64Array(a)}function t(n){return(a(n)?n.length:n.byteLength/8)<=r?Array.from(n):new Float64Array(n)}function e(r,a,n){return Array.isArray(r)?r.slice(a,a+n):r.subarray(a,a+n)}function y(r,a){for(let n=0;n<a.length;++n)r[n]=a[n];return r}function o(r){return Array.isArray(r)?new Float64Array(r):r}export{t as a,y as c,e as d,n,o as t};
