/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{_ as e}from"./tslib.es6.js";import{n as r}from"./mat3.js";import{a as o}from"./mat3f64.js";import{I as a}from"./mat4f64.js";import{s as n}from"./vec3.js";import{c as i}from"./vec3f64.js";import{S as t}from"./ShaderOutput.js";import{D as s}from"./ForwardLinearDepth.glsl.js";import{F as m,d as l}from"./View.glsl.js";import{g as c}from"./interfaces3.js";import{M as d}from"./Matrix3PassUniform.js";import{M as p}from"./Matrix4PassUniform.js";import{p as v,S as u}from"./ShaderTechniqueConfiguration.js";import{V as g}from"./VertexAttribute.js";import{a as f,b as M}from"./doublePrecisionUtils.js";class x extends u{constructor(){super(...arguments),this.instancedDoublePrecision=!1,this.hasModelTransformation=!1}}e([v()],x.prototype,"instancedDoublePrecision",void 0),e([v()],x.prototype,"hasModelTransformation",void 0);const O=o();function w(e,o){const i=o.hasModelTransformation,v=o.instancedDoublePrecision;i&&(e.vertex.uniforms.add(new p("model",(e=>e.modelTransformation??a))),e.vertex.uniforms.add(new d("normalLocalOriginFromModel",(e=>(r(O,e.modelTransformation??a),O))))),o.instanced&&v&&(e.attributes.add(g.INSTANCEMODELORIGINHI,"vec3"),e.attributes.add(g.INSTANCEMODELORIGINLO,"vec3"),e.attributes.add(g.INSTANCEMODEL,"mat3"),e.attributes.add(g.INSTANCEMODELNORMAL,"mat3"));const u=e.vertex;v&&(u.include(s,o),u.uniforms.add(new m("viewOriginHi",((e,r)=>f(n(N,r.camera.viewInverseTransposeMatrix[3],r.camera.viewInverseTransposeMatrix[7],r.camera.viewInverseTransposeMatrix[11]),N))),new m("viewOriginLo",((e,r)=>M(n(N,r.camera.viewInverseTransposeMatrix[3],r.camera.viewInverseTransposeMatrix[7],r.camera.viewInverseTransposeMatrix[11]),N))))),u.code.add(c`
    vec3 getVertexInLocalOriginSpace() {
      return ${i?v?"(model * vec4(instanceModel * localPosition().xyz, 1.0)).xyz":"(model * localPosition()).xyz":v?"instanceModel * localPosition().xyz":"localPosition().xyz"};
    }

    vec3 subtractOrigin(vec3 _pos) {
      ${v?c`
          // Negated inputs are intentionally the first two arguments. The other way around the obfuscation in dpAdd() stopped
          // working for macOS 14+ and iOS 17+.
          // Issue: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/56280
          vec3 originDelta = dpAdd(-instanceModelOriginHi, -instanceModelOriginLo, viewOriginHi, viewOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `),u.code.add(c`
    vec3 dpNormal(vec4 _normal) {
      return normalize(${i?v?"normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz)":"normalLocalOriginFromModel * _normal.xyz":v?"instanceModelNormal * _normal.xyz":"_normal.xyz"});
    }
    `),o.output===t.Normal&&(l(u),u.code.add(c`
    vec3 dpNormalView(vec4 _normal) {
      return normalize((viewNormal * ${i?v?"vec4(normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz), 1.0)":"vec4(normalLocalOriginFromModel * _normal.xyz, 1.0)":v?"vec4(instanceModelNormal * _normal.xyz, 1.0)":"_normal"}).xyz);
    }
    `)),o.hasVertexTangents&&u.code.add(c`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${i?v?"return vec4(normalLocalOriginFromModel * (instanceModelNormal * _tangent.xyz), _tangent.w);":"return vec4(normalLocalOriginFromModel * _tangent.xyz, _tangent.w);":v?"return vec4(instanceModelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}
    }`)}const N=i();export{x as I,w as a};
