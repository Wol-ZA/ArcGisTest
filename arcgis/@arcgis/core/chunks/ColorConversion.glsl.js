/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{a as e}from"./ReadLinearDepth.glsl.js";import{F as r}from"./Float2PassUniform.js";import{g as a}from"./interfaces3.js";import{T as t}from"./Texture2DPassUniform.js";function c(c,n){if(!n.multipassEnabled)return;c.fragment.include(e),c.fragment.uniforms.add(new t("terrainDepthTexture",((e,r)=>r.multipassTerrain.linearDepth?.colorTexture))),c.fragment.uniforms.add(new r("nearFar",((e,r)=>r.camera.nearFar)));const o=n.occlusionPass;c.fragment.code.add(a`
   ${o?"bool":"void"} terrainDepthTest(float fragmentDepth) {
      vec4 data = texelFetch(terrainDepthTexture, ivec2(gl_FragCoord.xy), 0);
      float linearDepth = linearDepthFromRGBA(data, nearFar);
      ${o?a`return fragmentDepth < linearDepth && data != vec4(0.0, 0.0, 0.0, 1.0);`:a`
          if(fragmentDepth ${n.cullAboveGround?">":"<="} linearDepth){
            discard;
          }`}
    }`)}class n{constructor(){this.cullAboveGround=!1}}function o(e){e.code.add(a`vec4 premultiplyAlpha(vec4 v) {
return vec4(v.rgb * v.a, v.a);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), min(d / (q.x + e), 1.0), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float rgb2v(vec3 c) {
return max(c.x, max(c.y, c.z));
}`)}export{o as C,n as M,c as m};
