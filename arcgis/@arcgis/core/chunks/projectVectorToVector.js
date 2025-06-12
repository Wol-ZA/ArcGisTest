/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{c as r}from"./vec3f64.js";import{p as t}from"./projectBuffer.js";function n(r,n,e,f){return!(null==n||null==f||r.length<2)&&(2===r.length&&(o[0]=r[0],o[1]=r[1],o[2]=0,r=o),t(r,n,0,e,f,0,1))}const o=r();export{n as p};
