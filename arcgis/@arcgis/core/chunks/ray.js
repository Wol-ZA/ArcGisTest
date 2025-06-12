/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{s as e,f as n}from"./screenUtils.js";import{o as r}from"./vec2.js";import{p as o,b as t,c as s,s as c}from"./vec3.js";import{c as i,s as u}from"./vector.js";function a(n,r,t=i()){return f(n,e(r),t),o(t.direction,t.direction),t}function f(e,r,o){return g(e,e.screenToRender(r,n(u.get())),o)}function g(e,o,s){const c=n(r(u.get(),o));if(c[2]=0,!e.unprojectFromRenderScreen(c,s.origin))return null;const i=n(r(u.get(),o));i[2]=1;const a=e.unprojectFromRenderScreen(i,u.get());return null==a?null:(t(s.direction,a,s.origin),s)}function l(e,r,o){return m(e,e.screenToRender(r,n(u.get())),o)}function m(e,n,r){s(r.origin,e.eye);const o=c(u.get(),n[0],n[1],1),i=e.unprojectFromRenderScreen(o,u.get());return null==i?null:(t(r.direction,i,r.origin),r)}export{a,g as b,l as c,m as d,f};
