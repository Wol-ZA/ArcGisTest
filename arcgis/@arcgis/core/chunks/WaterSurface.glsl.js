/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{F as e}from"./ForwardLinearDepth.glsl.js";import{S as o}from"./ShaderOutput.js";import{S as t}from"./Slice.glsl.js";import{T as a}from"./Transform.glsl.js";import{O as r}from"./ObjectAndLayerIdColor.glsl.js";import{O as i}from"./OutputHighlight.glsl.js";import{a as n,b as d,c as s,M as c,E as l,P as m,R as v}from"./EvaluateAmbientLighting.glsl.js";import{m as u,C as f}from"./ColorConversion.glsl.js";import{N as p}from"./NormalUtils.glsl.js";import{g as h}from"./interfaces3.js";import{a as C}from"./ReadLinearDepth.glsl.js";import{F as g}from"./Float2PassUniform.js";import{F as w}from"./FloatPassUniform.js";import{M as y}from"./Matrix4PassUniform.js";import{T as F}from"./Texture2DPassUniform.js";import{c as D}from"./mathUtils.js";import{e as P}from"./Ellipsoid.js";import{w as S}from"./mat4.js";import{I as x,a as _}from"./mat4f64.js";import{l as I,p as R,q as M,b as A,c as N}from"./vec3.js";import{c as E,f as T}from"./vec3f64.js";import{c as j,h as O,d as z}from"./axisAngleDegrees.js";import{w as b,c as L}from"./weather.js";import{R as G}from"./RenderState.js";import{B as H}from"./BooleanPassUniform.js";import{F as k}from"./Float3PassUniform.js";import{U,B as V,S as Z}from"./ShaderBuilder.js";import{f as B}from"./vec2.js";import{c as W}from"./vec2f64.js";import{s as $}from"./vec4.js";import{a as Q}from"./vec4f64.js";import{F as K}from"./Float4PassUniform.js";import{s as q}from"./AlphaCutoff.js";import{a as J,c as X}from"./View.glsl.js";import{T as Y}from"./TransparencyPassType.js";import{V as ee}from"./VertexAttribute.js";function oe(e){e.fragment.code.add(h`float normals2FoamIntensity(vec3 n, float waveStrength){
float normalizationFactor =  max(0.015, waveStrength);
return max((n.x + n.y)*0.3303545/normalizationFactor + 0.3303545, 0.0);
}`)}function te(e){e.fragment.code.add(h`vec3 foamIntensity2FoamColor(float foamIntensityExternal, float foamPixelIntensity, vec3 skyZenitColor, float dayMod){
return foamIntensityExternal * (0.075 * skyZenitColor * pow(foamPixelIntensity, 4.) +  50.* pow(foamPixelIntensity, 23.0)) * dayMod;
}`)}function ae(e){e.fragment.code.add(h`const float GAMMA = 2.2;
const float INV_GAMMA = 0.4545454545;
vec4 delinearizeGamma(vec4 color) {
return vec4(pow(color.rgb, vec3(INV_GAMMA)), color.w);
}
vec3 linearizeGamma(vec3 color) {
return pow(color, vec3(GAMMA));
}`)}function re(e,o){const t=e.fragment;t.include(C),t.uniforms.add(new g("nearFar",((e,o)=>o.camera.nearFar))),t.uniforms.add(new F("depthMap",((e,o)=>o.linearDepth?.colorTexture))),t.uniforms.add(new y("proj",((e,o)=>o.camera.projectionMatrix))),t.uniforms.add(new w("invResolutionHeight",((e,o)=>1/o.camera.height))),t.uniforms.add(new y("reprojectionMatrix",((e,o)=>o.ssr.reprojectionMatrix))),t.code.add(h`
  vec2 reprojectionCoordinate(vec3 projectionCoordinate)
  {
    vec4 zw = proj * vec4(0.0, 0.0, -projectionCoordinate.z, 1.0);
    vec4 reprojectedCoord = reprojectionMatrix * vec4(zw.w * (projectionCoordinate.xy * 2.0 - 1.0), zw.z, zw.w);
    reprojectedCoord.xy /= reprojectedCoord.w;
    return reprojectedCoord.xy * 0.5 + 0.5;
  }

  const int maxSteps = ${o.highStepCount?"150":"75"};

  vec4 applyProjectionMat(mat4 projectionMat, vec3 x)
  {
    vec4 projectedCoord =  projectionMat * vec4(x, 1.0);
    projectedCoord.xy /= projectedCoord.w;
    projectedCoord.xy = projectedCoord.xy*0.5 + 0.5;
    return projectedCoord;
  }

  vec3 screenSpaceIntersection(vec3 dir, vec3 startPosition, vec3 viewDir, vec3 normal)
  {
    vec3 viewPos = startPosition;
    vec3 viewPosEnd = startPosition;

    // Project the start position to the screen
    vec4 projectedCoordStart = applyProjectionMat(proj, viewPos);
    vec3  Q0 = viewPos / projectedCoordStart.w; // homogeneous camera space
    float k0 = 1.0/ projectedCoordStart.w;

    // advance the position in the direction of the reflection
    viewPos += dir;

    vec4 projectedCoordVanishingPoint = applyProjectionMat(proj, dir);

    // Project the advanced position to the screen
    vec4 projectedCoordEnd = applyProjectionMat(proj, viewPos);
    vec3  Q1 = viewPos / projectedCoordEnd.w; // homogeneous camera space
    float k1 = 1.0/ projectedCoordEnd.w;

    // calculate the reflection direction in the screen space
    vec2 projectedCoordDir = (projectedCoordEnd.xy - projectedCoordStart.xy);
    vec2 projectedCoordDistVanishingPoint = (projectedCoordVanishingPoint.xy - projectedCoordStart.xy);

    float yMod = min(abs(projectedCoordDistVanishingPoint.y), 1.0);

    float projectedCoordDirLength = length(projectedCoordDir);
    float maxSt = float(maxSteps);

    // normalize the projection direction depending on maximum steps
    // this determines how blocky the reflection looks
    vec2 dP = yMod * (projectedCoordDir)/(maxSt * projectedCoordDirLength);

    // Normalize the homogeneous camera space coordinates
    vec3  dQ = yMod * (Q1 - Q0)/(maxSt * projectedCoordDirLength);
    float dk = yMod * (k1 - k0)/(maxSt * projectedCoordDirLength);

    // initialize the variables for ray marching
    vec2 P = projectedCoordStart.xy;
    vec3 Q = Q0;
    float k = k0;
    float rayStartZ = -startPosition.z; // estimated ray start depth value
    float rayEndZ = -startPosition.z;   // estimated ray end depth value
    float prevEstimateZ = -startPosition.z;
    float rayDiffZ = 0.0;
    float dDepth;
    float depth;
    float rayDiffZOld = 0.0;

    // early outs
    if (dot(normal, dir) < 0.0 || dot(-viewDir, normal) < 0.0)
      return vec3(P, 0.0);

    for(int i = 0; i < maxSteps-1; i++)
    {
      depth = -linearDepthFromTexture(depthMap, P, nearFar); // get linear depth from the depth buffer

      // estimate depth of the marching ray
      rayStartZ = prevEstimateZ;
      dDepth = -rayStartZ - depth;
      rayEndZ = (dQ.z * 0.5 + Q.z)/ ((dk * 0.5 + k));
      rayDiffZ = rayEndZ- rayStartZ;
      prevEstimateZ = rayEndZ;

      if(-rayEndZ > nearFar[1] || -rayEndZ < nearFar[0] || P.y < 0.0  || P.y > 1.0 )
      {
        return vec3(P, 0.);
      }

      // If we detect a hit - return the intersection point, two conditions:
      //  - dDepth > 0.0 - sampled point depth is in front of estimated depth
      //  - if difference between dDepth and rayDiffZOld is not too large
      //  - if difference between dDepth and 0.025/abs(k) is not too large
      //  - if the sampled depth is not behind far plane or in front of near plane

      if((dDepth) < 0.025/abs(k) + abs(rayDiffZ) && dDepth > 0.0 && depth > nearFar[0] && depth < nearFar[1] && abs(P.y - projectedCoordStart.y) > invResolutionHeight)
      {
        return vec3(P, depth);
      }

      // continue with ray marching
      P = clamp(P + dP, vec2(0.0), vec2(0.999));
      Q.z += dQ.z;
      k += dk;
      rayDiffZOld = rayDiffZ;
    }
    return vec3(P, 0.0);
  }
  `)}var ie,ne,de;function se(e){return null!=e?.cubeMap}!function(e){e[e.RENDERING=0]="RENDERING",e[e.FADING=1]="FADING",e[e.FINISHED=2]="FINISHED"}(ie||(ie={})),function(e){e[e.RG=0]="RG",e[e.BA=1]="BA"}(ne||(ne={}));class ce{constructor(){this.readChannels=ne.RG,this.renderingStage=ie.FINISHED,this.startTime=0,this.startTimeHeightFade=0,this.cameraPositionLastFrame=E(),this.parallax=new le,this.parallaxNew=new le,this.pointOnGround=E(),this.fadeMode=de.HIDE,this.fadeFactor=0,this.opacity=0}updateParallax(e){const o=this.parallax,t=I(e.eye);if(o.radiusCurvatureCorrectionFactor=.84*Math.sqrt(Math.max(t*t-P.radius*P.radius,0))/t,O(me,o.anchorPointClouds,ve),S(o.transform,x,ve[3],z(ve)),this.fadeMode===de.CROSS_FADE){const e=this.parallaxNew;O(me,e.anchorPointClouds,ve),S(e.transform,x,ve[3],z(ve))}}updateFading(e,o,t,a){this.isFading&&this._advanceFading(t,a),this._evaluateFading(e,o,t)}_evaluateFading(e,o,t){const a=e.relativeElevation,r=this._calculateDistanceToAnchorPoint(e);var i;if((a>1.7*b||a<-b||r>Ce)&&this.opacity>0)this._setFade(de.HIDE,t);else if(!this.isFading)if((a>b||a<-.35*b||r>he)&&this.opacity>0)this._setFade(de.FADE_OUT,t);else if(a<=b&&a>=-.35*b&&o===G.IDLE&&null!=(i=this.data)&&!i.running){if(0===this.opacity)return void this._setFade(de.FADE_IN,t);(r>pe||this.renderingStage===ie.FADING)&&this._setFade(de.CROSS_FADE,t)}}_advanceFading(e,o){this._switchReadChannels(),this._updateAnchorPoint(),this._advanceFadingFactorAndOpacity(e,o)}_advanceFadingFactorAndOpacity(e,o){if(this.fadeFactor<1)return this.fadeFactor=o?D((e-this.startTime)/(fe*o),0,1):1,this.fadeMode===de.FADE_OUT&&(this.opacity=1-this.fadeFactor),this.fadeMode===de.FADE_IN&&(this.opacity=this.fadeFactor),void(this.fadeMode===de.CROSS_FADE&&(this.opacity=1));this.fadeFactor=0,this.fadeMode===de.FADE_OUT&&(this.opacity=0),this.fadeMode===de.FADE_IN&&(this.opacity=1),this.fadeMode===de.CROSS_FADE&&(this.opacity=1),this.fadeMode=de.NONE}_switchReadChannels(){const e=this.fadeMode===de.CROSS_FADE&&1===this.fadeFactor,o=this.fadeMode===de.FADE_IN&&0===this.fadeFactor;this.renderingStage===ie.FADING&&(e||o)&&(this.readChannels=1-this.readChannels,this.renderingStage=ie.FINISHED)}_calculateDistanceToAnchorPoint(e){return R(this.pointOnGround,e.eye),M(this.pointOnGround,this.pointOnGround,P.radius),I(A(ue,this.parallax.anchorPointClouds,this.pointOnGround))}_updateAnchorPoint(){this.fadeMode===de.CROSS_FADE&&(0===this.fadeFactor&&N(this.parallaxNew.anchorPointClouds,this.pointOnGround),1===this.fadeFactor&&N(this.parallax.anchorPointClouds,this.parallaxNew.anchorPointClouds)),this.fadeMode===de.FADE_IN&&0===this.fadeFactor&&N(this.parallax.anchorPointClouds,this.pointOnGround)}_setFade(e,o){switch(e){case de.HIDE:this.opacity=0;break;case de.FADE_OUT:this.opacity=1;break;case de.FADE_IN:this.opacity=0;break;case de.CROSS_FADE:this.opacity=1}this.fadeMode=e,this.fadeFactor=0,this.startTime=o}get isFading(){return this.fadeMode===de.FADE_OUT||this.fadeMode===de.FADE_IN||this.fadeMode===de.CROSS_FADE}}!function(e){e[e.NONE=0]="NONE",e[e.HIDE=1]="HIDE",e[e.FADE_OUT=2]="FADE_OUT",e[e.FADE_IN=3]="FADE_IN",e[e.CROSS_FADE=4]="CROSS_FADE"}(de||(de={}));class le{constructor(){this.anchorPointClouds=E(),this.radiusCurvatureCorrectionFactor=0,this.transform=_()}}const me=T(0,0,1),ve=j(),ue=E(),fe=1.25,pe=34e3,he=64e3,Ce=2e5;class ge extends U{constructor(e,o){super(e,"samplerCube",V.Pass,((t,a,r)=>t.bindTexture(e,o(a,r))))}}function we(e){const o=e.fragment;o.uniforms.add(new y("rotationMatrixClouds",((e,o)=>o.cloudsFade.parallax.transform)),new y("rotationMatrixCloudsCrossFade",((e,o)=>o.cloudsFade.parallaxNew.transform)),new k("anchorPosition",((e,o)=>o.cloudsFade.parallax.anchorPointClouds)),new k("anchorPositionCrossFade",((e,o)=>o.cloudsFade.parallaxNew.anchorPointClouds)),new w("cloudsHeight",(()=>L)),new w("radiusCurvatureCorrectionFactor",((e,o)=>o.cloudsFade.parallax.radiusCurvatureCorrectionFactor)),new w("totalFadeInOut",((e,o)=>1-o.cloudsFade.opacity)),new w("crossFadeAnchorFactor",((e,o)=>D(o.cloudsFade.fadeFactor,0,1))),new ge("cubeMap",((e,o)=>o.cloudsFade.data?.cubeMap?.colorTexture??null)),new H("crossFade",((e,o)=>o.cloudsFade.fadeMode===de.CROSS_FADE)),new H("readChannelsRG",((e,o)=>o.cloudsFade.readChannels===ne.RG)),new H("fadeTextureChannels",((e,o)=>o.cloudsFade.renderingStage===ie.FADING))),o.constants.add("planetRadius","float",P.radius),o.code.add(h`vec3 intersectWithCloudLayer(vec3 dir, vec3 cameraPosition, vec3 spherePos)
{
float radiusClouds = planetRadius + cloudsHeight;
float B = 2.0 * dot(cameraPosition, dir);
float C = dot(cameraPosition, cameraPosition) - radiusClouds * radiusClouds;
float det = B * B - 4.0 * C;
float pointIntDist = max(0.0, 0.5 *(-B + sqrt(det)));
vec3 intersectionPont = cameraPosition + dir * pointIntDist;
intersectionPont =  intersectionPont - spherePos;
return intersectionPont;
}`),o.code.add(h`vec3 correctForPlanetCurvature(vec3 dir)
{
dir.z = dir.z*(1.-radiusCurvatureCorrectionFactor) + radiusCurvatureCorrectionFactor;
return dir;
}`),o.code.add(h`vec3 rotateDirectionToAnchorPoint(mat4 rotMat, vec3 inVec)
{
return (rotMat * vec4(inVec, 0.0)).xyz;
}`),n(o),d(o),o.code.add(h`const float SUNSET_TRANSITION_FACTOR = 0.3;
const vec3 RIM_COLOR = vec3(0.28, 0.175, 0.035);
const float RIM_SCATTERING_FACTOR = 140.0;
const float BACKLIGHT_FACTOR = 0.2;
const float BACKLIGHT_SCATTERING_FACTOR = 10.0;
const float BACKLIGHT_TRANSITION_FACTOR = 0.3;
vec3 calculateCloudColor(vec3 cameraPosition, vec3 worldSpaceRay, vec4 clouds)
{
float upDotLight = dot(normalize(cameraPosition), normalize(mainLightDirection));
float dirDotLight = max(dot(normalize(-worldSpaceRay), normalize(mainLightDirection)), 0.0);
float sunsetTransition = clamp(pow(max(upDotLight, 0.0), SUNSET_TRANSITION_FACTOR), 0.0, 1.0);
vec3 ambientLight = calculateAmbientIrradiance(normalize(cameraPosition),  0.0);
vec3 mainLight = evaluateMainLighting(normalize(cameraPosition),  0.0);
vec3 combinedLight = clamp((mainLightIntensity + ambientLight )/PI, vec3(0.0), vec3(1.0));
vec3 baseCloudColor = pow(combinedLight * pow(clouds.xyz, vec3(GAMMA)), vec3(INV_GAMMA));
float scatteringMod = max(clouds.a < 0.5 ? clouds.a / 0.5 : - clouds.a / 0.5 + 2.0, 0.0);
float rimLightIntensity = 0.5 + 0.5 *pow(max(upDotLight, 0.0), 0.35);
vec3 directSunScattering = RIM_COLOR * rimLightIntensity * (pow(dirDotLight, RIM_SCATTERING_FACTOR)) * scatteringMod;
float additionalLight = BACKLIGHT_FACTOR * pow(dirDotLight, BACKLIGHT_SCATTERING_FACTOR) * (1. - pow(sunsetTransition, BACKLIGHT_TRANSITION_FACTOR)) ;
return vec3(baseCloudColor * (1. + additionalLight) + directSunScattering);
}`),o.code.add(h`vec4 getCloudData(vec3 rayDir, bool readOtherChannel)
{
vec4 cloudData = texture(cubeMap, rayDir);
float mu = dot(rayDir, vec3(0, 0, 1));
bool readChannels = readChannelsRG ^^ readOtherChannel;
if (readChannels) {
cloudData = vec4(vec3(cloudData.r), cloudData.g);
} else {
cloudData = vec4(vec3(cloudData.b), cloudData.a);
}
if (length(cloudData) == 0.0) {
return vec4(cloudData.rgb, 1.0);
}
return cloudData;
}`),o.code.add(h`vec4 renderCloudsNoFade(vec3 worldRay, vec3 cameraPosition)
{
vec3 intersectionPoint = intersectWithCloudLayer(normalize(worldRay), cameraPosition, anchorPosition);
vec3 worldRayRotated = rotateDirectionToAnchorPoint(rotationMatrixClouds, normalize(intersectionPoint));
vec3 worldRayRotatedCorrected = correctForPlanetCurvature(worldRayRotated);
vec4 cloudData = getCloudData(worldRayRotatedCorrected, false);
float totalTransmittance = clamp(cloudData.a * (1.0 - totalFadeInOut) + totalFadeInOut, 0.0 , 1.0);
if (length(cloudData.rgb) == 0.0) {
totalTransmittance = 1.0;
}
return vec4(calculateCloudColor(cameraPosition, normalize(-worldRay), cloudData), totalTransmittance);
}`),o.code.add(h`vec4 renderCloudsCrossFade(vec3 worldRay, vec3 cameraPosition)
{
vec3 intersectionPoint = intersectWithCloudLayer(normalize(worldRay), cameraPosition, anchorPosition);
vec3 worldRayRotated = rotateDirectionToAnchorPoint(rotationMatrixClouds, normalize(intersectionPoint));
vec3 worldRayRotatedCorrected = correctForPlanetCurvature(worldRayRotated);
vec4 cloudData = getCloudData(worldRayRotatedCorrected, false);
vec4 cloudColor = vec4(calculateCloudColor(cameraPosition, normalize(-worldRay), cloudData), cloudData.a);
intersectionPoint = intersectWithCloudLayer(normalize(worldRay), cameraPosition, anchorPositionCrossFade);
worldRayRotated = rotateDirectionToAnchorPoint(rotationMatrixCloudsCrossFade, normalize(intersectionPoint));
worldRayRotatedCorrected = correctForPlanetCurvature(worldRayRotated);
cloudData = getCloudData(worldRayRotatedCorrected, fadeTextureChannels);
vec4 cloudColorCrossFade = vec4(calculateCloudColor(cameraPosition, normalize(-worldRay), cloudData), cloudData.a);
cloudColor = mix(cloudColor, cloudColorCrossFade, crossFadeAnchorFactor);
float totalTransmittance = clamp(cloudColor.a * (1.0 - totalFadeInOut) + totalFadeInOut, 0.0 , 1.0);
if (length(cloudColor.rgb) == 0.0) {
totalTransmittance = 1.0;
}
return vec4(cloudColor.rgb, totalTransmittance);
}`),o.code.add(h`vec4 renderClouds(vec3 worldRay, vec3 cameraPosition)
{
return crossFade ? renderCloudsCrossFade(worldRay, cameraPosition) : renderCloudsNoFade(worldRay, cameraPosition);
}`)}function ye(e,o){e.include(s,o),e.include(ae),e.include(te),o.hasCloudsReflections&&e.include(we,o),o.hasScreenSpaceReflections&&e.include(re,o);const t=e.fragment;t.constants.add("fresnelSky","vec3",[.02,1,15]).add("fresnelMaterial","vec2",[.02,.1]).add("roughness","float",.015).add("foamIntensityExternal","float",1.7).add("ssrIntensity","float",.65).add("ssrHeightFadeStart","float",3e5).add("ssrHeightFadeEnd","float",5e5).add("waterDiffusion","float",.92).add("waterSeaColorMod","float",.8).add("correctionViewingPowerFactor","float",.4).add("skyZenitColor","vec3",[.52,.68,.9]).add("skyColor","vec3",[.67,.79,.9]).add("cloudFresnelModifier","vec2",[1.2,.01]),t.code.add(h`PBRShadingWater shadingInfo;
vec3 getSkyGradientColor(in float cosTheta, in vec3 horizon, in vec3 zenit) {
float exponent = pow((1.0 - cosTheta), fresnelSky[2]);
return mix(zenit, horizon, exponent);
}`),t.uniforms.add(new w("lightingSpecularStrength",((e,o)=>o.lighting.mainLight.specularStrength)),new w("lightingEnvironmentStrength",((e,o)=>o.lighting.mainLight.environmentStrength))),t.code.add(h`vec3 getSeaColor(in vec3 n, in vec3 v, in vec3 l, vec3 color, in vec3 lightIntensity, in vec3 localUp, in float shadow, float foamIntensity, vec3 viewPosition, vec3 position) {
float reflectionHit = 0.0;
float reflectionHitDiffused = 0.0;
vec3 seaWaterColor = linearizeGamma(color);
vec3 h = normalize(l + v);
shadingInfo.NdotL = clamp(dot(n, l), 0.0, 1.0);
shadingInfo.NdotV = clamp(dot(n, v), 0.001, 1.0);
shadingInfo.VdotN = clamp(dot(v, n), 0.001, 1.0);
shadingInfo.NdotH = clamp(dot(n, h), 0.0, 1.0);
shadingInfo.VdotH = clamp(dot(v, h), 0.0, 1.0);
shadingInfo.LdotH = clamp(dot(l, h), 0.0, 1.0);
float upDotV = max(dot(localUp,v), 0.0);
vec3 skyHorizon = linearizeGamma(skyColor);
vec3 skyZenit = linearizeGamma(skyZenitColor);
vec3 skyColor = getSkyGradientColor(upDotV, skyHorizon, skyZenit );
float upDotL = max(dot(localUp,l),0.0);
float daytimeMod = 0.1 + upDotL * 0.9;
skyColor *= daytimeMod;
float shadowModifier = clamp(shadow, 0.8, 1.0);
vec3 fresnelModifier = fresnelReflection(shadingInfo.VdotN, vec3(fresnelSky[0]), fresnelSky[1]);
vec3 reflSky = lightingEnvironmentStrength * fresnelModifier * skyColor * shadowModifier;
vec3 reflSea = seaWaterColor * mix(skyColor, upDotL * lightIntensity * LIGHT_NORMALIZATION, 2.0 / 3.0) * shadowModifier;
vec3 specular = vec3(0.0);
if(upDotV > 0.0 && upDotL > 0.0) {
vec3 specularSun = brdfSpecularWater(shadingInfo, roughness, vec3(fresnelMaterial[0]), fresnelMaterial[1]);
vec3 incidentLight = lightIntensity * LIGHT_NORMALIZATION * shadow;
specular = lightingSpecularStrength * shadingInfo.NdotL * incidentLight * specularSun;
}
vec3 foam = vec3(0.0);
if(upDotV > 0.0) {
foam = foamIntensity2FoamColor(foamIntensityExternal, foamIntensity, skyZenitColor, daytimeMod);
}
float correctionViewingFactor = pow(max(dot(v, localUp), 0.0), correctionViewingPowerFactor);
vec3 normalCorrectedClouds = mix(localUp, n, correctionViewingFactor);
vec3 reflectedWorld = normalize(reflect(-v, normalCorrectedClouds));`),o.hasCloudsReflections&&t.code.add(h`vec4 cloudsColor = renderClouds(reflectedWorld, position);
cloudsColor.a = 1.0 - cloudsColor.a;
cloudsColor = pow(cloudsColor, vec4(GAMMA));
cloudsColor *= clamp(fresnelModifier.y * cloudFresnelModifier[0] - cloudFresnelModifier[1], 0.0, 1.0) * clamp((1.0 - totalFadeInOut), 0.0, 1.0);`),o.hasScreenSpaceReflections?(t.uniforms.add(new y("view",((e,o)=>o.camera.viewMatrix)),new F("lastFrameColorTexture",((e,o)=>o.ssr.lastFrameColor?.colorTexture)),new w("fadeFactorSSR",((e,o)=>o.ssr.fadeFactor))),t.code.add(h`vec3 viewDir = normalize(viewPosition);
vec4 viewNormalVectorCoordinate = view *vec4(n, 0.0);
vec3 viewNormal = normalize(viewNormalVectorCoordinate.xyz);
vec4 viewUp = view * vec4(localUp, 0.0);
vec3 viewNormalCorrectedSSR = mix(viewUp.xyz, viewNormal, correctionViewingFactor);
vec3 reflected = normalize(reflect(viewDir, viewNormalCorrectedSSR));
vec3 hitCoordinate = screenSpaceIntersection(reflected, viewPosition, viewDir, viewUp.xyz);
vec3 reflectedColor = vec3(0.0);
if (hitCoordinate.z > 0.0)
{
vec2 reprojectedCoordinate = reprojectionCoordinate(hitCoordinate);
vec2 dCoords = smoothstep(0.3, 0.6, abs(vec2(0.5, 0.5) - hitCoordinate.xy));
float heightMod = smoothstep(ssrHeightFadeEnd, ssrHeightFadeStart, -viewPosition.z);
reflectionHit = clamp(1.0 - (1.3 * dCoords.y), 0.0, 1.0) * heightMod * fadeFactorSSR;
reflectionHitDiffused = waterDiffusion * reflectionHit;
reflectedColor = linearizeGamma(texture(lastFrameColorTexture, reprojectedCoordinate).xyz) *
reflectionHitDiffused * fresnelModifier.y * ssrIntensity;
}
float seaColorMod =  mix(waterSeaColorMod, waterSeaColorMod * 0.5, reflectionHitDiffused);
vec3 waterRenderedColor = tonemapACES((1.0 - reflectionHitDiffused) * reflSky + reflectedColor +
reflSea * seaColorMod + specular + foam);`)):t.code.add(h`vec3 waterRenderedColor = tonemapACES(reflSky + reflSea * waterSeaColorMod + specular + foam);`),o.hasCloudsReflections?o.hasScreenSpaceReflections?t.code.add(h`return waterRenderedColor * (1.0 - (1.0 - reflectionHit) * cloudsColor.a) + (1.0 - reflectionHit) * cloudsColor.xyz;
}`):t.code.add(h`return waterRenderedColor * (1.0 - cloudsColor.a) + cloudsColor.xyz;
}`):t.code.add(h`return waterRenderedColor;
}`)}function Fe(e){e.fragment.uniforms.add(new F("texWaveNormal",(e=>e.waveNormal)),new F("texWavePerturbation",(e=>e.wavePerturbation)),new K("waveParams",(e=>$(De,e.waveStrength,e.waveTextureRepeat,e.flowStrength,e.flowOffset))),new g("waveDirection",(e=>B(Pe,e.waveDirection[0]*e.waveVelocity,e.waveDirection[1]*e.waveVelocity)))),e.include(oe),e.fragment.code.add(h`const vec2  FLOW_JUMP = vec2(6.0/25.0, 5.0/24.0);
vec2 textureDenormalized2D(sampler2D _tex, vec2 _uv) {
return 2.0 * texture(_tex, _uv).rg - 1.0;
}
float sampleNoiseTexture(vec2 _uv) {
return texture(texWavePerturbation, _uv).b;
}
vec3 textureDenormalized3D(sampler2D _tex, vec2 _uv) {
return 2.0 * texture(_tex, _uv).rgb - 1.0;
}
float computeProgress(vec2 uv, float time) {
return fract(time);
}
float computeWeight(vec2 uv, float time) {
float progress = computeProgress(uv, time);
return 1.0 - abs(1.0 - 2.0 * progress);
}
vec3 computeUVPerturbedWeigth(sampler2D texFlow, vec2 uv, float time, float phaseOffset) {
float flowStrength = waveParams[2];
float flowOffset = waveParams[3];
vec2 flowVector = textureDenormalized2D(texFlow, uv) * flowStrength;
float progress = computeProgress(uv, time + phaseOffset);
float weight = computeWeight(uv, time + phaseOffset);
vec2 result = uv;
result -= flowVector * (progress + flowOffset);
result += phaseOffset;
result += (time - progress) * FLOW_JUMP;
return vec3(result, weight);
}
const float TIME_NOISE_TEXTURE_REPEAT = 0.3737;
const float TIME_NOISE_STRENGTH = 7.77;
vec3 getWaveLayer(sampler2D _texNormal, sampler2D _dudv, vec2 _uv, vec2 _waveDir, float time) {
float waveStrength = waveParams[0];
vec2 waveMovement = time * -_waveDir;
float timeNoise = sampleNoiseTexture(_uv * TIME_NOISE_TEXTURE_REPEAT) * TIME_NOISE_STRENGTH;
vec3 uv_A = computeUVPerturbedWeigth(_dudv, _uv + waveMovement, time + timeNoise, 0.0);
vec3 uv_B = computeUVPerturbedWeigth(_dudv, _uv + waveMovement, time + timeNoise, 0.5);
vec3 normal_A = textureDenormalized3D(_texNormal, uv_A.xy) * uv_A.z;
vec3 normal_B = textureDenormalized3D(_texNormal, uv_B.xy) * uv_B.z;
vec3 mixNormal = normalize(normal_A + normal_B);
mixNormal.xy *= waveStrength;
mixNormal.z = sqrt(1.0 - dot(mixNormal.xy, mixNormal.xy));
return mixNormal;
}
vec4 getSurfaceNormalAndFoam(vec2 _uv, float _time) {
float waveTextureRepeat = waveParams[1];
vec3 normal = getWaveLayer(texWaveNormal, texWavePerturbation, _uv * waveTextureRepeat, waveDirection, _time);
float foam  = normals2FoamIntensity(normal, waveParams[0]);
return vec4(normal, foam);
}`)}const De=Q(),Pe=W(),Se=Object.freeze(Object.defineProperty({__proto__:null,build:function(s){const C=new Z,{vertex:g,fragment:y}=C;J(g,s),C.include(a,s),C.attributes.add(ee.POSITION,"vec3"),C.attributes.add(ee.UV0,"vec2");const F=new K("waterColor",(e=>e.color));if(s.output===o.Color&&s.isDraped)return C.varyings.add("vpos","vec3"),g.uniforms.add(F),g.code.add(h`
        void main(void) {
          if (waterColor.a < ${h.float(q)}) {
            // Discard this vertex
            gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
            return;
          }

          vpos = position;
          gl_Position = transformPosition(proj, view, vpos);
        }
    `),y.uniforms.add(F),y.code.add(h`void main() {
fragColor = waterColor;
}`),C;switch(s.output!==o.Color&&s.output!==o.Alpha||(C.include(p,s),C.include(e,s),C.varyings.add("vuv","vec2"),C.varyings.add("vpos","vec3"),C.varyings.add("vnormal","vec3"),C.varyings.add("vtbnMatrix","mat3"),s.multipassEnabled&&C.varyings.add("depth","float"),g.uniforms.add(F),g.code.add(h`
      void main(void) {
        if (waterColor.a < ${h.float(q)}) {
          // Discard this vertex
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vuv = uv0;
        vpos = position;

        vnormal = getLocalUp(vpos, localOrigin);
        vtbnMatrix = getTBNMatrix(vnormal);

        ${s.multipassEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}

        gl_Position = transformPosition(proj, view, vpos);
        ${s.output===o.Color?"forwardLinearDepth();":""}
      }
    `)),C.include(u,s),s.output){case o.Alpha:C.include(t,s),y.uniforms.add(F),y.code.add(h`
        void main() {
          discardBySlice(vpos);
          ${s.multipassEnabled?"terrainDepthTest(depth);":""}

          fragColor = vec4(waterColor.a);
        }
      `);break;case o.Color:C.include(c),C.include(l,{pbrMode:m.Disabled,lightingSphericalHarmonicsOrder:2}),C.include(Fe),C.include(t,s),C.include(v,s),C.include(ye,s),y.uniforms.add(F,new w("timeElapsed",(e=>e.timeElapsed)),g.uniforms.get("view"),g.uniforms.get("localOrigin")),X(y,s),y.include(f),n(y),d(y),y.code.add(h`
      void main() {
        discardBySlice(vpos);
        ${s.multipassEnabled?"terrainDepthTest(depth);":""}
        vec3 localUp = vnormal;
        // the created normal is in tangent space
        vec4 tangentNormalFoam = getSurfaceNormalAndFoam(vuv, timeElapsed);

        // we rotate the normal according to the tangent-bitangent-normal-Matrix
        vec3 n = normalize(vtbnMatrix * tangentNormalFoam.xyz);
        vec3 v = -normalize(vpos - cameraPosition);
        float shadow = ${s.receiveShadows?h`1.0 - readShadowMap(vpos, linearDepth)`:"1.0"};
        vec4 vPosView = view * vec4(vpos, 1.0);
        vec4 final = vec4(getSeaColor(n, v, mainLightDirection, waterColor.rgb, mainLightIntensity, localUp, shadow, tangentNormalFoam.w, vPosView.xyz, vpos + localOrigin), waterColor.w);

        // gamma correction
        fragColor = delinearizeGamma(final);
        fragColor = highlightSlice(fragColor, vpos);
        ${s.transparencyPassType===Y.Color?"fragColor = premultiplyAlpha(fragColor);":""}
      }
    `);break;case o.Normal:C.include(p,s),C.include(Fe,s),C.include(t,s),C.varyings.add("vpos","vec3"),C.varyings.add("vuv","vec2"),g.uniforms.add(F),g.code.add(h`
        void main(void) {
          if (waterColor.a < ${h.float(q)}) {
            // Discard this vertex
            gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
            return;
          }

          vuv = uv0;
          vpos = position;

          gl_Position = transformPosition(proj, view, vpos);
        }
    `),y.uniforms.add(new w("timeElapsed",(e=>e.timeElapsed))),y.code.add(h`void main() {
discardBySlice(vpos);
vec4 tangentNormalFoam = getSurfaceNormalAndFoam(vuv, timeElapsed);
tangentNormalFoam.xyz = normalize(tangentNormalFoam.xyz);
fragColor = vec4((tangentNormalFoam.xyz + vec3(1.0)) * 0.5, tangentNormalFoam.w);
}`);break;case o.Highlight:C.include(i,s),C.varyings.add("vpos","vec3"),g.uniforms.add(F),g.code.add(h`
      void main(void) {
        if (waterColor.a < ${h.float(q)}) {
          // Discard this vertex
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vpos = position;
        gl_Position = transformPosition(proj, view, vpos);
      }
    `),C.include(t,s),y.code.add(h`void main() {
discardBySlice(vpos);
outputHighlight();
}`);break;case o.ObjectAndLayerIdColor:C.include(r,s),C.varyings.add("vpos","vec3"),g.uniforms.add(F),g.code.add(h`
      void main(void) {
        if (waterColor.a < ${h.float(q)}) {
          // Discard this vertex
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          return;
        }

        vpos = position;
        gl_Position = transformPosition(proj, view, vpos);
        forwardObjectAndLayerIdColor();
      }
    `),C.include(t,s),y.code.add(h`void main() {
discardBySlice(vpos);
outputObjectAndLayerIdColor();
}`)}return C}},Symbol.toStringTag,{value:"Module"}));export{ce as C,de as F,ae as G,ye as W,Se as a,we as b,ne as c,ie as d,se as i};
