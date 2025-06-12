/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import t from"../request.js";import{j as r}from"./ensureType.js";import{getJsonType as o}from"../geometry/support/jsonUtils.js";import{p as s,a as e}from"./utils6.js";import{d as p}from"./utils7.js";import m from"../rest/support/ProjectParameters.js";const a=r(m);async function i(r,m,i){m=a(m);const j=s(r),n={...j.query,f:"json",...m.toJSON()},u=m.outSpatialReference,f=o(m.geometries[0]),c=e(n,i);return t(j.path+"/project",c).then((({data:{geometries:t}})=>p(t,f,u)))}export{i as p};
