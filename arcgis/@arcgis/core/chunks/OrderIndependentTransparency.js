/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{T as n}from"./TransparencyPassType.js";import{f as s,g as a}from"./enums3.js";import{s as r,b as t,d as o}from"./renderState2.js";const e=r(s.SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA),u=t(s.ONE,s.ONE),c=t(s.ZERO,s.ONE_MINUS_SRC_ALPHA);function N(s){return s===n.FrontFace?null:s===n.Alpha?c:u}function A(s){return s===n.FrontFace?o:null}const E=5e5,S={factor:-1,units:-2};function _(n){return n?S:null}function f(s,r=a.LESS){return s===n.NONE||s===n.FrontFace?r:a.LEQUAL}export{S as O,f as a,A as b,e as c,E as d,c as e,_ as g,N as o};
