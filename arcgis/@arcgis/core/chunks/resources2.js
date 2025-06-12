/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{throwIfAborted as a}from"../core/promiseUtils.js";import{r as s}from"./requestImageUtils.js";async function t(t){const r=import("./mask-svg.js"),i=import("./overlay-svg.js"),o=s((await r).default,{signal:t}),e=s((await i).default,{signal:t}),m={mask:await o,overlay:await e};return a(t),m}export{t as l};
