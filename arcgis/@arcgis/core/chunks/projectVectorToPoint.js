/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{c as r}from"./vec3f64.js";import e from"../geometry/Point.js";import{p as n}from"./projectBuffer.js";function o(r,o,f){if(null==o||null==f)return null;const l=new e({spatialReference:f});return n(r,o,0,t,f,0,1)?(l.x=t[0],l.y=t[1],l.z=t[2],l):null}const t=r();export{o as p};
