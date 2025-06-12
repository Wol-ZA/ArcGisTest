/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{h as t}from"./index.js";
/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
 * v1.9.2
 */const e={width:12,height:6,strokeWidth:1},i=({floatingLayout:i,key:o,ref:r})=>{const{width:a,height:h,strokeWidth:s}=e,n=a/2,d="vertical"===i,l=`M0,0 H${a} L${a-n},${h} Q${n},${h} ${n},${h} Z`;return t("svg",{"aria-hidden":"true",class:"calcite-floating-ui-arrow",height:a,key:o,ref:r,viewBox:`0 0 ${a} ${a+(d?0:s)}`,width:a+(d?s:0)},s>0&&t("path",{class:"calcite-floating-ui-arrow__stroke",d:l,fill:"none","stroke-width":s+1}),t("path",{d:l,stroke:"none"}))};export{i as F};
