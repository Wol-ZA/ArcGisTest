/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{g as t}from"./assets.js";import{h as s}from"./typedArrayUtil.js";let a=null,i=null;async function e(){return a||(a=async function(){const a=s("esri-csp-restrictions")?await import("./libtess-asm.js").then((t=>t.l)):await import("./libtess2.js").then((t=>t.l));i=await a.load({locateFile:s=>t(`esri/core/libs/libtess/${s}`)})}()),a}function n(t,s){const a=Math.max(t.length,128e3);return i.triangulate(t,s,a)}export{e as l,n as t};
