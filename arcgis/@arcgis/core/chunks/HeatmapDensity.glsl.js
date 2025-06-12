/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{a}from"./View.glsl.js";import{F as e}from"./FloatPassUniform.js";import{g as o}from"./interfaces3.js";import{S as t}from"./ShaderBuilder.js";import{V as i}from"./VertexAttribute.js";const r=Object.freeze(Object.defineProperty({__proto__:null,build:function(r){const s=new t,{vertex:d,fragment:u,attributes:n,varyings:l}=s;a(d,r);const{isAttributeDriven:c,usesHalfFloat:f}=r;return n.add(i.POSITION,"vec3"),n.add(i.UV0,"vec2"),c&&(n.add(i.FEATUREATTRIBUTE,"float"),l.add("attributeValue","float")),f&&s.constants.add("compressionFactor","float",.25),l.add("unitCirclePos","vec2"),d.uniforms.add(new e("radius",(({resolutionForScale:a,searchRadius:e},{camera:o,screenToWorldRatio:t,overlayStretch:i})=>2*e*(0===a?1:a/t)*o.pixelRatio/o.fullViewport[2]/i))),d.code.add(o`
    void main() {
      unitCirclePos = uv0;

      vec4 posProj = proj * (view * vec4(${i.POSITION}, 1.0));
      vec4 quadOffset = vec4(unitCirclePos * radius, 0.0, 0.0);

      ${c?o`attributeValue = ${i.FEATUREATTRIBUTE};`:""}
      gl_Position = posProj + quadOffset;
    }
  `),u.code.add(o`
    void main() {
      float radiusRatioSquared = dot(unitCirclePos, unitCirclePos);
      if (radiusRatioSquared > 1.0) {
        discard;
      }

      float oneMinusRadiusRatioSquared = 1.0 - radiusRatioSquared;
      float density = oneMinusRadiusRatioSquared * oneMinusRadiusRatioSquared ${c?o` * attributeValue`:""} ${f?o` * compressionFactor`:""};
      fragColor = vec4(density);
    }
  `),s}},Symbol.toStringTag,{value:"Module"}));export{r as H};
