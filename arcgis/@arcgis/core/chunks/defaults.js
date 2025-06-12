/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import"./typedArrayUtil.js";import s from"../symbols/SimpleFillSymbol.js";import o from"../symbols/SimpleLineSymbol.js";import r from"../symbols/SimpleMarkerSymbol.js";import m from"../symbols/TextSymbol.js";import{d as e,a as l,b as t,c as a,e as n,f as i,g as f}from"./defaultsJSON.js";const p=r.fromJSON(e),S=o.fromJSON(l),u=s.fromJSON(t),y=m.fromJSON(a);function c(s){if(null==s)return null;switch(s.type){case"mesh":return null;case"point":case"multipoint":return p;case"polyline":return S;case"polygon":case"extent":return u}return null}const b=r.fromJSON(n),J=o.fromJSON(i),N=s.fromJSON(f);export{u as a,S as b,p as c,y as d,J as e,N as f,c as g,b as h};
