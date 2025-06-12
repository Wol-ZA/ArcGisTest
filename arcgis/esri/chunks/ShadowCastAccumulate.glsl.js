// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define("exports ./mat4 ./mat4f64 ../views/3d/webgl-engine/core/shaderLibrary/ScreenSpacePass.glsl ../views/3d/webgl-engine/core/shaderLibrary/output/ReadLinearDepth.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl ../views/3d/webgl-engine/core/shaderLibrary/util/CameraSpace.glsl ../views/3d/webgl-engine/core/shaderLibrary/util/RgbaFloatEncoding.glsl ../views/3d/webgl-engine/core/shaderModules/Float2PassUniform ../views/3d/webgl-engine/core/shaderModules/interfaces ../views/3d/webgl-engine/core/shaderModules/Matrix4PassUniform ../views/3d/webgl-engine/core/shaderModules/ShaderBuilder ../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform".split(" "),
function(d,f,e,l,m,n,p,q,r,t,u,v,w){function g(x){const a=new v.ShaderBuilder,c=a.fragment;c.include(q.RgbaFloatEncoding);c.include(m.ReadLinearDepth);a.include(p.CameraSpace);a.include(l.ScreenSpacePass);a.include(n.ReadShadowMapPass,x);c.uniforms.add(new w.Texture2DPassUniform("depthMap",(h,b)=>b.linearDepth?.colorTexture),new u.Matrix4PassUniform("inverseViewMatrix",(h,b)=>f.invert(k,f.translate(k,b.camera.viewMatrix,b.camera.center))),new r.Float2PassUniform("nearFar",(h,b)=>b.camera.nearFar));
c.constants.add("sampleValue","float",y);a.outputs.add("sampleCount","float");c.code.add(t.glsl`void main(void) {
float depth = rgba2float(texture(depthMap, uv));
if (depth == 0.0) {
discard;
}
float currentPixelDepth = linearDepthFromFloat(depth, nearFar);
if (-currentPixelDepth > nearFar.y || -currentPixelDepth < nearFar.x) {
discard;
}
vec4 currentPixelPos = vec4(reconstructPosition(gl_FragCoord.xy, currentPixelDepth), 1.0);
vec4 worldSpacePos = inverseViewMatrix * currentPixelPos;
mat4 shadowMatrix;
float linearDepth = -currentPixelDepth;
int i = chooseCascade(linearDepth, shadowMatrix);
if (i >= numCascades) {
discard;
}
vec3 lvpos = lightSpacePosition(worldSpacePos.xyz, shadowMatrix);
if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) {
discard;
}
ivec2 texSize = textureSize(shadowMapTex, 0);
ivec2 uvShadow = ivec2(cascadeCoordinates(i, texSize, lvpos) * vec2(texSize));
float depthShadow = readShadowMapDepth(uvShadow, shadowMapTex);
bool shadow = depthShadow < lvpos.z;
if (!shadow) {
discard;
}
sampleCount = sampleValue;
}`);return a}const y=1/255,k=e.create();e=Object.freeze(Object.defineProperty({__proto__:null,ShadowCastMaxSamples:255,build:g},Symbol.toStringTag,{value:"Module"}));d.ShadowCastAccumulate=e;d.ShadowCastMaxSamples=255;d.build=g});