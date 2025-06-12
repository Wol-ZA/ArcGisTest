/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{h as n}from"./typedArrayUtil.js";var t;function r(n,r,o={}){const e=r===t.WEBGL1?"webgl":"webgl2";return n.getContext(e,o)||null}function o(n,t,o={}){const c=e(n);for(const n of c){const e=r(t,n,o);if(e)return e}return null}function e(r){if("3d"===r)return[t.WEBGL2];const o=n("esri-force-webgl");return o===t.WEBGL1||o===t.WEBGL2?[o]:n("mac")&&n("chrome")?[t.WEBGL1,t.WEBGL2]:[t.WEBGL2,t.WEBGL1]}!function(n){n[n.WEBGL1=1]="WEBGL1",n[n.WEBGL2=2]="WEBGL2"}(t||(t={}));export{t as C,o as a,r as c,e as g};
