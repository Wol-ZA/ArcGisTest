/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{S as r}from"./ShaderOutput.js";import{a as o}from"./mat3f64.js";import{a as e}from"./mat4f64.js";import{c as a}from"./vec3f64.js";import{g as t,N as i}from"./interfaces3.js";import{V as s}from"./VertexAttribute.js";import{F as d}from"./View.glsl.js";import{F as n}from"./Float3PassUniform.js";import{U as m,B as l}from"./ShaderBuilder.js";import{M as c}from"./Matrix3PassUniform.js";import{M as f}from"./Matrix4PassUniform.js";import{F as v}from"./Float2PassUniform.js";function F({code:r},o){o.doublePrecisionRequiresObfuscation?r.add(t`vec3 dpPlusFrc(vec3 a, vec3 b) {
return mix(a, a + b, vec3(notEqual(b, vec3(0))));
}
vec3 dpMinusFrc(vec3 a, vec3 b) {
return mix(vec3(0), a - b, vec3(notEqual(a, b)));
}
vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 t1 = dpPlusFrc(hiA, hiB);
vec3 e = dpMinusFrc(t1, hiA);
vec3 t2 = dpMinusFrc(hiB, e) + dpMinusFrc(hiA, dpMinusFrc(t1, e)) + loA + loB;
return t1 + t2;
}`):r.add(t`vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 t1 = hiA + hiB;
vec3 e = t1 - hiA;
vec3 t2 = ((hiB - e) + (hiA - (t1 - e))) + loA + loB;
return t1 + t2;
}`)}function u(r){r.attributes.add(s.POSITION,"vec3"),r.vertex.code.add(t`vec3 positionModel() { return position; }`)}class w extends m{constructor(r,o){super(r,"mat3",l.Draw,((e,a,t)=>e.setUniformMatrix3fv(r,o(a,t))))}}function p(r,o){r.include(u);const e=r.vertex;e.include(F,o),r.varyings.add("vPositionWorldCameraRelative","vec3"),r.varyings.add("vPosition_view","vec3"),e.uniforms.add(new n("transformWorldFromViewTH",(r=>r.transformWorldFromViewTH)),new n("transformWorldFromViewTL",(r=>r.transformWorldFromViewTL)),new c("transformViewFromCameraRelativeRS",(r=>r.transformViewFromCameraRelativeRS)),new f("transformProjFromView",(r=>r.transformProjFromView)),new w("transformWorldFromModelRS",(r=>r.transformWorldFromModelRS)),new d("transformWorldFromModelTH",(r=>r.transformWorldFromModelTH)),new d("transformWorldFromModelTL",(r=>r.transformWorldFromModelTL))),e.code.add(t`vec3 positionWorldCameraRelative() {
vec3 rotatedModelPosition = transformWorldFromModelRS * positionModel();
vec3 transform_CameraRelativeFromModel = dpAdd(
transformWorldFromModelTL,
transformWorldFromModelTH,
-transformWorldFromViewTL,
-transformWorldFromViewTH
);
return transform_CameraRelativeFromModel + rotatedModelPosition;
}`),e.code.add(t`
    void forwardPosition(float fOffset) {
      vPositionWorldCameraRelative = positionWorldCameraRelative();
      if (fOffset != 0.0) {
        vPositionWorldCameraRelative += fOffset * ${o.spherical?t`normalize(transformWorldFromViewTL + vPositionWorldCameraRelative)`:t`vec3(0.0, 0.0, 1.0)`};
      }

      vPosition_view = transformViewFromCameraRelativeRS * vPositionWorldCameraRelative;
      gl_Position = transformProjFromView * vec4(vPosition_view, 1.0);
    }
  `),r.fragment.uniforms.add(new n("transformWorldFromViewTL",(r=>r.transformWorldFromViewTL))),e.code.add(t`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`),r.fragment.code.add(t`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`)}class h extends i{constructor(){super(...arguments),this.transformWorldFromViewTH=a(),this.transformWorldFromViewTL=a(),this.transformViewFromCameraRelativeRS=o(),this.transformProjFromView=e()}}class W extends i{constructor(){super(...arguments),this.transformWorldFromModelRS=o(),this.transformWorldFromModelTH=a(),this.transformWorldFromModelTL=a()}}function M(r){r.varyings.add("linearDepth","float")}function P(r){r.vertex.uniforms.add(new v("nearFar",((r,o)=>o.camera.nearFar)))}function V(r){r.vertex.code.add(t`float calculateLinearDepth(vec2 nearFar,float z) {
return (-z - nearFar[0]) / (nearFar[1] - nearFar[0]);
}`)}function R(o,e){const{vertex:a}=o;switch(e.output){case r.Color:if(e.receiveShadows)return M(o),void a.code.add(t`void forwardLinearDepth() { linearDepth = gl_Position.w; }`);break;case r.Depth:case r.Shadow:case r.ShadowHighlight:case r.ShadowExcludeHighlight:return o.include(p,e),M(o),P(o),V(o),void a.code.add(t`void forwardLinearDepth() {
linearDepth = calculateLinearDepth(nearFar, vPosition_view.z);
}`)}a.code.add(t`void forwardLinearDepth() {}`)}export{F as D,R as F,w as M,u as P,W as V,M as a,V as b,P as c,h as d,p as e};
