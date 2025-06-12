/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{P as e,F as o}from"./ForwardLinearDepth.glsl.js";import{O as a,S as r,b as t,M as n,c as s}from"./MixExternalColor.glsl.js";import{S as i}from"./ShaderOutput.js";import{S as l}from"./Slice.glsl.js";import{T as c}from"./Transform.glsl.js";import{a as d}from"./InstancedDoublePrecision.glsl.js";import{N as m,b as u,c as v}from"./VertexNormal.glsl.js";import{d as x,V as p,T as f,h as g,R as T,g as h,j as y,b as C,P as b}from"./EvaluateAmbientLighting.glsl.js";import{V as w}from"./VertexColor.glsl.js";import{V as M}from"./VerticalOffset.glsl.js";import{N as V,a as N}from"./Normals.glsl.js";import{g as S}from"./interfaces3.js";import{T as O}from"./Texture2DDrawUniform.js";import{T as j}from"./Texture2DPassUniform.js";import{B as E,S as P}from"./ShaderBuilder.js";import{V as $}from"./VertexAttribute.js";import{E as U,a as A,b as F,c as L}from"./EvaluateSceneLighting.glsl.js";import{m as D}from"./ColorConversion.glsl.js";import{c as _}from"./mat3f32.js";import{M as B}from"./Matrix3PassUniform.js";import{V as R}from"./VisualVariables.glsl.js";import{s as z}from"./AlphaCutoff.js";import{a as I,c as W}from"./View.glsl.js";import{F as k}from"./Float3PassUniform.js";import{F as G}from"./Float4PassUniform.js";import{F as H}from"./FloatPassUniform.js";import{T as Q}from"./TransparencyPassType.js";function q(e,o){const a=e.fragment;o.hasVertexTangents?(e.attributes.add($.TANGENT,"vec4"),e.varyings.add("vTangent","vec4"),o.doubleSidedMode===V.WindingOrder?a.code.add(S`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):a.code.add(S`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):a.code.add(S`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`),o.textureCoordinateType!==x.None&&(e.include(p,o),a.uniforms.add(o.pbrTextureBindType===E.Pass?new j("normalTexture",(e=>e.textureNormal)):new O("normalTexture",(e=>e.textureNormal))),a.code.add(S`vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
vec3 rawNormal = textureLookup(normalTexture, uv).rgb * 2.0 - 1.0;
return tangentSpace * rawNormal;
}`))}function J(e){e.vertex.uniforms.add(new B("colorTextureTransformMatrix",(e=>null!=e.colorTextureTransformMatrix?e.colorTextureTransformMatrix:_()))),e.varyings.add("colorUV","vec2"),e.vertex.code.add(S`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}function K(e){e.vertex.uniforms.add(new B("normalTextureTransformMatrix",(e=>null!=e.normalTextureTransformMatrix?e.normalTextureTransformMatrix:_()))),e.varyings.add("normalUV","vec2"),e.vertex.code.add(S`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}function X(e){e.vertex.uniforms.add(new B("emissiveTextureTransformMatrix",(e=>null!=e.emissiveTextureTransformMatrix?e.emissiveTextureTransformMatrix:_()))),e.varyings.add("emissiveUV","vec2"),e.vertex.code.add(S`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}function Y(e){e.vertex.uniforms.add(new B("occlusionTextureTransformMatrix",(e=>null!=e.occlusionTextureTransformMatrix?e.occlusionTextureTransformMatrix:_()))),e.varyings.add("occlusionUV","vec2"),e.vertex.code.add(S`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}function Z(e){e.vertex.uniforms.add(new B("metallicRoughnessTextureTransformMatrix",(e=>null!=e.metallicRoughnessTextureTransformMatrix?e.metallicRoughnessTextureTransformMatrix:_()))),e.varyings.add("metallicRoughnessUV","vec2"),e.vertex.code.add(S`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)}const ee=Object.freeze(Object.defineProperty({__proto__:null,build:function(x){const p=new P,{vertex:V,fragment:O,varyings:E}=p;if(I(V,x),p.include(e),E.add("vpos","vec3"),p.include(R,x),p.include(d,x),p.include(M,x),x.hasColorTextureTransform&&p.include(J),x.output===i.Color||x.output===i.Alpha){x.hasNormalTextureTransform&&p.include(K),x.hasEmissionTextureTransform&&p.include(X),x.hasOcclusionTextureTransform&&p.include(Y),x.hasMetallicRoughnessTextureTransform&&p.include(Z),W(V,x),p.include(m,x),p.include(c,x);const e=x.normalType===u.Attribute||x.normalType===u.Compressed;e&&x.offsetBackfaces&&p.include(a),p.include(q,x),p.include(v,x),x.instancedColor&&p.attributes.add($.INSTANCECOLOR,"vec4"),E.add("vPositionLocal","vec3"),p.include(f,x),p.include(o,x),p.include(r,x),p.include(w,x),V.uniforms.add(new G("externalColor",(e=>e.externalColor))),E.add("vcolorExt","vec4"),x.multipassEnabled&&E.add("depth","float"),V.code.add(S`
      void main(void) {
        forwardNormalizedVertexColor();
        vcolorExt = externalColor;
        ${x.instancedColor?"vcolorExt *= instanceColor * 0.003921568627451;":""}
        vcolorExt *= vvColor();
        vcolorExt *= getSymbolColor();
        forwardColorMixMode();

        if (vcolorExt.a < ${S.float(z)}) {
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        } else {
          vpos = getVertexInLocalOriginSpace();
          vPositionLocal = vpos - view[3].xyz;
          vpos = subtractOrigin(vpos);
          ${e?S`vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`:""}
          vpos = addVerticalOffset(vpos, localOrigin);
          ${x.hasVertexTangents?"vTangent = dpTransformVertexTangent(tangent);":""}
          gl_Position = transformPosition(proj, view, vpos);
          ${e&&x.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);":""}
        }

        ${x.multipassEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
        forwardLinearDepth();
        forwardTextureCoordinates();
        ${x.hasColorTextureTransform?S`forwardColorUV();`:""}
        ${x.hasNormalTextureTransform?S`forwardNormalUV();`:""}
        ${x.hasEmissionTextureTransform?S`forwardEmissiveUV();`:""}
        ${x.hasOcclusionTextureTransform?S`forwardOcclusionUV();`:""}
        ${x.hasMetallicRoughnessTextureTransform?S`forwardMetallicRoughnessUV();`:""}
      }
    `)}switch(x.output){case i.Alpha:p.include(l,x),p.include(t,x),p.include(D,x),O.uniforms.add(new H("opacity",(e=>e.opacity)),new H("layerOpacity",(e=>e.layerOpacity))),x.hasColorTexture&&O.uniforms.add(new j("tex",(e=>e.texture))),O.include(n),O.code.add(S`
      void main() {
        discardBySlice(vpos);
        ${x.multipassEnabled?"terrainDepthTest(depth);":""}
        ${x.hasColorTexture?S`
                vec4 texColor = texture(tex, ${x.hasColorTextureTransform?S`colorUV`:S`vuv0`});
                ${x.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:S`vec4 texColor = vec4(1.0);`}
        ${x.hasVertexColors?S`float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:S`float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        fragColor = vec4(opacity_);
      }
    `);break;case i.Color:p.include(l,x),p.include(U,x),p.include(A,x),p.include(t,x),p.include(x.instancedDoublePrecision?g:T,x),p.include(D,x),W(O,x),O.uniforms.add(V.uniforms.get("localOrigin"),new k("ambient",(e=>e.ambient)),new k("diffuse",(e=>e.diffuse)),new H("opacity",(e=>e.opacity)),new H("layerOpacity",(e=>e.layerOpacity))),x.hasColorTexture&&O.uniforms.add(new j("tex",(e=>e.texture))),p.include(h,x),p.include(y,x),O.include(n),p.include(N,x),F(O),L(O),C(O),O.code.add(S`
      void main() {
        discardBySlice(vpos);
        ${x.multipassEnabled?"terrainDepthTest(depth);":""}
        ${x.hasColorTexture?S`
                vec4 texColor = texture(tex, ${x.hasColorTextureTransform?S`colorUV`:S`vuv0`});
                ${x.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:S`vec4 texColor = vec4(1.0);`}
        shadingParams.viewDirection = normalize(vpos - cameraPosition);
        ${x.normalType===u.ScreenDerivative?S`
                vec3 normal = screenDerivativeNormal(vPositionLocal);`:S`
                shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
        ${x.pbrMode===b.Normal?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        vec3 posWorld = vpos + localOrigin;

        float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
        float shadow = ${x.receiveShadows?"readShadowMap(vpos, linearDepth)":x.spherical?"lightingGlobalFactor * (1.0 - additionalAmbientScale)":"0.0"};

        vec3 matColor = max(ambient, diffuse);
        ${x.hasVertexColors?S`
                vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:S`
                vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        ${x.hasNormalTexture?S`
                mat3 tangentSpace = ${x.hasVertexTangents?"computeTangentSpace(normal);":"computeTangentSpace(normal, vpos, vuv0);"}
                vec3 shadingNormal = computeTextureNormal(tangentSpace, ${x.hasNormalTextureTransform?S`normalUV`:"vuv0"});`:S`vec3 shadingNormal = normal;`}
        vec3 normalGround = ${x.spherical?S`normalize(posWorld);`:S`vec3(0.0, 0.0, 1.0);`}

        ${x.snowCover?S`
                float snow = smoothstep(0.5, 0.55, dot(normal, normalGround));
                albedo = mix(albedo, vec3(1), snow);
                shadingNormal = mix(shadingNormal, normal, snow);
                ssao = mix(ssao, 1.0, snow);`:""}

        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

        ${x.pbrMode===b.Normal||x.pbrMode===b.Schematic?S`
                float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                ${x.snowCover?S`
                        mrr = mix(mrr, vec3(0.0, 1.0, 0.04), snow);
                        emission = mix(emission, vec3(0.0), snow);`:""}

                vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:S`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
        fragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${x.transparencyPassType===Q.Color?S`fragColor = premultiplyAlpha(fragColor);`:""}
      }
    `)}return p.include(s,x),p}},Symbol.toStringTag,{value:"Module"}));export{q as C,ee as D};
