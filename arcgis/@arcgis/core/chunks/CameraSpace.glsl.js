/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{f as r}from"./vec2.js";import{c as o}from"./vec2f64.js";import{s as a}from"./vec4.js";import{a as e}from"./vec4f64.js";import{F as t}from"./Float2PassUniform.js";import{F as f}from"./Float4PassUniform.js";import{g as c}from"./interfaces3.js";function m(o){o.fragment.uniforms.add(new f("projInfo",((r,o)=>function(r){const o=r.camera.projectionMatrix;return 0===o[11]?a(s,2/(r.camera.fullWidth*o[0]),2/(r.camera.fullHeight*o[5]),(1+o[12])/o[0],(1+o[13])/o[5]):a(s,-2/(r.camera.fullWidth*o[0]),-2/(r.camera.fullHeight*o[5]),(1-o[8])/o[0],(1-o[9])/o[5])}(o)))),o.fragment.uniforms.add(new t("zScale",((o,a)=>0===a.camera.projectionMatrix[11]?r(n,0,1):r(n,1,0)))),o.fragment.code.add(c`vec3 reconstructPosition(vec2 fragCoord, float depth) {
return vec3((fragCoord * projInfo.xy + projInfo.zw) * (zScale.x * depth + zScale.y), depth);
}`)}const s=e(),n=o();export{m as C};
