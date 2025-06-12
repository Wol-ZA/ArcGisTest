/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{c as o}from"./vec3f64.js";import{canProjectWithoutEngine as t,projectWithZConversion as r}from"../geometry/projection.js";import{p as e}from"./projectBuffer.js";import{f as s}from"./unitUtils.js";import{m as i}from"./dehydratedPoint.js";async function n(o,n,f,m,p){m??=0;const c=o.spatialReference;if(t(c,f)||null==c||null==f||s(c,f))return a[0]=o.x,a[1]=o.y,a[2]=o.z??m,void e(a,o.spatialReference,0,n,f,0,1);const j=i(o.x,o.y,o.z??m,c),l=await r(j,f,p);n[0]=l.x,n[1]=l.y,n[2]=l.z??0}const a=o();export{n as p};
