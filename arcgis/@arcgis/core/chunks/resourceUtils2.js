/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{h as e}from"./typedArrayUtil.js";import{T as t}from"./basicInterfaces.js";class r{constructor(e){this.data=e,this.type="encoded-mesh-texture",this.encoding=t.KTX2_ENCODING}}function n(e){return"encoded-mesh-texture"===e?.type}async function s(e){const t=new Blob([e]),r=await t.text();return JSON.parse(r)}async function o(n,s){if(s===t.KTX2_ENCODING)return new r(n);const o=new Blob([n],{type:s}),a=URL.createObjectURL(o),c=new Image;if(e("esri-iPhone"))return new Promise(((e,t)=>{const r=()=>{s(),e(c)},n=e=>{s(),t(e)},s=()=>{URL.revokeObjectURL(a),c.removeEventListener("load",r),c.removeEventListener("error",n)};c.addEventListener("load",r),c.addEventListener("error",n),c.src=a}));try{c.src=a,await c.decode()}catch(e){console.warn("Failed decoding HTMLImageElement")}return URL.revokeObjectURL(a),c}export{r as E,o as a,n as i,s as j};
