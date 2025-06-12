/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{f as r}from"./vec4f64.js";import{S as e}from"./ScreenSpacePass.glsl.js";import{F as o}from"./Float4PassUniform.js";import{N as t,g as s}from"./interfaces3.js";import{S as a}from"./ShaderBuilder.js";import{T as n}from"./Texture2DPassUniform.js";class l extends t{constructor(){super(...arguments),this.color=r(1,1,1,1)}}const m=Object.freeze(Object.defineProperty({__proto__:null,TextureOnlyPassParameters:l,build:function(){const r=new a;return r.include(e),r.fragment.uniforms.add(new n("tex",(r=>r.texture)),new o("uColor",(r=>r.color))),r.fragment.code.add(s`void main() {
vec4 texColor = texture(tex, uv);
fragColor = texColor * uColor;
}`),r}},Symbol.toStringTag,{value:"Module"}));export{m as T,l as a};
