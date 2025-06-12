/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{S as o}from"./ShaderOutput.js";import{S as r}from"./Slice.glsl.js";import{T as e}from"./Transform.glsl.js";import{m as a,C as t}from"./ColorConversion.glsl.js";import{d as i}from"./AlphaCutoff.js";import{a as s}from"./View.glsl.js";import{F as p}from"./FloatPassUniform.js";import{g as d}from"./interfaces3.js";import{S as l}from"./ShaderBuilder.js";import{T as n}from"./Texture2DPassUniform.js";import{T as m}from"./TransparencyPassType.js";import{V as f}from"./VertexAttribute.js";const c=Object.freeze(Object.defineProperty({__proto__:null,build:function(c){const v=new l,{vertex:u,fragment:g}=v;return s(u,c),v.include(e,c),v.attributes.add(f.POSITION,"vec3"),v.attributes.add(f.UV0,"vec2"),c.perspectiveInterpolation&&v.attributes.add(f.PERSPECTIVEDIVIDE,"float"),v.varyings.add("vpos","vec3"),c.multipassEnabled&&v.varyings.add("depth","float"),u.code.add(d`
    void main(void) {
      vpos = position;
      ${c.multipassEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
      vTexCoord = uv0;
      gl_Position = transformPosition(proj, view, vpos);

      ${c.perspectiveInterpolation?"gl_Position *= perspectiveDivide;":""}
    }
  `),v.include(r,c),v.include(a,c),g.uniforms.add(new n("tex",(o=>o.texture)),new p("opacity",(o=>o.opacity))),v.varyings.add("vTexCoord","vec2"),c.output===o.Alpha?g.code.add(d`
    void main() {
      discardBySlice(vpos);
      ${c.multipassEnabled?"terrainDepthTest(depth);":""}

      float alpha = texture(tex, vTexCoord).a * opacity;
      if (alpha  < ${d.float(i)}) {
        discard;
      }

      fragColor = vec4(alpha);
    }
    `):(g.include(t),g.code.add(d`
    void main() {
      discardBySlice(vpos);
      ${c.multipassEnabled?"terrainDepthTest(depth);":""}
      fragColor = texture(tex, vTexCoord) * opacity;

      if (fragColor.a < ${d.float(i)}) {
        discard;
      }

      fragColor = highlightSlice(fragColor, vpos);
      ${c.transparencyPassType===m.Color?"fragColor = premultiplyAlpha(fragColor);":""}
    }
    `)),v}},Symbol.toStringTag,{value:"Module"}));export{c as I};
