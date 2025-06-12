/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import e from"../core/Accessor.js";import{S as s}from"./ShaderOutput.js";const r={required:[]},t={required:[s.Depth]},a={required:[s.CompositeColor]},o={required:[s.Highlight]},n={required:[s.Depth,s.Normal]};class u extends e{consumes(){return r}get usedMemory(){return 0}get isDecoration(){return!1}get running(){return!1}}class d extends u{}class i extends u{}class c extends u{}class l extends u{}export{l as A,t as C,i as S,d as a,r as b,c,a as d,o as e,n as f};
