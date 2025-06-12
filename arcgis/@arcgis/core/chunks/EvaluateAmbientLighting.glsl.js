/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{F as e}from"./Float3PassUniform.js";import{g as t,N as a}from"./interfaces3.js";import{P as o}from"./PiUtils.glsl.js";import{I as i}from"./mat4f64.js";import{c as n}from"./vec3f64.js";import{R as s}from"./RgbaFloat16Encoding.glsl.js";import{F as r}from"./Float4PassUniform.js";import{I as c}from"./IntegerPassUniform.js";import{B as l,U as d}from"./ShaderBuilder.js";import{T as u}from"./Texture2DPassUniform.js";import{s as g}from"./vec3.js";import{s as m}from"./vec4.js";import{a as h}from"./vec4f64.js";import{n as v}from"./compilerUtils.js";import{V as f}from"./VertexAttribute.js";import{F as p}from"./View.glsl.js";import{T as x}from"./Texture2DDrawUniform.js";import"../core/Error.js";import"./Logger.js";import"./basicInterfaces.js";function b(t){t.uniforms.add(new e("mainLightDirection",((e,t)=>t.lighting.mainLight.direction)))}function S(t){t.uniforms.add(new e("mainLightIntensity",((e,t)=>t.lighting.mainLight.intensity)))}function w(e){b(e.fragment),S(e.fragment),e.fragment.code.add(t`vec3 evaluateMainLighting(vec3 normal_global, float shadowing) {
float dotVal = clamp(dot(normal_global, mainLightDirection), 0.0, 1.0);
return mainLightIntensity * ((1.0 - shadowing) * dotVal);
}`)}var T,y;function M(e,a){switch(a.textureCoordinateType){case T.Default:return e.attributes.add(f.UV0,"vec2"),e.varyings.add("vuv0","vec2"),void e.vertex.code.add(t`void forwardTextureCoordinates() {
vuv0 = uv0;
}`);case T.Compressed:return e.attributes.add(f.UV0,"vec2"),e.varyings.add("vuv0","vec2"),void e.vertex.code.add(t`vec2 getUV0() {
return uv0 / 16384.0;
}
void forwardTextureCoordinates() {
vuv0 = getUV0();
}`);case T.Atlas:return e.attributes.add(f.UV0,"vec2"),e.varyings.add("vuv0","vec2"),e.attributes.add(f.UVREGION,"vec4"),e.varyings.add("vuvRegion","vec4"),void e.vertex.code.add(t`void forwardTextureCoordinates() {
vuv0 = uv0;
vuvRegion = uvRegion;
}`);default:v(a.textureCoordinateType);case T.None:return void e.vertex.code.add(t`void forwardTextureCoordinates() {}`);case T.COUNT:return}}function R(e){e.fragment.code.add(t`vec4 textureAtlasLookup(sampler2D tex, vec2 textureCoordinates, vec4 atlasRegion) {
vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;
float maxdUV = 0.125;
vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
return textureGrad(tex, uvAtlas, dUVdx, dUVdy);
}`)}function H(e,a){switch(e.include(M,a),a.textureCoordinateType){case T.Default:case T.Compressed:return void e.fragment.code.add(t`vec4 textureLookup(sampler2D tex, vec2 uv) {
return texture(tex, uv);
}`);case T.Atlas:return e.include(R),void e.fragment.code.add(t`vec4 textureLookup(sampler2D tex, vec2 uv) {
return textureAtlasLookup(tex, uv, vuvRegion);
}`);default:v(a.textureCoordinateType);case T.None:case T.COUNT:return}}function N(a,o){const i=a.fragment,n=o.hasMetallicRoughnessTexture||o.hasEmissionTexture||o.hasOcclusionTexture;if(o.pbrMode===y.Normal&&n&&a.include(H,o),o.pbrMode!==y.Schematic)if(o.pbrMode!==y.Disabled){if(o.pbrMode===y.Normal){i.code.add(t`vec3 mrr;
vec3 emission;
float occlusion;`);const a=o.pbrTextureBindType;o.hasMetallicRoughnessTexture&&(i.uniforms.add(a===l.Pass?new u("texMetallicRoughness",(e=>e.textureMetallicRoughness)):new x("texMetallicRoughness",(e=>e.textureMetallicRoughness))),i.code.add(t`void applyMetallnessAndRoughness(vec2 uv) {
vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
mrr[0] *= metallicRoughness.b;
mrr[1] *= metallicRoughness.g;
}`)),o.hasEmissionTexture&&(i.uniforms.add(a===l.Pass?new u("texEmission",(e=>e.textureEmissive)):new x("texEmission",(e=>e.textureEmissive))),i.code.add(t`void applyEmission(vec2 uv) {
emission *= textureLookup(texEmission, uv).rgb;
}`)),o.hasOcclusionTexture?(i.uniforms.add(a===l.Pass?new u("texOcclusion",(e=>e.textureOcclusion)):new x("texOcclusion",(e=>e.textureOcclusion))),i.code.add(t`void applyOcclusion(vec2 uv) {
occlusion *= textureLookup(texOcclusion, uv).r;
}
float getBakedOcclusion() {
return occlusion;
}`)):i.code.add(t`float getBakedOcclusion() { return 1.0; }`),a===l.Pass?i.uniforms.add(new e("emissionFactor",(e=>e.emissiveFactor)),new e("mrrFactors",(e=>e.mrrFactors))):i.uniforms.add(new p("emissionFactor",(e=>e.emissiveFactor)),new p("mrrFactors",(e=>e.mrrFactors))),i.code.add(t`
    void applyPBRFactors() {
      mrr = mrrFactors;
      emission = emissionFactor;
      occlusion = 1.0;

      ${o.hasMetallicRoughnessTexture?t`applyMetallnessAndRoughness(${o.hasMetallicRoughnessTextureTransform?t`metallicRoughnessUV`:"vuv0"});`:""}

      ${o.hasEmissionTexture?t`applyEmission(${o.hasEmissiveTextureTransform?t`emissiveUV`:"vuv0"});`:""}

      ${o.hasOcclusionTexture?t`applyOcclusion(${o.hasOcclusionTextureTransform?t`occlusionUV`:"vuv0"});`:""}
    }
  `)}}else i.code.add(t`float getBakedOcclusion() { return 1.0; }`);else i.code.add(t`vec3 mrr = vec3(0.0, 0.6, 0.2);
vec3 emission = vec3(0.0);
float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`)}function C(e){const a=e.fragment.code;a.add(t`vec3 evaluateDiffuseIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float NdotNG)
{
return ((1.0 - NdotNG) * ambientGround + (1.0 + NdotNG) * ambientSky) * 0.5;
}`),a.add(t`float integratedRadiance(float cosTheta2, float roughness)
{
return (cosTheta2 - 1.0) / (cosTheta2 * (1.0 - roughness * roughness) - 1.0);
}`),a.add(t`vec3 evaluateSpecularIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float RdotNG, float roughness)
{
float cosTheta2 = 1.0 - RdotNG * RdotNG;
float intRadTheta = integratedRadiance(cosTheta2, roughness);
float ground = RdotNG < 0.0 ? 1.0 - intRadTheta : 1.0 + intRadTheta;
float sky = 2.0 - ground;
return (ground * ambientGround + sky * ambientSky) * 0.5;
}`)}function A(e,a){const i=e.fragment.code;e.include(o),a.pbrMode!==y.Normal&&a.pbrMode!==y.Schematic&&a.pbrMode!==y.Terrain&&a.pbrMode!==y.TerrainWithWater||(i.add(t`float normalDistribution(float NdotH, float roughness)
{
float a = NdotH * roughness;
float b = roughness / (1.0 - NdotH * NdotH + a * a);
return b * b * INV_PI;
}`),i.add(t`const vec4 c0 = vec4(-1.0, -0.0275, -0.572,  0.022);
const vec4 c1 = vec4( 1.0,  0.0425,  1.040, -0.040);
const vec2 c2 = vec2(-1.04, 1.04);
vec2 prefilteredDFGAnalytical(float roughness, float NdotV) {
vec4 r = roughness * c0 + c1;
float a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
return c2 * a004 + r.zw;
}`)),a.pbrMode!==y.Normal&&a.pbrMode!==y.Schematic||(e.include(C),i.add(t`struct PBRShadingInfo
{
float NdotL;
float NdotV;
float NdotH;
float VdotH;
float LdotH;
float NdotNG;
float RdotNG;
float NdotAmbDir;
float NdotH_Horizon;
vec3 skyRadianceToSurface;
vec3 groundRadianceToSurface;
vec3 skyIrradianceToSurface;
vec3 groundIrradianceToSurface;
float averageAmbientRadiance;
float ssao;
vec3 albedoLinear;
vec3 f0;
vec3 f90;
vec3 diffuseColor;
float metalness;
float roughness;
};`),i.add(t`vec3 evaluateEnvironmentIllumination(PBRShadingInfo inputs) {
vec3 indirectDiffuse = evaluateDiffuseIlluminationHemisphere(inputs.groundIrradianceToSurface, inputs.skyIrradianceToSurface, inputs.NdotNG);
vec3 indirectSpecular = evaluateSpecularIlluminationHemisphere(inputs.groundRadianceToSurface, inputs.skyRadianceToSurface, inputs.RdotNG, inputs.roughness);
vec3 diffuseComponent = inputs.diffuseColor * indirectDiffuse * INV_PI;
vec2 dfg = prefilteredDFGAnalytical(inputs.roughness, inputs.NdotV);
vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
vec3 specularComponent = specularColor * indirectSpecular;
return (diffuseComponent + specularComponent);
}`),i.add(t`float gamutMapChanel(float x, vec2 p){
return (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
}`),i.add(t`vec3 blackLevelSoftCompression(vec3 inColor, PBRShadingInfo inputs){
vec3 outColor;
vec2 p = vec2(0.02 * (inputs.averageAmbientRadiance), 0.0075 * (inputs.averageAmbientRadiance));
outColor.x = gamutMapChanel(inColor.x, p) ;
outColor.y = gamutMapChanel(inColor.y, p) ;
outColor.z = gamutMapChanel(inColor.z, p) ;
return outColor;
}`))}function I(e,a){const i=e.fragment.code;e.include(o),i.add(t`
  struct PBRShadingWater
  {
      float NdotL;   // cos angle between normal and light direction
      float NdotV;   // cos angle between normal and view direction
      float NdotH;   // cos angle between normal and half vector
      float VdotH;   // cos angle between view direction and half vector
      float LdotH;   // cos angle between light direction and half vector
      float VdotN;   // cos angle between view direction and normal vector
  };

  float dtrExponent = ${a.useCustomDTRExponentForWater?"2.2":"2.0"};
  `),i.add(t`vec3 fresnelReflection(float angle, vec3 f0, float f90) {
return f0 + (f90 - f0) * pow(1.0 - angle, 5.0);
}`),i.add(t`float normalDistributionWater(float NdotH, float roughness)
{
float r2 = roughness * roughness;
float NdotH2 = NdotH * NdotH;
float denom = pow((NdotH2 * (r2 - 1.0) + 1.0), dtrExponent) * PI;
return r2 / denom;
}`),i.add(t`float geometricOcclusionKelemen(float LoH)
{
return 0.25 / (LoH * LoH);
}`),i.add(t`vec3 brdfSpecularWater(in PBRShadingWater props, float roughness, vec3 F0, float F0Max)
{
vec3  F = fresnelReflection(props.VdotH, F0, F0Max);
float dSun = normalDistributionWater(props.NdotH, roughness);
float V = geometricOcclusionKelemen(props.LdotH);
float diffusionSunHaze = mix(roughness + 0.045, roughness + 0.385, 1.0 - props.VdotH);
float strengthSunHaze  = 1.2;
float dSunHaze = normalDistributionWater(props.NdotH, diffusionSunHaze)*strengthSunHaze;
return ((dSun + dSunHaze) * V) * F;
}
vec3 tonemapACES(const vec3 x) {
return (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
}`)}!function(e){e[e.None=0]="None",e[e.Default=1]="Default",e[e.Atlas=2]="Atlas",e[e.Compressed=3]="Compressed",e[e.COUNT=4]="COUNT"}(T||(T={})),function(e){e[e.Disabled=0]="Disabled",e[e.Normal=1]="Normal",e[e.Schematic=2]="Schematic",e[e.Water=3]="Water",e[e.WaterOnIntegratedMesh=4]="WaterOnIntegratedMesh",e[e.Terrain=5]="Terrain",e[e.TerrainWithWater=6]="TerrainWithWater",e[e.COUNT=7]="COUNT"}(y||(y={}));class D extends d{constructor(e,t,a){super(e,"mat4",l.Draw,((a,o,i,n)=>a.setUniformMatrix4fv(e,t(o,i,n))),a)}}class V extends d{constructor(e,t,a){super(e,"mat4",l.Pass,((a,o,i)=>a.setUniformMatrix4fv(e,t(o,i))),a)}}class _ extends a{constructor(){super(...arguments),this.origin=n()}}class O extends _{}class L extends a{constructor(){super(...arguments),this.modelTransformation=i}}class U extends L{constructor(){super(...arguments),this.origin=n()}}function F(e,t){t.receiveShadows&&(e.fragment.uniforms.add(new V("shadowMapMatrix",((e,t)=>t.shadowMap.getShadowMapMatrices(e.origin)),4)),G(e))}function z(e,t){t.receiveShadows&&(e.fragment.uniforms.add(new D("shadowMapMatrix",((e,t)=>t.shadowMap.getShadowMapMatrices(e.origin)),4)),G(e))}function G(e){const a=e.fragment;a.include(s),a.uniforms.add(new u("shadowMapTex",((e,t)=>t.shadowMap.depthTexture)),new c("numCascades",((e,t)=>t.shadowMap.numCascades)),new r("cascadeDistances",((e,t)=>t.shadowMap.cascadeDistances))),a.code.add(t`int chooseCascade(float depth, out mat4 mat) {
vec4 distance = cascadeDistances;
int i = depth < distance[1] ? 0 : depth < distance[2] ? 1 : depth < distance[3] ? 2 : 3;
mat = i == 0 ? shadowMapMatrix[0] : i == 1 ? shadowMapMatrix[1] : i == 2 ? shadowMapMatrix[2] : shadowMapMatrix[3];
return i;
}
vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
vec4 lv = mat * vec4(_vpos, 1.0);
lv.xy /= lv.w;
return 0.5 * lv.xyz + vec3(0.5);
}
vec2 cascadeCoordinates(int i, ivec2 textureSize, vec3 lvpos) {
float xScale = float(textureSize.y) / float(textureSize.x);
return vec2((float(i) + lvpos.x) * xScale, lvpos.y);
}
float readShadowMapDepth(ivec2 uv, sampler2D _depthTex) {
return rgba4ToFloat(texelFetch(_depthTex, uv, 0));
}
float posIsInShadow(ivec2 uv, vec3 lvpos, sampler2D _depthTex) {
return readShadowMapDepth(uv, _depthTex) < lvpos.z ? 1.0 : 0.0;
}
float filterShadow(vec2 uv, vec3 lvpos, ivec2 texSize, sampler2D _depthTex) {
vec2 st = fract(uv * vec2(texSize) + vec2(0.5));
ivec2 base = ivec2(uv * vec2(texSize) - vec2(0.5));
float s00 = posIsInShadow(ivec2(base.x, base.y), lvpos, _depthTex);
float s10 = posIsInShadow(ivec2(base.x + 1, base.y), lvpos, _depthTex);
float s11 = posIsInShadow(ivec2(base.x + 1, base.y + 1), lvpos, _depthTex);
float s01 = posIsInShadow(ivec2(base.x, base.y + 1), lvpos, _depthTex);
return mix(mix(s00, s10, st.x), mix(s01, s11, st.x), st.y);
}
float readShadowMap(const in vec3 _vpos, float _linearDepth) {
mat4 mat;
int i = chooseCascade(_linearDepth, mat);
if (i >= numCascades) { return 0.0; }
vec3 lvpos = lightSpacePosition(_vpos, mat);
if (lvpos.z >= 1.0) { return 0.0; }
if (lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) { return 0.0; }
ivec2 size = textureSize(shadowMapTex, 0);
vec2 uv = cascadeCoordinates(i, size, lvpos);
return filterShadow(uv, lvpos, size, shadowMapTex);
}`)}function k(a,o){const i=a.fragment,n=void 0!==o.lightingSphericalHarmonicsOrder?o.lightingSphericalHarmonicsOrder:2;0===n?(i.uniforms.add(new e("lightingAmbientSH0",((e,t)=>g(P,t.lighting.sh.r[0],t.lighting.sh.g[0],t.lighting.sh.b[0])))),i.code.add(t`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
return ambientLight * (1.0 - ambientOcclusion);
}`)):1===n?(i.uniforms.add(new r("lightingAmbientSH_R",((e,t)=>m(j,t.lighting.sh.r[0],t.lighting.sh.r[1],t.lighting.sh.r[2],t.lighting.sh.r[3]))),new r("lightingAmbientSH_G",((e,t)=>m(j,t.lighting.sh.g[0],t.lighting.sh.g[1],t.lighting.sh.g[2],t.lighting.sh.g[3]))),new r("lightingAmbientSH_B",((e,t)=>m(j,t.lighting.sh.b[0],t.lighting.sh.b[1],t.lighting.sh.b[2],t.lighting.sh.b[3])))),i.code.add(t`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec4 sh0 = vec4(
0.282095,
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y
);
vec3 ambientLight = vec3(
dot(lightingAmbientSH_R, sh0),
dot(lightingAmbientSH_G, sh0),
dot(lightingAmbientSH_B, sh0)
);
return ambientLight * (1.0 - ambientOcclusion);
}`)):2===n&&(i.uniforms.add(new e("lightingAmbientSH0",((e,t)=>g(P,t.lighting.sh.r[0],t.lighting.sh.g[0],t.lighting.sh.b[0]))),new r("lightingAmbientSH_R1",((e,t)=>m(j,t.lighting.sh.r[1],t.lighting.sh.r[2],t.lighting.sh.r[3],t.lighting.sh.r[4]))),new r("lightingAmbientSH_G1",((e,t)=>m(j,t.lighting.sh.g[1],t.lighting.sh.g[2],t.lighting.sh.g[3],t.lighting.sh.g[4]))),new r("lightingAmbientSH_B1",((e,t)=>m(j,t.lighting.sh.b[1],t.lighting.sh.b[2],t.lighting.sh.b[3],t.lighting.sh.b[4]))),new r("lightingAmbientSH_R2",((e,t)=>m(j,t.lighting.sh.r[5],t.lighting.sh.r[6],t.lighting.sh.r[7],t.lighting.sh.r[8]))),new r("lightingAmbientSH_G2",((e,t)=>m(j,t.lighting.sh.g[5],t.lighting.sh.g[6],t.lighting.sh.g[7],t.lighting.sh.g[8]))),new r("lightingAmbientSH_B2",((e,t)=>m(j,t.lighting.sh.b[5],t.lighting.sh.b[6],t.lighting.sh.b[7],t.lighting.sh.b[8])))),i.code.add(t`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
vec4 sh1 = vec4(
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y,
1.092548 * normal.x * normal.y
);
vec4 sh2 = vec4(
1.092548 * normal.y * normal.z,
0.315392 * (3.0 * normal.z * normal.z - 1.0),
1.092548 * normal.x * normal.z,
0.546274 * (normal.x * normal.x - normal.y * normal.y)
);
ambientLight += vec3(
dot(lightingAmbientSH_R1, sh1),
dot(lightingAmbientSH_G1, sh1),
dot(lightingAmbientSH_B1, sh1)
);
ambientLight += vec3(
dot(lightingAmbientSH_R2, sh2),
dot(lightingAmbientSH_G2, sh2),
dot(lightingAmbientSH_B2, sh2)
);
return ambientLight * (1.0 - ambientOcclusion);
}`),o.pbrMode!==y.Normal&&o.pbrMode!==y.Schematic||i.code.add(t`const vec3 skyTransmittance = vec3(0.9, 0.9, 1.0);
vec3 calculateAmbientRadiance(float ambientOcclusion)
{
vec3 ambientLight = 1.2 * (0.282095 * lightingAmbientSH0) - 0.2;
return ambientLight *= (1.0 - ambientOcclusion) * skyTransmittance;
}`))}const P=n(),j=h();export{k as E,w as M,y as P,z as R,M as T,H as V,b as a,S as b,I as c,T as d,U as e,R as f,N as g,F as h,O as i,A as j};
