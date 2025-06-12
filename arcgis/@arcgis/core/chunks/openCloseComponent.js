/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{r as n}from"./index.js";
/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
 * v1.9.2
 */function t(n){return"opened"in n?n.opened:n.open}function e(n,e=!1){(e?n[n.transitionProp]:t(n))?n.onBeforeOpen():n.onBeforeClose(),(e?n[n.transitionProp]:t(n))?n.onOpen():n.onClose()}function i(i,o=!1){n((()=>{if(i.transitionEl){const{transitionDuration:s,transitionProperty:a}=getComputedStyle(i.transitionEl),p=s.split(","),l=p[a.split(",").indexOf(i.openTransitionProp)]??p[0];if("0s"===l)return void e(i,o);const E=setTimeout((()=>{i.transitionEl.removeEventListener("transitionstart",n),i.transitionEl.removeEventListener("transitionend",r),i.transitionEl.removeEventListener("transitioncancel",r),e(i,o)}),1e3*parseFloat(l));function n(e){e.propertyName===i.openTransitionProp&&e.target===i.transitionEl&&(clearTimeout(E),i.transitionEl.removeEventListener("transitionstart",n),(o?i[i.transitionProp]:t(i))?i.onBeforeOpen():i.onBeforeClose())}function r(n){n.propertyName===i.openTransitionProp&&n.target===i.transitionEl&&((o?i[i.transitionProp]:t(i))?i.onOpen():i.onClose(),i.transitionEl.removeEventListener("transitionend",r),i.transitionEl.removeEventListener("transitioncancel",r))}i.transitionEl.addEventListener("transitionstart",n),i.transitionEl.addEventListener("transitionend",r),i.transitionEl.addEventListener("transitioncancel",r)}}))}export{i as o};
