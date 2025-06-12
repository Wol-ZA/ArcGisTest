/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{S as e}from"./ScreenSpacePass.glsl.js";import{D as t}from"./DiscardOrAdjustAlphaBlend.glsl.js";import{F as s}from"./FloatPassUniform.js";import{g as r}from"./interfaces3.js";import{S as o}from"./ShaderBuilder.js";import{T as i}from"./Texture2DPassUniform.js";const a=Object.freeze(Object.defineProperty({__proto__:null,build:function(a){const n=new o;n.include(e),n.include(t);const{usesHalfFloat:d}=a;return n.fragment.uniforms.add(new i("densityMap",(e=>e.densityMap)),new i("tex",(e=>e.colorRamp)),new s("densityNormalizer",(e=>1/(e.maxDensity-e.minDensity))),new s("minDensity",(e=>e.minDensity)),new s("densityMultiplier",(e=>3/(e.searchRadius*e.searchRadius*Math.PI)))),d&&n.constants.add("compressionFactor","float",4),n.fragment.code.add(r`
    void main() {
      float density = texture(densityMap, uv).r * densityMultiplier${d?r` * compressionFactor`:""};
      float densityRatio = (density - minDensity) * densityNormalizer;

      vec4 color = texture(tex, vec2(clamp(densityRatio, 0.0, 1.0), 0.5));

      discardOrAdjustAlpha(color);
      fragColor = color;
    }
  `),n}},Symbol.toStringTag,{value:"Module"}));export{a as H};
