// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define("exports ../views/3d/webgl-engine/core/shaderLibrary/ForwardLinearDepth.glsl ../views/3d/webgl-engine/core/shaderLibrary/Offset.glsl ../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput ../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl ../views/3d/webgl-engine/core/shaderLibrary/Transform.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/InstancedDoublePrecision.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/NormalAttribute.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/PositionAttribute.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/SymbolColor.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/TextureCoordinateAttribute.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexColor.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/VertexNormal.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/VerticalOffset.glsl ../views/3d/webgl-engine/core/shaderLibrary/default/DefaultMaterialAuxiliaryPasses.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/ComputeNormalTexture.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateAmbientOcclusion.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/EvaluateSceneLighting.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/MainLighting.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/Normals.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/PhysicallyBasedRendering.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/PhysicallyBasedRenderingParameters.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/ReadShadowMap.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/TextureTransformUV.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/VisualVariables.glsl ../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff ../views/3d/webgl-engine/core/shaderLibrary/util/AlphaDiscard.glsl ../views/3d/webgl-engine/core/shaderLibrary/util/MixExternalColor.glsl ../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl ../views/3d/webgl-engine/core/shaderModules/Float3PassUniform ../views/3d/webgl-engine/core/shaderModules/Float4PassUniform ../views/3d/webgl-engine/core/shaderModules/FloatPassUniform ../views/3d/webgl-engine/core/shaderModules/interfaces ../views/3d/webgl-engine/core/shaderModules/ShaderBuilder ../views/3d/webgl-engine/core/shaderModules/Texture2DPassUniform ../views/3d/webgl-engine/lib/TransparencyPassType ../views/3d/webgl-engine/lib/VertexAttribute".split(" "),
function(r,B,C,h,t,D,E,k,F,G,H,I,J,K,L,M,N,p,O,u,P,Q,l,v,f,R,S,w,x,q,y,T,m,b,U,z,V,W){function A(a){const c=new U.ShaderBuilder,{vertex:g,fragment:e,varyings:n}=c;q.addProjViewLocalOrigin(g,a);c.include(F.PositionAttribute);n.add("vpos","vec3");c.include(R.VisualVariables,a);c.include(E.InstancedDoublePrecision,a);c.include(K.VerticalOffset,a);a.hasColorTextureTransform&&c.include(f.colorTextureUV);if(a.output===h.ShaderOutput.Color||a.output===h.ShaderOutput.Alpha){a.hasNormalTextureTransform&&c.include(f.normalTextureUV);
a.hasEmissionTextureTransform&&c.include(f.emissiveTextureUV);a.hasOcclusionTextureTransform&&c.include(f.occlusionTextureUV);a.hasMetallicRoughnessTextureTransform&&c.include(f.metallicRoughnessTextureUV);q.addCameraPosition(g,a);c.include(k.NormalAttribute,a);c.include(D.Transform,a);const d=a.normalType===k.NormalType.Attribute||a.normalType===k.NormalType.Compressed;d&&a.offsetBackfaces&&c.include(C.Offset);c.include(M.ComputeNormalTexture,a);c.include(J.VertexNormal,a);a.instancedColor&&c.attributes.add(W.VertexAttribute.INSTANCECOLOR,
"vec4");n.add("vPositionLocal","vec3");c.include(H.TextureCoordinateAttribute,a);c.include(B.ForwardLinearDepth,a);c.include(G.SymbolColor,a);c.include(I.VertexColor,a);g.uniforms.add(new T.Float4PassUniform("externalColor",X=>X.externalColor));n.add("vcolorExt","vec4");a.multipassEnabled&&n.add("depth","float");g.code.add(b.glsl`
      void main(void) {
        forwardNormalizedVertexColor();
        vcolorExt = externalColor;
        ${a.instancedColor?"vcolorExt *\x3d instanceColor * 0.003921568627451;":""}
        vcolorExt *= vvColor();
        vcolorExt *= getSymbolColor();
        forwardColorMixMode();

        if (vcolorExt.a < ${b.glsl.float(S.symbolAlphaCutoff)}) {
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        } else {
          vpos = getVertexInLocalOriginSpace();
          vPositionLocal = vpos - view[3].xyz;
          vpos = subtractOrigin(vpos);
          ${d?b.glsl`vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`:""}
          vpos = addVerticalOffset(vpos, localOrigin);
          ${a.hasVertexTangents?"vTangent \x3d dpTransformVertexTangent(tangent);":""}
          gl_Position = transformPosition(proj, view, vpos);
          ${d&&a.offsetBackfaces?"gl_Position \x3d offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);":""}
        }

        ${a.multipassEnabled?"depth \x3d (view * vec4(vpos, 1.0)).z;":""}
        forwardLinearDepth();
        forwardTextureCoordinates();
        ${a.hasColorTextureTransform?b.glsl`forwardColorUV();`:""}
        ${a.hasNormalTextureTransform?b.glsl`forwardNormalUV();`:""}
        ${a.hasEmissionTextureTransform?b.glsl`forwardEmissiveUV();`:""}
        ${a.hasOcclusionTextureTransform?b.glsl`forwardOcclusionUV();`:""}
        ${a.hasMetallicRoughnessTextureTransform?b.glsl`forwardMetallicRoughnessUV();`:""}
      }
    `)}switch(a.output){case h.ShaderOutput.Alpha:c.include(t.SliceDraw,a);c.include(w.DiscardOrAdjustAlphaPass,a);c.include(u.multipassTerrainTest,a);e.uniforms.add(new m.FloatPassUniform("opacity",d=>d.opacity),new m.FloatPassUniform("layerOpacity",d=>d.layerOpacity));a.hasColorTexture&&e.uniforms.add(new z.Texture2DPassUniform("tex",d=>d.texture));e.include(x.MixExternalColor);e.code.add(b.glsl`
      void main() {
        discardBySlice(vpos);
        ${a.multipassEnabled?"terrainDepthTest(depth);":""}
        ${a.hasColorTexture?b.glsl`
                vec4 texColor = texture(tex, ${a.hasColorTextureTransform?b.glsl`colorUV`:b.glsl`vuv0`});
                ${a.textureAlphaPremultiplied?"texColor.rgb /\x3d texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:b.glsl`vec4 texColor = vec4(1.0);`}
        ${a.hasVertexColors?b.glsl`float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:b.glsl`float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        fragColor = vec4(opacity_);
      }
    `);break;case h.ShaderOutput.Color:c.include(t.SliceDraw,a),c.include(p.EvaluateSceneLighting,a),c.include(N.EvaluateAmbientOcclusion,a),c.include(w.DiscardOrAdjustAlphaPass,a),c.include(a.instancedDoublePrecision?v.ReadShadowMapPass:v.ReadShadowMapDraw,a),c.include(u.multipassTerrainTest,a),q.addCameraPosition(e,a),e.uniforms.add(g.uniforms.get("localOrigin"),new y.Float3PassUniform("ambient",d=>d.ambient),new y.Float3PassUniform("diffuse",d=>d.diffuse),new m.FloatPassUniform("opacity",d=>d.opacity),
new m.FloatPassUniform("layerOpacity",d=>d.layerOpacity)),a.hasColorTexture&&e.uniforms.add(new z.Texture2DPassUniform("tex",d=>d.texture)),c.include(l.PhysicallyBasedRenderingParameters,a),c.include(Q.PhysicallyBasedRendering,a),e.include(x.MixExternalColor),c.include(P.Normals,a),p.addAmbientBoostFactor(e),p.addLightingGlobalFactor(e),O.addMainLightIntensity(e),e.code.add(b.glsl`
      void main() {
        discardBySlice(vpos);
        ${a.multipassEnabled?"terrainDepthTest(depth);":""}
        ${a.hasColorTexture?b.glsl`
                vec4 texColor = texture(tex, ${a.hasColorTextureTransform?b.glsl`colorUV`:b.glsl`vuv0`});
                ${a.textureAlphaPremultiplied?"texColor.rgb /\x3d texColor.a;":""}
                discardOrAdjustAlpha(texColor);`:b.glsl`vec4 texColor = vec4(1.0);`}
        shadingParams.viewDirection = normalize(vpos - cameraPosition);
        ${a.normalType===k.NormalType.ScreenDerivative?b.glsl`
                vec3 normal = screenDerivativeNormal(vPositionLocal);`:b.glsl`
                shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
        ${a.pbrMode===l.PBRMode.Normal?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        vec3 posWorld = vpos + localOrigin;

        float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
        float shadow = ${a.receiveShadows?"readShadowMap(vpos, linearDepth)":a.spherical?"lightingGlobalFactor * (1.0 - additionalAmbientScale)":"0.0"};

        vec3 matColor = max(ambient, diffuse);
        ${a.hasVertexColors?b.glsl`
                vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:b.glsl`
                vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
                float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
        ${a.hasNormalTexture?b.glsl`
                mat3 tangentSpace = ${a.hasVertexTangents?"computeTangentSpace(normal);":"computeTangentSpace(normal, vpos, vuv0);"}
                vec3 shadingNormal = computeTextureNormal(tangentSpace, ${a.hasNormalTextureTransform?b.glsl`normalUV`:"vuv0"});`:b.glsl`vec3 shadingNormal = normal;`}
        vec3 normalGround = ${a.spherical?b.glsl`normalize(posWorld);`:b.glsl`vec3(0.0, 0.0, 1.0);`}

        ${a.snowCover?b.glsl`
                float snow = smoothstep(0.5, 0.55, dot(normal, normalGround));
                albedo = mix(albedo, vec3(1), snow);
                shadingNormal = mix(shadingNormal, normal, snow);
                ssao = mix(ssao, 1.0, snow);`:""}

        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

        ${a.pbrMode===l.PBRMode.Normal||a.pbrMode===l.PBRMode.Schematic?b.glsl`
                float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                ${a.snowCover?b.glsl`
                        mrr = mix(mrr, vec3(0.0, 1.0, 0.04), snow);
                        emission = mix(emission, vec3(0.0), snow);`:""}

                vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:b.glsl`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
        fragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${a.transparencyPassType===V.TransparencyPassType.Color?b.glsl`fragColor = premultiplyAlpha(fragColor);`:""}
      }
    `)}c.include(L.DefaultMaterialAuxiliaryPasses,a);return c}const Y=Object.freeze(Object.defineProperty({__proto__:null,build:A},Symbol.toStringTag,{value:"Module"}));r.DefaultMaterial=Y;r.build=A});