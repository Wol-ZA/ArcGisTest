/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{c as e,a as o}from"./ForwardLinearDepth.glsl.js";import{S as t}from"./ShaderOutput.js";import{S as a}from"./Slice.glsl.js";import{T as r}from"./Transform.glsl.js";import{V as i}from"./VertexColor.glsl.js";import{O as l}from"./OutputDepth.glsl.js";import{O as n}from"./OutputHighlight.glsl.js";import{C as c,m as s}from"./ColorConversion.glsl.js";import{V as d}from"./VisualVariables.glsl.js";import{s as p}from"./AlphaCutoff.js";import{a as u,c as m}from"./View.glsl.js";import{F as v}from"./Float4PassUniform.js";import{F as f}from"./FloatPassUniform.js";import{g}from"./interfaces3.js";import{S as h}from"./ShaderBuilder.js";import{T as S}from"./TransparencyPassType.js";import{V as C}from"./VertexAttribute.js";var w;!function(e){e[e.Horizontal=0]="Horizontal",e[e.Vertical=1]="Vertical",e[e.Cross=2]="Cross",e[e.ForwardDiagonal=3]="ForwardDiagonal",e[e.BackwardDiagonal=4]="BackwardDiagonal",e[e.DiagonalCross=5]="DiagonalCross",e[e.COUNT=6]="COUNT"}(w||(w={}));const j=.70710678118,y=j,T=Object.freeze(Object.defineProperty({__proto__:null,build:function(T){const x=new h,D=T.multipassEnabled&&(T.output===t.Color||T.output===t.Alpha),{vertex:P,fragment:R,attributes:V,varyings:b}=x;u(P,T),x.include(r,T),x.include(i,T),x.include(d,T),T.draped?P.uniforms.add(new f("worldToScreenRatio",((e,o)=>1/o.screenToPCSRatio))):V.add(C.BOUNDINGRECT,"mat3"),V.add(C.POSITION,"vec3"),V.add(C.UVMAPSPACE,"vec4"),T.vvColor&&V.add(C.COLORFEATUREATTRIBUTE,"float"),b.add("vColor","vec4"),b.add("vpos","vec3"),b.add("vuv","vec2"),D&&b.add("depth","float"),P.uniforms.add(new v("uColor",(e=>e.color)));const $=T.style===w.ForwardDiagonal||T.style===w.BackwardDiagonal||T.style===w.DiagonalCross;$&&P.code.add(g`
      const mat2 rotate45 = mat2(${g.float(j)}, ${g.float(-y)},
                                 ${g.float(y)}, ${g.float(j)});
    `),T.draped||(m(P,T),P.uniforms.add(new f("worldToScreenPerDistanceRatio",((e,o)=>1/o.camera.perScreenPixelRatio))),P.code.add(g`vec3 projectPointToLineSegment(vec3 center, vec3 halfVector, vec3 point) {
float projectedLength = dot(halfVector, point - center) / dot(halfVector, halfVector);
return center + halfVector * clamp(projectedLength, -1.0, 1.0);
}`),P.code.add(g`vec3 intersectRayPlane(vec3 rayDir, vec3 rayOrigin, vec3 planeNormal, vec3 planePoint) {
float d = dot(planeNormal, planePoint);
float t = (d - dot(planeNormal, rayOrigin)) / dot(planeNormal, rayDir);
return rayOrigin + t * rayDir;
}`),P.code.add(g`
      float boundingRectDistanceToCamera() {
        vec3 center = vec3(boundingRect[0][0], boundingRect[0][1], boundingRect[0][2]);
        vec3 halfU = vec3(boundingRect[1][0], boundingRect[1][1], boundingRect[1][2]);
        vec3 halfV = vec3(boundingRect[2][0], boundingRect[2][1], boundingRect[2][2]);
        vec3 n = normalize(cross(halfU, halfV));

        vec3 viewDir = - vec3(view[0][2], view[1][2], view[2][2]);

        float viewAngle = dot(viewDir, n);
        float minViewAngle = ${g.float(.08715574274)};

        if (abs(viewAngle) < minViewAngle) {
          // view direction is (almost) parallel to plane -> clamp it to min angle
          float normalComponent = sign(viewAngle) * minViewAngle - viewAngle;
          viewDir = normalize(viewDir + normalComponent * n);
        }

        // intersect view direction with infinite plane that contains bounding rect
        vec3 planeProjected = intersectRayPlane(viewDir, cameraPosition, n, center);

        // clip to bounds by projecting to u and v line segments individually
        vec3 uProjected = projectPointToLineSegment(center, halfU, planeProjected);
        vec3 vProjected = projectPointToLineSegment(center, halfV, planeProjected);

        // use to calculate the closest point to camera on bounding rect
        vec3 closestPoint = uProjected + vProjected - center;

        return length(closestPoint - cameraPosition);
      }
    `)),P.code.add(g`
    vec2 scaledUV() {
      vec2 uv = uvMapSpace.xy ${$?" * rotate45":""};
      vec2 uvCellOrigin = uvMapSpace.zw ${$?" * rotate45":""};

      ${T.draped?"":g`
            float distanceToCamera = boundingRectDistanceToCamera();
            float worldToScreenRatio = worldToScreenPerDistanceRatio / distanceToCamera;
          `}

      // Logarithmically discretize ratio to avoid jittering
      float step = 0.1;
      float discreteWorldToScreenRatio = log(worldToScreenRatio);
      discreteWorldToScreenRatio = ceil(discreteWorldToScreenRatio / step) * step;
      discreteWorldToScreenRatio = exp(discreteWorldToScreenRatio);

      vec2 uvOffset = mod(uvCellOrigin * discreteWorldToScreenRatio, ${g.float(T.patternSpacing)});
      return uvOffset + (uv * discreteWorldToScreenRatio);
    }
  `);const A=T.output===t.Depth;return A&&(x.include(l,T),e(x),o(x)),P.code.add(g`
    void main(void) {
      vuv = scaledUV();
      vpos = position;
      ${D?"depth = (view * vec4(vpos, 1.0)).z;":""}
      forwardNormalizedVertexColor();
      ${T.hasVertexColors?"vColor *= uColor;":T.vvColor?"vColor = uColor * interpolateVVColor(colorFeatureAttribute);":"vColor = uColor;"}
      gl_Position = ${A?g`transformPositionWithDepth(proj, view, vpos, nearFar, linearDepth);`:g`transformPosition(proj, view, vpos);`}
    }
  `),x.include(a,T),R.include(c),T.draped&&R.uniforms.add(new f("texelSize",((e,o)=>1/o.camera.pixelRatio))),T.output===t.Highlight&&x.include(n,T),D&&x.include(s,T),T.output!==t.Highlight&&(R.code.add(g`
      const float lineWidth = ${g.float(T.lineWidth)};
      const float spacing = ${g.float(T.patternSpacing)};
      const float spacingINV = ${g.float(1/T.patternSpacing)};

      float coverage(float p, float txlSize) {
        p = mod(p, spacing);

        float halfTxlSize = txlSize / 2.0;

        float start = p - halfTxlSize;
        float end = p + halfTxlSize;

        float coverage = (ceil(end * spacingINV) - floor(start * spacingINV)) * lineWidth;
        coverage -= min(lineWidth, mod(start, spacing));
        coverage -= max(lineWidth - mod(end, spacing), 0.0);

        return coverage / txlSize;
      }
    `),T.draped||R.code.add(g`const int maxSamples = 5;
float sampleAA(float p) {
vec2 dxdy = abs(vec2(dFdx(p), dFdy(p)));
float fwidth = dxdy.x + dxdy.y;
ivec2 samples = 1 + ivec2(clamp(dxdy, 0.0, float(maxSamples - 1)));
vec2 invSamples = 1.0 / vec2(samples);
float accumulator = 0.0;
for (int j = 0; j < maxSamples; j++) {
if(j >= samples.y) {
break;
}
for (int i = 0; i < maxSamples; i++) {
if(i >= samples.x) {
break;
}
vec2 step = vec2(i,j) * invSamples - 0.5;
accumulator += coverage(p + step.x * dxdy.x + step.y * dxdy.y, fwidth);
}
}
accumulator /= float(samples.x * samples.y);
return accumulator;
}`)),R.code.add(g`
    void main() {
      discardBySlice(vpos);
      ${D?"terrainDepthTest(depth);":""}
      vec4 color = vColor;
      color = highlightSlice(color, vpos);

      ${T.output!==t.Highlight?g`color.a *= ${function(e){function o(o){return e.draped?g`coverage(vuv.${o}, texelSize)`:g`sampleAA(vuv.${o})`}switch(e.style){case w.ForwardDiagonal:case w.Horizontal:return o("y");case w.BackwardDiagonal:case w.Vertical:return o("x");case w.DiagonalCross:case w.Cross:return g`
        1.0 - (1.0 - ${o("x")}) * (1.0 - ${o("y")})
      `;default:return"0.0"}}(T)};`:""}

      ${T.output===t.ObjectAndLayerIdColor?g`color.a = 1.0;`:""}

      if (color.a < ${g.float(p)}) {
        discard;
      }

      ${T.output===t.Alpha?g`fragColor = vec4(color.a);`:""}

      ${T.output===t.Color?g`fragColor = color; ${T.transparencyPassType===S.Color?"fragColor = premultiplyAlpha(fragColor);":""}`:""}
      ${T.output===t.Highlight?g`outputHighlight();`:""}
      ${T.output===t.Depth?g`outputDepth(linearDepth);`:""};
    }
  `),x}},Symbol.toStringTag,{value:"Module"}));export{T as P,w as S};
