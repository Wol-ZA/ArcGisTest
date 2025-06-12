/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{g as s}from"./index.js";import{g as e}from"./locale2.js";
/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
 * v1.9.2
 */const n={};function a(){throw new Error("could not fetch component message bundle")}function t(s){s.messages={...s.defaultMessages,...s.messageOverrides}}async function o(s){s.defaultMessages=await c(s,s.effectiveLocale),t(s)}async function c(t,o){const{el:c}=t,i=c.tagName.toLowerCase().replace("calcite-","");return async function(e,t){const o=`${t}_${e}`;return n[o]||(n[o]=fetch(s(`./assets/${t}/t9n/messages_${e}.json`)).then((s=>(s.ok||a(),s.json()))).catch((()=>a()))),n[o]}(e(o,"t9n"),i)}async function i(s,e){s.defaultMessages=await c(s,e),t(s)}function f(s){s.onMessagesChange=u}function r(s){s.onMessagesChange=void 0}function u(){t(this)}export{f as c,r as d,o as s,i as u};
