/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{p as e}from"./mat4.js";import{a as o}from"./mat4f64.js";import{f as i}from"./vec2.js";import{c as a}from"./vec2f64.js";import{L as t}from"./Laserline.glsl.js";import{F as r}from"./Float2PassUniform.js";import{F as s}from"./FloatPassUniform.js";import{g as n}from"./interfaces3.js";import{M as l}from"./Matrix4PassUniform.js";import{S as d}from"./ShaderBuilder.js";import{V as c}from"./VertexAttribute.js";const v=a(),p=o(),m=Object.freeze(Object.defineProperty({__proto__:null,build:function(o){const a=new d;a.include(t,o);const{vertex:m,fragment:x}=a;return m.uniforms.add(new l("modelView",((o,i)=>e(p,i.camera.viewMatrix,o.origin))),new l("proj",((e,o)=>o.camera.projectionMatrix)),new s("glowWidth",((e,o)=>e.glowWidth*o.camera.pixelRatio)),new r("pixelToNDC",((e,o)=>i(v,2/o.camera.fullViewport[2],2/o.camera.fullViewport[3])))),a.attributes.add(c.START,"vec3"),a.attributes.add(c.END,"vec3"),a.attributes.add(c.UP,"vec3"),a.attributes.add(c.EXTRUDE,"vec2"),a.varyings.add("uv","vec2"),a.varyings.add("vViewStart","vec3"),a.varyings.add("vViewEnd","vec3"),a.varyings.add("vViewPlane","vec4"),m.code.add(n`void main() {
vec3 pos = mix(start, end, extrude.x);
vec4 viewPos = modelView * vec4(pos, 1);
vec4 projPos = proj * viewPos;
vec2 ndcPos = projPos.xy / projPos.w;
vec3 viewUp = (modelView * vec4(extrude.y * up, 0)).xyz;
vec4 projPosUp = proj * vec4(viewPos.xyz + viewUp, 1);
vec2 projExtrudeDir = normalize(projPosUp.xy / projPosUp.w - ndcPos);
vec2 lxy = abs(sign(projExtrudeDir) - ndcPos);
ndcPos += length(lxy) * projExtrudeDir;
vec3 worldPlaneNormal = normalize(cross(up, normalize(end - start)));
vec3 viewPlaneNormal = (modelView * vec4(worldPlaneNormal, 0)).xyz;
vViewStart = (modelView * vec4(start, 1)).xyz;
vViewEnd = (modelView * vec4(end, 1)).xyz;
vViewPlane = vec4(viewPlaneNormal, -dot(viewPlaneNormal, vViewStart));
float xPaddingPixels = sign(dot(viewPlaneNormal, viewPos.xyz)) * (extrude.x * 2.0 - 1.0) * glowWidth;
ndcPos.x += xPaddingPixels * pixelToNDC.x;
uv = ndcPos * 0.5 + 0.5;
gl_Position = vec4(ndcPos, 0, 1);
}`),x.uniforms.add(new s("perScreenPixelRatio",((e,o)=>o.camera.perScreenPixelRatio))),x.code.add(n`float planeDistancePixels(vec4 plane, vec3 pos, vec3 start, vec3 end) {
vec3 origin = mix(start, end, 0.5);
vec3 basis = end - origin;
vec3 posAtOrigin = pos - origin;
float x = dot(normalize(basis), posAtOrigin);
float y = dot(plane.xyz, posAtOrigin);
float dx = max(abs(x) - length(basis), 0.0);
float dy = y;
float dist = length(vec2(dx, dy));
float width = fwidth(y);
float maxPixelDistance = length(pos) * perScreenPixelRatio * 2.0;
float pixelDist = dist / min(width, maxPixelDistance);
return abs(pixelDist);
}
void main() {
vec3 pos;
vec3 normal;
float depthDiscontinuityAlpha;
vec3 dEndStart = vViewEnd - vViewStart;
if (dot(dEndStart, dEndStart) < 1e-5) {
discard;
}
if (!laserlineReconstructFromDepth(pos, normal, depthDiscontinuityAlpha)) {
discard;
}
float distance = planeDistancePixels(vViewPlane, pos, vViewStart, vViewEnd);
vec4 color = laserlineProfile(distance);
float alpha = 1.0 - smoothstep(0.995, 0.999, abs(dot(normal, vViewPlane.xyz)));
fragColor = laserlineOutput(color * alpha * depthDiscontinuityAlpha);
}`),a}},Symbol.toStringTag,{value:"Module"}));export{m as L};
