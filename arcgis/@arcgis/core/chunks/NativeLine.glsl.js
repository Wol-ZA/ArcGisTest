/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{S as o}from"./ShaderOutput.js";import{S as r}from"./Slice.glsl.js";import{T as t}from"./Transform.glsl.js";import{V as i}from"./VertexColor.glsl.js";import{O as s}from"./OutputHighlight.glsl.js";import{s as a}from"./AlphaCutoff.js";import{a as e}from"./View.glsl.js";import{F as l}from"./Float4PassUniform.js";import{F as m}from"./FloatPassUniform.js";import{g as d}from"./interfaces3.js";import{S as n}from"./ShaderBuilder.js";import{V as p}from"./VertexAttribute.js";const u=Object.freeze(Object.defineProperty({__proto__:null,build:function(u){const c=new n,{vertex:f,fragment:g}=c;return c.include(t,u),c.include(i,u),e(f,u),c.attributes.add(p.POSITION,"vec3"),c.varyings.add("vpos","vec3"),f.code.add(d`void main(void) {
vpos = position;
forwardNormalizedVertexColor();
gl_Position = transformPosition(proj, view, vpos);
}`),u.output===o.Highlight&&c.include(s,u),c.include(r,u),g.uniforms.add(new m("alphaCoverage",((o,r)=>Math.min(1,o.width*r.camera.pixelRatio)))),u.hasVertexColors||g.uniforms.add(new l("constantColor",(o=>o.color))),g.code.add(d`
  void main() {
    discardBySlice(vpos);

    vec4 color = ${u.hasVertexColors?"vColor":"constantColor"};

    ${u.output===o.ObjectAndLayerIdColor?d`color.a = 1.0;`:""}

    if (color.a < ${d.float(a)}) {
      discard;
    }

    ${u.output===o.Color?d`fragColor = highlightSlice(color, vpos);`:""}
    ${u.output===o.Highlight?d`outputHighlight();`:""}
  }
  `),c}},Symbol.toStringTag,{value:"Module"}));export{u as N};
