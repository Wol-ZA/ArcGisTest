/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{j as t}from"../../../chunks/ensureType.js";import{a as n}from"../../../chunks/metadata.js";import"../../../chunks/typedArrayUtil.js";import"../../../chunks/Logger.js";import"../../../config.js";import"../../lang.js";import"../../../chunks/utils.js";import"../../../chunks/handleUtils.js";const r=Object.prototype.toString;function o(n){const r="__accessorMetadata__"in n?t(n):n;return function(...t){if(t.push(r),"number"==typeof t[2])throw new Error("Using @cast has parameter decorator is not supported since 4.16");return s.apply(this,t)}}function s(t,r,o,s){n(t,r).cast=s}function e(...t){var s;if(3!==t.length||"string"!=typeof t[1])return 1===t.length&&"[object Function]"===r.call(t[0])?o(t[0]):1===t.length&&"string"==typeof t[0]?(s=t[0],(t,r)=>{n(t,s).cast=t[r]}):void 0}export{e as cast};
