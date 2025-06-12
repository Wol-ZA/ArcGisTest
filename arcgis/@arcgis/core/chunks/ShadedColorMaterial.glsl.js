/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{a as o}from"./vec4f64.js";import{c as e,a as r,d as i}from"./View.glsl.js";import{F as a}from"./FloatPassUniform.js";import{g as n}from"./interfaces3.js";import{S as t}from"./ShaderOutput.js";import{S as s}from"./Slice.glsl.js";import{T as l}from"./Transform.glsl.js";import{C as d,m as c}from"./ColorConversion.glsl.js";import{s as m}from"./AlphaCutoff.js";import{F as f}from"./Float3PassUniform.js";import{F as p}from"./Float4PassUniform.js";import{S as v}from"./ShaderBuilder.js";import{T as u}from"./TransparencyPassType.js";import{V as S}from"./VertexAttribute.js";function g(o,r){if(!r.screenSizeEnabled)return;const i=o.vertex;e(i,r),i.uniforms.add(new a("perScreenPixelRatio",((o,e)=>e.camera.perScreenPixelRatio)),new a("screenSizeScale",(o=>o.screenSizeScale))),i.code.add(n`float computeRenderPixelSizeAt( vec3 pWorld ){
vec3 viewForward = - vec3(view[0][2], view[1][2], view[2][2]);
float viewDirectionDistance = abs(dot(viewForward, pWorld - cameraPosition));
return viewDirectionDistance * perScreenPixelRatio;
}
vec3 screenSizeScaling(vec3 position, vec3 anchor){
return position * screenSizeScale * computeRenderPixelSizeAt(anchor) + anchor;
}`)}const h=o(),w=Object.freeze(Object.defineProperty({__proto__:null,build:function(o){const e=new v,a=o.multipassEnabled&&(o.output===t.Color||o.output===t.Alpha);e.include(l,o),e.include(g,o),e.include(s,o);const{vertex:w,fragment:C}=e;return C.include(d),r(w,o),C.uniforms.add(new p("uColor",(o=>o.color))),e.attributes.add(S.POSITION,"vec3"),e.varyings.add("vWorldPosition","vec3"),a&&e.varyings.add("depth","float"),o.screenSizeEnabled&&e.attributes.add(S.OFFSET,"vec3"),o.shadingEnabled&&(i(w),e.attributes.add(S.NORMAL,"vec3"),e.varyings.add("vViewNormal","vec3")),w.code.add(n`
    void main(void) {
      vWorldPosition = ${o.screenSizeEnabled?"screenSizeScaling(offset, position)":"position"};
  `),o.shadingEnabled&&w.code.add(n`vec3 worldNormal = normal;
vViewNormal = (viewNormal * vec4(worldNormal, 1)).xyz;`),w.code.add(n`
    ${a?"depth = (view * vec4(vWorldPosition, 1.0)).z;":""}
    gl_Position = transformPosition(proj, view, vWorldPosition);
  }
  `),a&&e.include(c,o),C.code.add(n`
    void main() {
      discardBySlice(vWorldPosition);
      ${a?"terrainDepthTest(depth);":""}
    `),o.shadingEnabled?(C.uniforms.add(new f("shadingDirection",(o=>o.shadingDirection))),C.uniforms.add(new p("shadedColor",(o=>function(o,e){const r=1-o[3],i=o[3]+e[3]*r;return 0===i?(h[3]=i,h):(h[0]=(o[0]*o[3]+e[0]*e[3]*r)/i,h[1]=(o[1]*o[3]+e[1]*e[3]*r)/i,h[2]=(o[2]*o[3]+e[2]*e[3]*r)/i,h[3]=e[3],h)}(o.shadingTint,o.color)))),C.code.add(n`vec3 viewNormalNorm = normalize(vViewNormal);
float shadingFactor = 1.0 - clamp(-dot(viewNormalNorm, shadingDirection), 0.0, 1.0);
vec4 finalColor = mix(uColor, shadedColor, shadingFactor);`)):C.code.add(n`vec4 finalColor = uColor;`),C.code.add(n`
      ${o.output===t.ObjectAndLayerIdColor?n`finalColor.a = 1.0;`:""}
      if (finalColor.a < ${n.float(m)}) {
        discard;
      }
      ${o.output===t.Alpha?n`fragColor = vec4(finalColor.a);`:""}

      ${o.output===t.Color?n`fragColor = highlightSlice(finalColor, vWorldPosition); ${o.transparencyPassType===u.Color?"fragColor = premultiplyAlpha(fragColor);":""}`:""}
    }
    `),e}},Symbol.toStringTag,{value:"Module"}));export{w as S};
