/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{p as e}from"./mat4.js";import{a as s}from"./mat4f64.js";import{t as i,d as a,b as l,s as c}from"./vec3.js";import{Z as o,c as r}from"./vec3f64.js";import{F as t}from"./View.glsl.js";import{F as n}from"./Float3PassUniform.js";import{N as f,g as d}from"./interfaces3.js";class _ extends f{constructor(e){super(),this.slicePlaneLocalOrigin=e}}function P(e,s){u(e,s,new n("slicePlaneOrigin",((e,i)=>h(s,e,i))),new n("slicePlaneBasis1",((e,i)=>I(s,e,i,i.slicePlane?.basis1))),new n("slicePlaneBasis2",((e,i)=>I(s,e,i,i.slicePlane?.basis2))))}function p(e,s){u(e,s,new t("slicePlaneOrigin",((e,i)=>h(s,e,i))),new t("slicePlaneBasis1",((e,i)=>I(s,e,i,i.slicePlane?.basis1))),new t("slicePlaneBasis2",((e,i)=>I(s,e,i,i.slicePlane?.basis2))))}function u(e,s,...i){if(!s.hasSlicePlane){const i=d`#define rejectBySlice(_pos_) false
#define discardBySlice(_pos_) {}
#define highlightSlice(_color_, _pos_) (_color_)`;return s.hasSliceInVertexProgram&&e.vertex.code.add(i),void e.fragment.code.add(i)}s.hasSliceInVertexProgram&&e.vertex.uniforms.add(...i),e.fragment.uniforms.add(...i);const a=d`struct SliceFactors {
float front;
float side0;
float side1;
float side2;
float side3;
};
SliceFactors calculateSliceFactors(vec3 pos) {
vec3 rel = pos - slicePlaneOrigin;
vec3 slicePlaneNormal = -cross(slicePlaneBasis1, slicePlaneBasis2);
float slicePlaneW = -dot(slicePlaneNormal, slicePlaneOrigin);
float basis1Len2 = dot(slicePlaneBasis1, slicePlaneBasis1);
float basis2Len2 = dot(slicePlaneBasis2, slicePlaneBasis2);
float basis1Dot = dot(slicePlaneBasis1, rel);
float basis2Dot = dot(slicePlaneBasis2, rel);
return SliceFactors(
dot(slicePlaneNormal, pos) + slicePlaneW,
-basis1Dot - basis1Len2,
basis1Dot - basis1Len2,
-basis2Dot - basis2Len2,
basis2Dot - basis2Len2
);
}
bool sliceByFactors(SliceFactors factors) {
return factors.front < 0.0
&& factors.side0 < 0.0
&& factors.side1 < 0.0
&& factors.side2 < 0.0
&& factors.side3 < 0.0;
}
bool sliceEnabled() {
return dot(slicePlaneBasis1, slicePlaneBasis1) != 0.0;
}
bool sliceByPlane(vec3 pos) {
return sliceEnabled() && sliceByFactors(calculateSliceFactors(pos));
}
#define rejectBySlice(_pos_) sliceByPlane(_pos_)
#define discardBySlice(_pos_) { if (sliceByPlane(_pos_)) discard; }`,l=d`vec4 applySliceHighlight(vec4 color, vec3 pos) {
SliceFactors factors = calculateSliceFactors(pos);
const float HIGHLIGHT_WIDTH = 1.0;
const vec4 HIGHLIGHT_COLOR = vec4(0.0, 0.0, 0.0, 0.3);
factors.front /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.front);
factors.side0 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side0);
factors.side1 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side1);
factors.side2 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side2);
factors.side3 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side3);
if (sliceByFactors(factors)) {
return color;
}
float highlightFactor = (1.0 - step(0.5, factors.front))
* (1.0 - step(0.5, factors.side0))
* (1.0 - step(0.5, factors.side1))
* (1.0 - step(0.5, factors.side2))
* (1.0 - step(0.5, factors.side3));
return mix(color, vec4(HIGHLIGHT_COLOR.rgb, color.a), highlightFactor * HIGHLIGHT_COLOR.a);
}`,c=s.hasSliceHighlight?d`
        ${l}
        #define highlightSlice(_color_, _pos_) (sliceEnabled() ? applySliceHighlight(_color_, _pos_) : (_color_))
      `:d`#define highlightSlice(_color_, _pos_) (_color_)`;s.hasSliceInVertexProgram&&e.vertex.code.add(a),e.fragment.code.add(a),e.fragment.code.add(c)}function H(e,s,i){return e.instancedDoublePrecision?c(b,i.camera.viewInverseTransposeMatrix[3],i.camera.viewInverseTransposeMatrix[7],i.camera.viewInverseTransposeMatrix[11]):s.slicePlaneLocalOrigin}function m(e,s){return null!=e?l(v,s.origin,e):s.origin}function g(s,i,a){return s.hasSliceTranslatedView?null!=i?e(S,a.camera.viewMatrix,i):a.camera.viewMatrix:null}function h(e,s,a){if(null==a.slicePlane)return o;const l=H(e,s,a),c=m(l,a.slicePlane),r=g(e,l,a);return null!=r?i(v,c,r):c}function I(e,s,c,r){if(null==r||null==c.slicePlane)return o;const t=H(e,s,c),n=m(t,c.slicePlane),f=g(e,t,c);return null!=f?(a(B,r,n),i(v,n,f),i(B,B,f),l(B,B,v)):r}const b=r(),v=r(),B=r(),S=s();export{p as S,P as a,_ as b};
