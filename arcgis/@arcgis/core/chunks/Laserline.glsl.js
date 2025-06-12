/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{a as o}from"./ReadLinearDepth.glsl.js";import{C as e}from"./CameraSpace.glsl.js";import{F as r}from"./Float2PassUniform.js";import{F as l}from"./Float3PassUniform.js";import{F as a}from"./FloatPassUniform.js";import{g as t}from"./interfaces3.js";import{T as n}from"./Texture2DPassUniform.js";function i(i,s){const d=i.fragment;d.include(o),i.include(e),d.uniforms.add(new a("globalAlpha",(o=>o.globalAlpha)),new l("glowColor",(o=>o.glowColor)),new a("glowWidth",((o,e)=>o.glowWidth*e.camera.pixelRatio)),new a("glowFalloff",(o=>o.glowFalloff)),new l("innerColor",(o=>o.innerColor)),new a("innerWidth",((o,e)=>o.innerWidth*e.camera.pixelRatio)),new n("depthMap",((o,e)=>e.linearDepth?.colorTexture)),new r("nearFar",((o,e)=>e.camera.nearFar)),new n("frameColor",((o,e)=>e.mainColor))),d.code.add(t`vec4 blendPremultiplied(vec4 source, vec4 dest) {
float oneMinusSourceAlpha = 1.0 - source.a;
return vec4(
source.rgb + dest.rgb * oneMinusSourceAlpha,
source.a + dest.a * oneMinusSourceAlpha
);
}`),d.code.add(t`vec4 premultipliedColor(vec3 rgb, float alpha) {
return vec4(rgb * alpha, alpha);
}`),d.code.add(t`vec4 laserlineProfile(float dist) {
if (dist > glowWidth) {
return vec4(0.0);
}
float innerAlpha = (1.0 - smoothstep(0.0, innerWidth, dist));
float glowAlpha = pow(max(0.0, 1.0 - dist / glowWidth), glowFalloff);
return blendPremultiplied(
premultipliedColor(innerColor, innerAlpha),
premultipliedColor(glowColor, glowAlpha)
);
}`),d.code.add(t`bool laserlineReconstructFromDepth(out vec3 pos, out vec3 normal, out float depthDiscontinuityAlpha) {
float depth = linearDepthFromTexture(depthMap, uv, nearFar);
if (-depth == nearFar[0]) {
return false;
}
pos = reconstructPosition(gl_FragCoord.xy, depth);
normal = normalize(cross(dFdx(pos), dFdy(pos)));
float ddepth = fwidth(depth);
depthDiscontinuityAlpha = 1.0 - smoothstep(0.0, 0.01, -ddepth / depth);
return true;
}`),s.contrastControlEnabled?(d.uniforms.add(new a("globalAlphaContrastBoost",(o=>null!=o.globalAlphaContrastBoost?o.globalAlphaContrastBoost:1))),d.code.add(t`float rgbToLuminance(vec3 color) {
return dot(vec3(0.2126, 0.7152, 0.0722), color);
}
vec4 laserlineOutput(vec4 color) {
float backgroundLuminance = rgbToLuminance(texture(frameColor, uv).rgb);
float alpha = clamp(globalAlpha * max(backgroundLuminance * globalAlphaContrastBoost, 1.0), 0.0, 1.0);
return color * alpha;
}`)):d.code.add(t`vec4 laserlineOutput(vec4 color) {
return color * globalAlpha;
}`)}export{i as L};
