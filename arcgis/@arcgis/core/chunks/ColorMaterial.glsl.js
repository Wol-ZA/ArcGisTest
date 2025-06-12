/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{c as o,a as r}from"./ForwardLinearDepth.glsl.js";import{S as t}from"./ShaderOutput.js";import{S as e}from"./Slice.glsl.js";import{T as l}from"./Transform.glsl.js";import{O as a}from"./ObjectAndLayerIdColor.glsl.js";import{V as s}from"./VertexColor.glsl.js";import{O as i}from"./OutputDepth.glsl.js";import{O as p}from"./OutputHighlight.glsl.js";import{m as d,C as u}from"./ColorConversion.glsl.js";import{V as n}from"./VisualVariables.glsl.js";import{s as m}from"./AlphaCutoff.js";import{a as f}from"./View.glsl.js";import{F as c}from"./Float4PassUniform.js";import{g as C}from"./interfaces3.js";import{S as v}from"./ShaderBuilder.js";import{T as h}from"./TransparencyPassType.js";import{V as g}from"./VertexAttribute.js";const j=Object.freeze(Object.defineProperty({__proto__:null,build:function(j){const O=new v,{vertex:b,fragment:y,attributes:A,varyings:T}=O;f(b,j),O.include(l,j),O.include(s,j),O.include(n,j),O.include(a,j),A.add(g.POSITION,"vec3"),j.vvColor&&A.add(g.COLORFEATUREATTRIBUTE,"float"),T.add("vColor","vec4"),T.add("vpos","vec3");const V=j.multipassEnabled&&(j.output===t.Color||j.output===t.Alpha);V&&T.add("depth","float"),b.uniforms.add(new c("eColor",(o=>o.color)));const $=j.output===t.Depth;$&&(O.include(i,j),o(O),r(O)),b.code.add(C`
    void main(void) {
      vpos = position;
      forwardNormalizedVertexColor();
      forwardObjectAndLayerIdColor();

      ${j.hasVertexColors?"vColor *= eColor;":j.vvColor?"vColor = eColor * interpolateVVColor(colorFeatureAttribute);":"vColor = eColor;"}
      ${V?"depth = (view * vec4(vpos, 1.0)).z;":""}
      gl_Position = ${$?C`transformPositionWithDepth(proj, view, vpos, nearFar, linearDepth);`:C`transformPosition(proj, view, vpos);`}
    }
  `),O.include(e,j),V&&O.include(d,j),y.include(u);const S=j.output===t.Highlight;return S&&O.include(p,j),y.code.add(C`
  void main() {
    discardBySlice(vpos);
    ${V?"terrainDepthTest(depth);":""}
    vec4 fColor = vColor;

    ${j.output===t.ObjectAndLayerIdColor?C`fColor.a = 1.0;`:""}

    if (fColor.a < ${C.float(m)}) {
      discard;
    }

    ${j.output===t.Alpha?C`fragColor = vec4(fColor.a);`:""}

    ${j.output===t.Color?C`fragColor = highlightSlice(fColor, vpos); ${j.transparencyPassType===h.Color?"fragColor = premultiplyAlpha(fragColor);":""}`:""}
    ${S?C`outputHighlight();`:""};
    ${j.output===t.Depth?C`outputDepth(linearDepth);`:""};
    ${j.output===t.ObjectAndLayerIdColor?C`outputObjectAndLayerIdColor();`:""}
  }
  `),O}},Symbol.toStringTag,{value:"Module"}));export{j as C};
