/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{v as e}from"./dom.js";import{B as t}from"./index.js";
/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
 * v1.9.2
 */const n="CALCITE-COMBOBOX-ITEM",o="CALCITE-COMBOBOX-ITEM-GROUP",r=`${n}, ${o}`,s={listContainer:"list-container"};function c(e){const t=e.parentElement?.closest(r),n=t?.parentElement?.closest(r);return[t,n].filter((e=>e))}function a(e){return e.ancestors?.filter((e=>"CALCITE-COMBOBOX-ITEM"===e.nodeName))||[]}function l(t){return e(t.querySelectorAll("calcite-combobox-item"))}function i(t){return e(t.querySelectorAll("calcite-combobox-item")).filter((e=>e.selected)).length>0}function u(e){return t.isBrowser?document.evaluate("ancestor::calcite-combobox-item | ancestor::calcite-combobox-item-group",e,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null).snapshotLength:0}function m(e){return e.includes("single")}export{r as C,l as a,n as b,o as c,s as d,c as e,u as f,a as g,i as h,m as i};
