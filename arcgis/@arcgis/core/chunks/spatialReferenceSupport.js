/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{S as i}from"./unitUtils.js";import{V as S}from"./ViewingMode.js";function o(o,r){return null!=o&&(null==r||(r===S.Local?!o.isGeographic||o.isWGS84||o.wkid===i.CGCS2000:o.isWebMercator||o.isWGS84||o.wkid===i.CGCS2000||o.wkid===i.GCSMARS2000||o.wkid===i.GCSMARS2000_SPHERE||o.wkid===i.GCSMOON2000))}export{o as i};
