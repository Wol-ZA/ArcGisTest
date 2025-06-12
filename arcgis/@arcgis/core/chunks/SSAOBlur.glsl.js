/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{h as e}from"./vec3.js";import{S as r}from"./ScreenSpacePass.glsl.js";import{a as t}from"./ReadLinearDepth.glsl.js";import{U as a,B as o,S as s}from"./ShaderBuilder.js";import{F as n}from"./Float2PassUniform.js";import{F as f}from"./FloatPassUniform.js";import{g as l}from"./interfaces3.js";import{T as i}from"./Texture2DDrawUniform.js";import{T as u}from"./Texture2DPassUniform.js";class d extends a{constructor(e,r){super(e,"vec2",o.Draw,((t,a,o,s)=>t.setUniform2fv(e,r(a,o,s))))}}const c=Object.freeze(Object.defineProperty({__proto__:null,build:function(){const a=new s,o=a.fragment;return a.include(r),o.include(t),o.uniforms.add(new u("depthMap",(e=>e.depthTexture)),new i("tex",(e=>e.colorTexture)),new d("blurSize",(e=>e.blurSize)),new f("projScale",((r,t)=>{const a=e(t.camera.eye,t.camera.center);return a>5e4?Math.max(0,r.projScale-(a-5e4)):r.projScale})),new n("nearFar",((e,r)=>r.camera.nearFar))),o.code.add(l`
    void blurFunction(vec2 uv, float r, float center_d, float sharpness, inout float wTotal, inout float bTotal) {
      float c = texture(tex, uv).r;
      float d = linearDepthFromTexture(depthMap, uv, nearFar);

      float ddiff = d - center_d;

      float w = exp(-r * r * ${l.float(.08)} - ddiff * ddiff * sharpness);
      wTotal += w;
      bTotal += w * c;
    }
  `),a.outputs.add("fragBlur","float"),o.code.add(l`
    void main(void) {
      float b = 0.0;
      float w_total = 0.0;

      float center_d = linearDepthFromTexture(depthMap, uv, nearFar);

      float sharpness = -0.05 * projScale / center_d;
      for (int r = -${l.int(4)}; r <= ${l.int(4)}; ++r) {
        float rf = float(r);
        vec2 uvOffset = uv + rf * blurSize;
        blurFunction(uvOffset, rf, center_d, sharpness, w_total, b);
      }

      fragBlur = b / w_total;
    }
  `),a}},Symbol.toStringTag,{value:"Module"}));export{d as F,c as S};
