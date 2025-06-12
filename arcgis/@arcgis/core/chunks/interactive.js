/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{B as e}from"./index.js";
/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
 * v1.9.2
 */const t=/firefox/i.test(function(){if(!e.isBrowser)return"";const t=navigator.userAgentData;return t?.brands?t.brands.map((({brand:e,version:t})=>`${e}/${t}`)).join(" "):navigator.userAgent}()),n=t?new WeakMap:null;function i(){const{disabled:e}=this;e||HTMLElement.prototype.click.call(this)}function r(e){const i=e.target;if(t&&!n.get(i))return;const{disabled:r}=i;r&&e.preventDefault()}const a=["mousedown","mouseup","click"];function o(e){if(t&&!n.get(e.target))return;const{disabled:i}=e.target;i&&(e.stopImmediatePropagation(),e.preventDefault())}const s={capture:!0};function l(e,t=!1){if(e.disabled)return e.el.setAttribute("tabindex","-1"),e.el.setAttribute("aria-disabled","true"),e.el.contains(document.activeElement)&&document.activeElement.blur(),void c(e);d(e),"function"==typeof t?e.el.setAttribute("tabindex",t.call(e)?"0":"-1"):!0===t?e.el.setAttribute("tabindex","0"):!1===t&&e.el.removeAttribute("tabindex"),e.el.removeAttribute("aria-disabled")}function c(e){var n;e.el.click=i,(n=t?u(e):e.el)&&(n.addEventListener("pointerdown",r,s),a.forEach((e=>n.addEventListener(e,o,s))))}function u(e){return n.get(e.el)}function d(e){var n;delete e.el.click,(n=t?u(e):e.el)&&(n.removeEventListener("pointerdown",r,s),a.forEach((e=>n.removeEventListener(e,o,s))))}function f(e){if(!e.disabled||!t)return;const i=e.el.parentElement||e.el;n.set(e.el,i),c(e)}function b(e){t&&(n.delete(e.el),d(e))}export{f as c,b as d,l as u};
