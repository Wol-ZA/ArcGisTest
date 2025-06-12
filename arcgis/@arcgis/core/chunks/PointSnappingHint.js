/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{e as s}from"./vec3.js";import{a as t}from"./LineSnappingHint.js";class n extends t{constructor(s,t,n){super(t,n),this.point=s}equals(t){return t instanceof n&&s(this.point,t.point)}}export{n as P};
