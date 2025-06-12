/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{P as o,F as e,c as a}from"./ForwardLinearDepth.glsl.js";import{S as i}from"./ShaderOutput.js";import{S as r}from"./Slice.glsl.js";import{T as t}from"./Transform.glsl.js";import{f as l}from"./vec2f64.js";import{F as s}from"./Float2PassUniform.js";import{F as n}from"./Float3PassUniform.js";import{F as c,v,a as d,V as p}from"./FloatsPassUniform.js";import{g as m}from"./interfaces3.js";import{V as f}from"./VertexAttribute.js";import{O as u}from"./OutputDepth.glsl.js";import{O as g}from"./OutputHighlight.glsl.js";import{E as h,a as y,b as O,c as w}from"./EvaluateSceneLighting.glsl.js";import{R as z,b}from"./EvaluateAmbientLighting.glsl.js";import{m as S,C as x}from"./ColorConversion.glsl.js";import{a as C}from"./Normals.glsl.js";import{N as P}from"./NormalUtils.glsl.js";import{a as V,d as N,c as j}from"./View.glsl.js";import{F as A}from"./FloatPassUniform.js";import{S as F}from"./ShaderBuilder.js";import{T as R}from"./TransparencyPassType.js";function D(e,a){const i=f.FEATUREVALUE;e.attributes.add(i,"vec4");const r=e.vertex;r.code.add(m`
  bool isCapVertex() {
    return ${i}.w == 1.0;
  }
  `),r.uniforms.add(new s("size",(o=>o.size))),a.vvSize?(r.uniforms.add(new n("vvSizeMinSize",(o=>o.vvSize.minSize)),new n("vvSizeMaxSize",(o=>o.vvSize.maxSize)),new n("vvSizeOffset",(o=>o.vvSize.offset)),new n("vvSizeFactor",(o=>o.vvSize.factor))),r.code.add(m`
    vec2 getSize() {
      return size * clamp(vvSizeOffset + ${i}.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).xz;
    }
    `)):r.code.add(m`vec2 getSize(){
return size;
}`),a.vvOpacity?(r.constants.add("vvOpacityNumber","int",8),r.uniforms.add(new c("vvOpacityValues",(o=>o.vvOpacity.values),8),new c("vvOpacityOpacities",(o=>o.vvOpacity.opacityValues),8)),r.code.add(m`
    vec4 applyOpacity(vec4 color) {
      float value = ${i}.z;
      if (value <= vvOpacityValues[0]) {
        return vec4( color.xyz, vvOpacityOpacities[0]);
      }

      for (int i = 1; i < vvOpacityNumber; ++i) {
        if (vvOpacityValues[i] >= value) {
          float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
          return vec4( color.xyz, mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f));
        }
      }

      return vec4( color.xyz, vvOpacityOpacities[vvOpacityNumber - 1]);
    }
    `)):r.code.add(m`vec4 applyOpacity(vec4 color){
return color;
}`),a.vvColor?(r.constants.add("vvColorNumber","int",v),r.uniforms.add(new c("vvColorValues",(o=>o.vvColor.values),v),new d("vvColorColors",(o=>o.vvColor.colors),v)),r.code.add(m`
    vec4 getColor() {
      float value = ${i}.y;
      if (value <= vvColorValues[0]) {
        return applyOpacity(vvColorColors[0]);
      }

      for (int i = 1; i < vvColorNumber; ++i) {
        if (vvColorValues[i] >= value) {
          float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
          return applyOpacity(mix(vvColorColors[i-1], vvColorColors[i], f));
        }
      }

      return applyOpacity(vvColorColors[vvColorNumber - 1]);
    }
    `)):r.code.add(m`vec4 getColor(){
return applyOpacity(vec4(1, 1, 1, 1));
}`),e.include(o),e.attributes.add(f.PROFILERIGHT,"vec4"),e.attributes.add(f.PROFILEUP,"vec4"),e.attributes.add(f.PROFILEVERTEXANDNORMAL,"vec4"),r.code.add(m`vec3 calculateVPos() {
vec2 size = getSize();
vec3 origin = position;
vec3 right = profileRight.xyz;
vec3 up = profileUp.xyz;
vec3 forward = cross(up, right);
vec2 profileVertex = profileVertexAndNormal.xy * size;
vec2 profileNormal = profileVertexAndNormal.zw;
float positionOffsetAlongProfilePlaneNormal = 0.0;
float normalOffsetAlongProfilePlaneNormal = 0.0;`),r.code.add(m`if(!isCapVertex()) {
vec2 rotationRight = vec2(profileRight.w, profileUp.w);
float maxDistance = length(rotationRight);`),r.code.add(m`rotationRight = maxDistance > 0.0 ? normalize(rotationRight) : vec2(0, 0);
float rx = dot(profileVertex, rotationRight);
if (abs(rx) > maxDistance) {
vec2 rotationUp = vec2(-rotationRight.y, rotationRight.x);
float ry = dot(profileVertex, rotationUp);
profileVertex = rotationRight * maxDistance * sign(rx) + rotationUp * ry;
}
}else{
positionOffsetAlongProfilePlaneNormal = profileRight.w * size[0];
normalOffsetAlongProfilePlaneNormal = profileUp.w;
}
vec3 offset = right * profileVertex.x + up * profileVertex.y + forward * positionOffsetAlongProfilePlaneNormal;
return origin + offset;
}`),r.code.add(m`vec3 localNormal() {
vec3 right = profileRight.xyz;
vec3 up = profileUp.xyz;
vec3 forward = cross(up, right);
vec2 profileNormal = profileVertexAndNormal.zw;
vec3 normal = right * profileNormal.x + up * profileNormal.y;
if(isCapVertex()) {
normal += forward * profileUp.w;
}
return normal;
}`)}class E extends p{constructor(){super(...arguments),this.size=l(1,1)}}const U=Object.freeze(Object.defineProperty({__proto__:null,build:function(o){const l=new F,{vertex:s,fragment:c}=l;switch(V(s,o),l.varyings.add("vpos","vec3"),l.include(D,o),o.output!==i.Color&&o.output!==i.Alpha||(l.include(t,o),l.include(z,o),l.include(e,o),l.varyings.add("vnormal","vec3"),l.varyings.add("vcolor","vec4"),o.multipassEnabled&&l.varyings.add("depth","float"),s.code.add(m`
      void main() {
        vpos = calculateVPos();
        vnormal = normalize(localNormal());

        ${o.multipassEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
        gl_Position = transformPosition(proj, view, vpos);

        ${o.output===i.Color?"forwardLinearDepth();":""}

        vcolor = getColor();
      }
    `)),l.include(S,o),o.output){case i.Alpha:l.include(r,o),c.uniforms.add(new A("opacity",(o=>o.opacity))),c.code.add(m`
      void main() {
        discardBySlice(vpos);
        ${o.multipassEnabled?"terrainDepthTest(depth);":""}
        float combinedOpacity = vcolor.a * opacity;
        fragColor = vec4(combinedOpacity);
      }
    `);break;case i.Color:l.include(r,o),l.include(h,o),l.include(y,o),l.include(z,o),l.include(C,o),j(c,o),O(c),w(c),c.uniforms.add(s.uniforms.get("localOrigin"),new n("ambient",(o=>o.ambient)),new n("diffuse",(o=>o.diffuse)),new n("specular",(o=>o.specular)),new A("opacity",(o=>o.opacity))),c.include(x),b(c),c.code.add(m`
        void main() {
          discardBySlice(vpos);
          ${o.multipassEnabled?"terrainDepthTest(depth);":""}

          shadingParams.viewDirection = normalize(vpos - cameraPosition);
          shadingParams.normalView = vnormal;
          vec3 normal = shadingNormal(shadingParams);
          float ssao = evaluateAmbientOcclusionInverse();

          float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
          vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
          ${o.receiveShadows?"float shadow = readShadowMap(vpos, linearDepth);":o.spherical?"float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);":"float shadow = 0.0;"}
          vec3 albedo = vcolor.rgb * max(ambient, diffuse); // combine the old material parameters into a single one
          float combinedOpacity = vcolor.a * opacity;
          albedo += 0.25 * specular; // don't completely ignore specular for now

          vec3 shadedColor = evaluateSceneLighting(normal, albedo, shadow, 1.0 - ssao, additionalLight);
          fragColor = vec4(shadedColor, combinedOpacity);
          fragColor = highlightSlice(fragColor, vpos);
          ${o.transparencyPassType===R.Color?"fragColor = premultiplyAlpha(fragColor);":""}
        }
      `);break;case i.Depth:case i.Shadow:case i.ShadowHighlight:case i.ShadowExcludeHighlight:l.include(t,o),a(l),l.varyings.add("depth","float"),s.code.add(m`void main() {
vpos = calculateVPos();
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
}`),l.include(r,o),l.include(u,o),c.code.add(m`void main() {
discardBySlice(vpos);
outputDepth(depth);
}`);break;case i.Normal:l.include(t,o),l.include(P,o),N(s),l.varyings.add("vnormal","vec3"),s.code.add(m`void main(void) {
vpos = calculateVPos();
vnormal = normalize((viewNormal * vec4(localNormal(), 1.0)).xyz);
gl_Position = transformPosition(proj, view, vpos);
}`),l.include(r,o),c.code.add(m`void main() {
discardBySlice(vpos);
vec3 normal = normalize(vnormal);
if (gl_FrontFacing == false) normal = -normal;
fragColor = vec4(vec3(0.5) + 0.5 * normal, 1.0);
}`);break;case i.Highlight:l.include(t,o),l.include(P,o),l.varyings.add("vnormal","vec3"),s.code.add(m`void main(void) {
vpos = calculateVPos();
gl_Position = transformPosition(proj, view, vpos);
}`),l.include(r,o),l.include(g,o),c.code.add(m`void main() {
discardBySlice(vpos);
outputHighlight();
}`)}return l}},Symbol.toStringTag,{value:"Module"}));export{U as P,E as a};
