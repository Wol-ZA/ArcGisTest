/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{S as e}from"./ScreenSpacePass.glsl.js";import{F as r}from"./FloatPassUniform.js";import{I as o}from"./IntegerPassUniform.js";import{N as a,g as t}from"./interfaces3.js";import{S as s}from"./ShaderBuilder.js";import{T as n}from"./Texture2DPassUniform.js";var i,m,f,c;!function(e){e[e.INNER=0]="INNER",e[e.OUTER=1]="OUTER"}(i||(i={})),function(e){e[e.REGULAR=0]="REGULAR",e[e.HAS_NORTH_POLE=1]="HAS_NORTH_POLE",e[e.HAS_SOUTH_POLE=2]="HAS_SOUTH_POLE",e[e.HAS_BOTH_POLES=3]="HAS_BOTH_POLES"}(m||(m={})),function(e){e[e.OFF=0]="OFF",e[e.ON=1]="ON"}(f||(f={})),function(e){e[e.FADING=0]="FADING",e[e.IMMEDIATE=1]="IMMEDIATE",e[e.UNFADED=2]="UNFADED"}(c||(c={}));class u extends a{constructor(){super(...arguments),this.overlayIndex=i.INNER,this.opacity=1}}const O=Object.freeze(Object.defineProperty({__proto__:null,OverlayCompositingPassParameters:u,build:function(){const a=new s;return a.include(e),a.fragment.uniforms.add(new n("tex",(e=>e.texture))),a.fragment.uniforms.add(new o("overlayIdx",(e=>e.overlayIndex))),a.fragment.uniforms.add(new r("opacity",(e=>e.opacity))),a.fragment.code.add(t`void main() {
vec2 overlayUV = overlayIdx == 0 ? vec2(uv.x * 0.5, uv.y) : vec2(uv.x * 0.5 + 0.5, uv.y);
fragColor = texture(tex, overlayUV) * opacity;
}`),a}},Symbol.toStringTag,{value:"Module"}));export{f as L,i as O,m as P,c as T,O as a,u as b};
