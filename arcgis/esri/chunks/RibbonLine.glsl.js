// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define("exports ../views/3d/webgl-engine/core/shaderLibrary/ForwardLinearDepth.glsl ../views/3d/webgl-engine/core/shaderLibrary/ShaderOutput ../views/3d/webgl-engine/core/shaderLibrary/Slice.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/ObjectAndLayerIdColor.glsl ../views/3d/webgl-engine/core/shaderLibrary/attributes/RibbonVertexPosition.glsl ../views/3d/webgl-engine/core/shaderLibrary/output/OutputDepth.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/LineStipple.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/MarkerSizing.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/MultipassTerrainTest.glsl ../views/3d/webgl-engine/core/shaderLibrary/shading/PiUtils.glsl ../views/3d/webgl-engine/core/shaderLibrary/util/AlphaCutoff ../views/3d/webgl-engine/core/shaderLibrary/util/ColorConversion.glsl ../views/3d/webgl-engine/core/shaderLibrary/util/View.glsl ../views/3d/webgl-engine/core/shaderModules/Float2PassUniform ../views/3d/webgl-engine/core/shaderModules/Float4PassUniform ../views/3d/webgl-engine/core/shaderModules/FloatPassUniform ../views/3d/webgl-engine/core/shaderModules/interfaces ../views/3d/webgl-engine/core/shaderModules/Matrix4PassUniform ../views/3d/webgl-engine/core/shaderModules/ShaderBuilder ../views/3d/webgl-engine/lib/TransparencyPassType ../views/3d/webgl-engine/lib/VertexAttribute ../views/3d/webgl-engine/shaders/LineMarkerTechniqueConfiguration ../views/3d/webgl-engine/shaders/RibbonLineTechniqueConfiguration".split(" "),
function(p,w,g,E,F,G,H,x,I,J,K,q,L,y,M,r,l,a,N,O,P,m,Q,z){function A(b){const c=new O.ShaderBuilder,{vertex:d,fragment:f}=c,n=b.multipassEnabled&&(b.output===g.ShaderOutput.Color||b.output===g.ShaderOutput.Alpha);c.include(K.PiUtils);c.include(G.RibbonVertexPosition,b);c.include(x.LineStipple,b);const B=b.applyMarkerOffset&&!b.draped;B&&(d.uniforms.add(new l.FloatPassUniform("markerScale",e=>e.markerScale)),c.include(I.MarkerSizing,{space:Q.LineMarkerSpace.World,draped:!1}));b.output===g.ShaderOutput.Depth&&
c.include(H.OutputDepth,b);c.include(F.ObjectAndLayerIdColor,b);y.addProjViewLocalOrigin(d,b);d.uniforms.add(new N.Matrix4PassUniform("inverseProjectionMatrix",(e,h)=>h.camera.inverseProjectionMatrix),new M.Float2PassUniform("nearFar",(e,h)=>h.camera.nearFar),new l.FloatPassUniform("miterLimit",e=>"miter"!==e.join?0:e.miterLimit),new r.Float4PassUniform("viewport",(e,h)=>h.camera.fullViewport));d.constants.add("LARGE_HALF_FLOAT","float",65500);c.attributes.add(m.VertexAttribute.POSITION,"vec3");c.attributes.add(m.VertexAttribute.SUBDIVISIONFACTOR,
"float");c.attributes.add(m.VertexAttribute.UV0,"vec2");c.attributes.add(m.VertexAttribute.AUXPOS1,"vec3");c.attributes.add(m.VertexAttribute.AUXPOS2,"vec3");c.varyings.add("vColor","vec4");c.varyings.add("vpos","vec3");w.addLinearDepth(c);n&&c.varyings.add("depth","float");const t=b.stippleEnabled;t&&c.varyings.add("vLineSizeInv","float");const k=b.capType===z.CapType.ROUND,C=t||k;C&&c.varyings.add("vLineWidth","float");const u=b.innerColorEnabled||k;u&&c.varyings.add("vLineDistance","float");const D=
b.stippleEnabled&&k,v=b.falloffEnabled||D;v&&c.varyings.add("vLineDistanceNorm","float");k&&(c.varyings.add("vSegmentSDF","float"),c.varyings.add("vReverseSegmentSDF","float"));d.code.add(a.glsl`#define PERPENDICULAR(v) vec2(v.y, -v.x);
float interp(float ncp, vec4 a, vec4 b) {
return (-ncp - a.z) / (b.z - a.z);
}
vec2 rotate(vec2 v, float a) {
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, -s, s, c);
return m * v;
}`);d.code.add(a.glsl`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
return posNdc;
}`);w.addCalculateLinearDepth(c);d.code.add(a.glsl`
    void clipAndTransform(inout vec4 pos, inout vec4 prev, inout vec4 next, in bool isStartVertex) {
      float vnp = nearFar[0] * 0.99;

      if(pos.z > -nearFar[0]) {
        //current pos behind ncp --> we need to clip
        if (!isStartVertex) {
          if(prev.z < -nearFar[0]) {
            //previous in front of ncp
            pos = mix(prev, pos, interp(vnp, prev, pos));
            next = pos;
          } else {
            pos = vec4(0.0, 0.0, 0.0, 1.0);
          }
        } else {
          if(next.z < -nearFar[0]) {
            //next in front of ncp
            pos = mix(pos, next, interp(vnp, pos, next));
            prev = pos;
          } else {
            pos = vec4(0.0, 0.0, 0.0, 1.0);
          }
        }
      } else {
        //current position visible
        if (prev.z > -nearFar[0]) {
          //previous behind ncp
          prev = mix(pos, prev, interp(vnp, pos, prev));
        }
        if (next.z > -nearFar[0]) {
          //next behind ncp
          next = mix(next, pos, interp(vnp, next, pos));
        }
      }

      ${n?"depth \x3d pos.z;":""}
      linearDepth = calculateLinearDepth(nearFar,pos.z);

      pos = projectAndScale(pos);
      next = projectAndScale(next);
      prev = projectAndScale(prev);
    }
  `);y.addPixelRatio(d);d.code.add(a.glsl`
  void main(void) {
    // unpack values from uv0.y
    bool isStartVertex = abs(abs(uv0.y)-3.0) == 1.0;

    float coverage = 1.0;

    // Check for special value of uv0.y which is used by the Renderer when graphics
    // are removed before the VBO is recompacted. If this is the case, then we just
    // project outside of clip space.
    if (uv0.y == 0.0) {
      // Project out of clip space
      gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
    }
    else {
      bool isJoin = abs(uv0.y) < 3.0;

      float lineSize = getSize();
      float lineWidth = lineSize * pixelRatio;

      ${C?a.glsl`vLineWidth = lineWidth;`:""}
      ${t?a.glsl`vLineSizeInv = 1.0 / lineSize;`:""}

      // convert sub-pixel coverage to alpha
      if (lineWidth < 1.0) {
        coverage = lineWidth;
        lineWidth = 1.0;
      }else{
        // Ribbon lines cannot properly render non-integer sizes. Round width to integer size if
        // larger than one for better quality. Note that we do render < 1 pixels more or less correctly
        // so we only really care to round anything larger than 1.
        lineWidth = floor(lineWidth + 0.5);
      }

      vec4 pos  = view * vec4(position.xyz, 1.0);
      vec4 prev = view * vec4(auxpos1.xyz, 1.0);
      vec4 next = view * vec4(auxpos2.xyz, 1.0);
  `);B&&d.code.add(a.glsl`vec4 other = isStartVertex ? next : prev;
bool markersHidden = areWorldMarkersHidden(pos, other);
if(!isJoin && !markersHidden) {
pos.xyz += normalize(other.xyz - pos.xyz) * getWorldMarkerSize(pos) * 0.5;
}`);d.code.add(a.glsl`clipAndTransform(pos, prev, next, isStartVertex);
vec2 left = (pos.xy - prev.xy);
vec2 right = (next.xy - pos.xy);
float leftLen = length(left);
float rightLen = length(right);`);(b.stippleEnabled||k)&&d.code.add(a.glsl`
      float isEndVertex = float(!isStartVertex);
      vec2 segmentOrigin = mix(pos.xy, prev.xy, isEndVertex);
      vec2 segment = mix(right, left, isEndVertex);
      ${k?a.glsl`vec2 segmentEnd = mix(next.xy, pos.xy, isEndVertex);`:""}
    `);d.code.add(a.glsl`left = (leftLen > 0.001) ? left/leftLen : vec2(0.0, 0.0);
right = (rightLen > 0.001) ? right/rightLen : vec2(0.0, 0.0);
vec2 capDisplacementDir = vec2(0, 0);
vec2 joinDisplacementDir = vec2(0, 0);
float displacementLen = lineWidth;
if (isJoin) {
bool isOutside = (left.x * right.y - left.y * right.x) * uv0.y > 0.0;
joinDisplacementDir = normalize(left + right);
joinDisplacementDir = PERPENDICULAR(joinDisplacementDir);
if (leftLen > 0.001 && rightLen > 0.001) {
float nDotSeg = dot(joinDisplacementDir, left);
displacementLen /= length(nDotSeg * left - joinDisplacementDir);
if (!isOutside) {
displacementLen = min(displacementLen, min(leftLen, rightLen)/abs(nDotSeg));
}
}
if (isOutside && (displacementLen > miterLimit * lineWidth)) {`);b.roundJoins?d.code.add(a.glsl`
        vec2 startDir = leftLen < 0.001 ? right : left;
        startDir = PERPENDICULAR(startDir);

        vec2 endDir = rightLen < 0.001 ? left : right;
        endDir = PERPENDICULAR(endDir);

        float factor = ${b.stippleEnabled?a.glsl`min(1.0, subdivisionFactor * ${a.glsl.float(1.5)})`:a.glsl`subdivisionFactor`};

        float rotationAngle = acos(clamp(dot(startDir, endDir), -1.0, 1.0));
        joinDisplacementDir = rotate(startDir, -sign(uv0.y) * factor * rotationAngle);
      `):d.code.add(a.glsl`if (leftLen < 0.001) {
joinDisplacementDir = right;
}
else if (rightLen < 0.001) {
joinDisplacementDir = left;
}
else {
joinDisplacementDir = (isStartVertex || subdivisionFactor > 0.0) ? right : left;
}
joinDisplacementDir = PERPENDICULAR(joinDisplacementDir);`);d.code.add(a.glsl`
        displacementLen = lineWidth;
      }
    } else {
      // CAP handling ---------------------------------------------------
      joinDisplacementDir = isStartVertex ? right : left;
      joinDisplacementDir = PERPENDICULAR(joinDisplacementDir);

      ${b.capType!==z.CapType.BUTT?a.glsl`capDisplacementDir = isStartVertex ? -right : left;`:""}
    }
  `);d.code.add(a.glsl`
    // Displacement (in pixels) caused by join/or cap
    vec2 dpos = joinDisplacementDir * sign(uv0.y) * displacementLen + capDisplacementDir * displacementLen;

    ${v||u?a.glsl`float lineDistNorm = sign(uv0.y) * pos.w;`:""}

    ${u?a.glsl`vLineDistance = lineWidth * lineDistNorm;`:""}
    ${v?a.glsl`vLineDistanceNorm = lineDistNorm;`:""}

    pos.xy += dpos;
  `);k&&d.code.add(a.glsl`vec2 segmentDir = normalize(segment);
vSegmentSDF = (isJoin && isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentOrigin, segmentDir) * pos.w) ;
vReverseSegmentSDF = (isJoin && !isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentEnd, -segmentDir) * pos.w);`);b.stippleEnabled&&(b.draped?d.uniforms.add(new l.FloatPassUniform("worldToScreenRatio",(e,h)=>1/h.screenToPCSRatio)):d.code.add(a.glsl`vec3 segmentCenter = mix((auxpos2 + position) * 0.5, (position + auxpos1) * 0.5, isEndVertex);
float worldToScreenRatio = computeWorldToScreenRatio(segmentCenter);`),d.code.add(a.glsl`float segmentLengthScreenDouble = length(segment);
float segmentLengthScreen = segmentLengthScreenDouble * 0.5;
float discreteWorldToScreenRatio = discretizeWorldToScreenRatio(worldToScreenRatio);
float segmentLengthRender = length(mix(auxpos2 - position, position - auxpos1, isEndVertex));
vStipplePatternStretch = worldToScreenRatio / discreteWorldToScreenRatio;`),b.draped?d.code.add(a.glsl`float segmentLengthPseudoScreen = segmentLengthScreen / pixelRatio * discreteWorldToScreenRatio / worldToScreenRatio;
float startPseudoScreen = uv0.x * discreteWorldToScreenRatio - mix(0.0, segmentLengthPseudoScreen, isEndVertex);`):d.code.add(a.glsl`float startPseudoScreen = mix(uv0.x, uv0.x - segmentLengthRender, isEndVertex) * discreteWorldToScreenRatio;
float segmentLengthPseudoScreen = segmentLengthRender * discreteWorldToScreenRatio;`),d.uniforms.add(new l.FloatPassUniform("stipplePatternPixelSize",e=>x.computePixelSize(e))),d.code.add(a.glsl`float patternLength = lineSize * stipplePatternPixelSize;
vStippleDistanceLimits = computeStippleDistanceLimits(startPseudoScreen, segmentLengthPseudoScreen, segmentLengthScreen, patternLength);
vStippleDistance = mix(vStippleDistanceLimits.x, vStippleDistanceLimits.y, isEndVertex);
if (segmentLengthScreenDouble >= 0.001) {
vec2 stippleDisplacement = pos.xy - segmentOrigin;
float stippleDisplacementFactor = dot(segment, stippleDisplacement) / (segmentLengthScreenDouble * segmentLengthScreenDouble);
vStippleDistance += (stippleDisplacementFactor - isEndVertex) * (vStippleDistanceLimits.y - vStippleDistanceLimits.x);
}
vStippleDistanceLimits *= pos.w;
vStippleDistance *= pos.w;
vStippleDistanceLimits = isJoin ?
vStippleDistanceLimits :
isStartVertex ?
vec2(-1e34, vStippleDistanceLimits.y) :
vec2(vStippleDistanceLimits.x, 1e34);`));d.code.add(a.glsl`
      // Convert back into NDC
      pos.xy = (pos.xy / viewport.zw) * pos.w;

      vColor = getColor();
      vColor.a *= coverage;

      ${b.wireframe&&!b.draped?"pos.z -\x3d 0.001 * pos.w;":""}

      // transform final position to camera space for slicing
      vpos = (inverseProjectionMatrix * pos).xyz;
      gl_Position = pos;
      forwardObjectAndLayerIdColor();
    }
  }
  `);n&&c.include(J.multipassTerrainTest,b);c.include(E.SliceDraw,b);f.include(L.ColorConversion);f.code.add(a.glsl`
  void main() {
    discardBySlice(vpos);
    ${n?"terrainDepthTest(depth);":""}
  `);b.wireframe?f.code.add(a.glsl`vec4 finalColor = vec4(1.0, 0.0, 1.0, 1.0);`):(k&&f.code.add(a.glsl`
      float sdf = min(vSegmentSDF, vReverseSegmentSDF);
      vec2 fragmentPosition = vec2(
        min(sdf, 0.0),
        vLineDistance
      ) * gl_FragCoord.w;

      float fragmentRadius = length(fragmentPosition);
      float fragmentCapSDF = (fragmentRadius - vLineWidth) * 0.5; // Divide by 2 to transform from double pixel scale
      float capCoverage = clamp(0.5 - fragmentCapSDF, 0.0, 1.0);

      if (capCoverage < ${a.glsl.float(q.symbolAlphaCutoff)}) {
        discard;
      }
    `),D?f.code.add(a.glsl`
      vec2 stipplePosition = vec2(
        min(getStippleSDF() * 2.0 - 1.0, 0.0),
        vLineDistanceNorm * gl_FragCoord.w
      );
      float stippleRadius = length(stipplePosition * vLineWidth);
      float stippleCapSDF = (stippleRadius - vLineWidth) * 0.5; // Divide by 2 to transform from double pixel scale
      float stippleCoverage = clamp(0.5 - stippleCapSDF, 0.0, 1.0);
      float stippleAlpha = step(${a.glsl.float(q.symbolAlphaCutoff)}, stippleCoverage);
      `):f.code.add(a.glsl`float stippleAlpha = getStippleAlpha();`),b.output!==g.ShaderOutput.ObjectAndLayerIdColor&&f.code.add(a.glsl`discardByStippleAlpha(stippleAlpha, stippleAlphaColorDiscard);`),f.uniforms.add(new r.Float4PassUniform("intrinsicColor",e=>e.color)),f.code.add(a.glsl`vec4 color = intrinsicColor * vColor;`),b.innerColorEnabled&&(f.uniforms.add(new r.Float4PassUniform("innerColor",e=>e.innerColor??e.color),new l.FloatPassUniform("innerWidth",(e,h)=>e.innerWidth*h.camera.pixelRatio)),
f.code.add(a.glsl`float distToInner = abs(vLineDistance * gl_FragCoord.w) - innerWidth;
float innerAA = clamp(0.5 - distToInner, 0.0, 1.0);
float innerAlpha = innerColor.a + color.a * (1.0 - innerColor.a);
color = mix(color, vec4(innerColor.rgb, innerAlpha), innerAA);`)),f.code.add(a.glsl`vec4 finalColor = blendStipple(color, stippleAlpha);`),b.falloffEnabled&&(f.uniforms.add(new l.FloatPassUniform("falloff",e=>e.falloff)),f.code.add(a.glsl`finalColor.a *= pow(max(0.0, 1.0 - abs(vLineDistanceNorm * gl_FragCoord.w)), falloff);`)));f.code.add(a.glsl`
    ${b.output===g.ShaderOutput.ObjectAndLayerIdColor?a.glsl`finalColor.a = 1.0;`:""}

    if (finalColor.a < ${a.glsl.float(q.symbolAlphaCutoff)}) {
      discard;
    }

    ${b.output===g.ShaderOutput.Alpha?a.glsl`fragColor = vec4(finalColor.a);`:""}
    ${b.output===g.ShaderOutput.Color?a.glsl`fragColor = highlightSlice(finalColor, vpos);`:""}
    ${b.output===g.ShaderOutput.Color&&b.transparencyPassType===P.TransparencyPassType.Color?"fragColor \x3d premultiplyAlpha(fragColor);":""}
    ${b.output===g.ShaderOutput.Highlight?a.glsl`fragColor = vec4(1.0);`:""}
    ${b.output===g.ShaderOutput.Depth?a.glsl`outputDepth(linearDepth);`:""}
    ${b.output===g.ShaderOutput.ObjectAndLayerIdColor?a.glsl`outputObjectAndLayerIdColor();`:""}
  }
  `);return c}const R=Object.freeze(Object.defineProperty({__proto__:null,build:A,ribbonlineNumRoundJoinSubdivisions:1},Symbol.toStringTag,{value:"Module"}));p.RibbonLine=R;p.build=A;p.ribbonlineNumRoundJoinSubdivisions=1});