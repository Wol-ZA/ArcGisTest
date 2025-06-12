/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{s as a,m as s}from"./quat.js";import{a as t}from"./quatf64.js";import{c as o,f as r}from"./vec3f64.js";import{a as m,t as n}from"./common.js";import{c,p as f,x as i}from"./vec3.js";const p=o(),u=t(),e=t(),j=t(),h=r(0,0,1),q=r(0,1,0),v=r(1,0,0);function x(s){c(p,s),f(p,p);const o=Math.atan2(p[1],p[0]),r=a(t(),h,-o);i(p,p,r);const n=-1*Math.atan2(p[2],p[0]);return[m(o)+270,m(n)+90]}function M(t,o){return a(e,h,n(t-270)),a(j,q,n(o-90)),s(u,e,j),c(p,v),i(p,p,u),f(p,p),[p[0],p[1],p[2]]}export{M as a,x as c};
