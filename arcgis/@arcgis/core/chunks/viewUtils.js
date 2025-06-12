/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{c as e,a as r,b as o}from"./screenUtils.js";import{a as t,n as s}from"./vec2.js";import{c as n}from"./vec3.js";import{c as a}from"./vec3f64.js";import{m as c}from"./dehydratedPoint.js";import{b as i}from"./elevationInfoUtils.js";function m(e,r,o,n){o.projectToRenderScreen(e,l),o.projectToRenderScreen(r,u),t(n,u,l),s(n,n)}function p(e,r,o,t,s=a()){const c=n(j,e);return c[2]=i(t,c,r,o)||0,t.renderCoordsHelper.toRenderCoords(c,r,s),s}function f(r,o,t,s){return"2d"===s.type?(d.x=r[0],d.y=r[1],d.spatialReference=o,s.toScreen(d)):(p(r,o,t,s,j),s.state.camera.projectToScreen(j,v),e(v[0],v[1]))}const d=c(0,0,0,null),j=a(),l=o(),u=o(),v=r();export{p as a,m as r,f as v};
