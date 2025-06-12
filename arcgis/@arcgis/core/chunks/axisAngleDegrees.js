/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{r as s,d as r}from"./mathUtils.js";import{s as a,m as t,g as n}from"./quat.js";import{a as o}from"./quatf64.js";import{c as u,k as f,p as c,u as i}from"./vec3.js";import{d as e,e as m,U as p}from"./vec3f64.js";function j(s=k){return[s[0],s[1],s[2],s[3]]}function d(s,r,a=j()){return u(a,s),a[3]=r,a}function v(s,r,a=j()){return f(a,s,r),c(a,a),a[3]=-i(s,r),a}function g(r,o,u=j()){return a(l,r,b(r)),a(x,o,b(o)),t(l,x,l),f=u,c=s(n(u,l)),f[3]=c,f;var f,c}function h(s,r,a,t=j()){return d(e,s,w),d(m,r,y),d(p,a,z),g(w,y,w),g(w,z,t),t}function q(s){return s}function U(s){return s[3]}function b(s){return r(s[3])}const k=[0,0,1,0],l=o(),x=o();j();const w=j(),y=j(),z=j();export{g as a,b,j as c,q as d,h as e,d as f,U as g,v as h,k as u};
