/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import"./typedArrayUtil.js";import{f as e}from"./vec3f64.js";import{f as t}from"./aaBoundingBox.js";function r(t,{isPrimitive:r,width:n,depth:s,height:o}){const a=r?10:1;if(null==n&&null==o&&null==s)return[a*t[0],a*t[1],a*t[2]];const c=e(n,s,o);let i;for(let e=0;e<3;e++){const r=c[e];if(null!=r){i=r/t[e];break}}for(let e=0;e<3;e++)null==c[e]&&(c[e]=t[e]*i);return c}const n=t(-.5,-.5,-.5,.5,.5,.5),s=t(-.5,-.5,0,.5,.5,1),o=t(-.5,-.5,0,.5,.5,.5);function a(e){switch(e){case"sphere":case"cube":case"diamond":return n;case"cylinder":case"cone":case"inverted-cone":return s;case"tetrahedron":return o;default:return}}const c=["butt","square","round"],i=[...c,"none"],u=["miter","bevel","round"];export{u as a,r as b,c as l,a as o,i as p};
