// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../output/ReadLinearDepth.glsl","../../shaderModules/Float2PassUniform","../../shaderModules/interfaces","../../shaderModules/Texture2DPassUniform"],function(b,g,h,c,k){class l{constructor(){this.cullAboveGround=!1}}b.MultipassTerrainUniforms=l;b.multipassTerrainTest=function(a,d){if(d.multipassEnabled){a.fragment.include(g.ReadLinearDepth);a.fragment.uniforms.add(new k.Texture2DPassUniform("terrainDepthTexture",(m,e)=>e.multipassTerrain.linearDepth?.colorTexture));a.fragment.uniforms.add(new h.Float2PassUniform("nearFar",
(m,e)=>e.camera.nearFar));var f=d.occlusionPass;a.fragment.code.add(c.glsl`
   ${f?"bool":"void"} terrainDepthTest(float fragmentDepth) {
      vec4 data = texelFetch(terrainDepthTexture, ivec2(gl_FragCoord.xy), 0);
      float linearDepth = linearDepthFromRGBA(data, nearFar);
      ${f?c.glsl`return fragmentDepth < linearDepth && data != vec4(0.0, 0.0, 0.0, 1.0);`:c.glsl`
          if(fragmentDepth ${d.cullAboveGround?"\x3e":"\x3c\x3d"} linearDepth){
            discard;
          }`}
    }`)}};Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})});