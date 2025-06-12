/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{f as e,o}from"./vec2.js";import{c as i}from"./vec2f64.js";import{Z as r}from"./vec4f64.js";import{S as t}from"./ShaderOutput.js";import{S as l}from"./Slice.glsl.js";import{O as a}from"./ObjectAndLayerIdColor.glsl.js";import{A as s,a as c,b as n}from"./HUDVisibility.glsl.js";import{m as d}from"./MultipassGeometryTest.glsl.js";import{m as p,C as u}from"./ColorConversion.glsl.js";import{g as f}from"./interfaces3.js";import{o as v,u as m}from"./OutputHighlight.glsl.js";import{V as g}from"./VisualVariables.glsl.js";import{s as x,d as C}from"./AlphaCutoff.js";import{R as b}from"./ReadLinearDepth.glsl.js";import{S as j,c as P,b as h}from"./VerticalOffset.glsl.js";import{b as S}from"./View.glsl.js";import{F as z}from"./Float2PassUniform.js";import{F as A}from"./Float4PassUniform.js";import{F as w}from"./FloatPassUniform.js";import{S as y}from"./ShaderBuilder.js";import{T as O}from"./Texture2DPassUniform.js";import{T as $}from"./TransparencyPassType.js";import{V as D}from"./VertexAttribute.js";function F(e,o){const{vertex:i,fragment:r}=e;i.include(s),o.multipassEnabled&&(i.include(d),e.varyings.add("depth","float")),i.code.add(f`
  void main(void) {
    vec4 posProjCenter;
    if (dot(position, position) > 0.0) {
      // Render single point to center of the pixel to avoid subpixel filtering to affect the marker color
      ProjectHUDAux projectAux;
      vec4 posProj = projectPositionHUD(projectAux);
      posProjCenter = alignToPixelCenter(posProj, viewport.zw);

      ${o.multipassEnabled?f`
        // Don't draw vertices behind geometry
        if(geometryDepthTest(.5 + .5 * posProjCenter.xy / posProjCenter.w, projectAux.posView.z)){
          posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
        }`:""}

      ${o.multipassEnabled?"depth = projectAux.posView.z;":""}
      vec3 vpos = projectAux.posModel;
      if (rejectBySlice(vpos)) {
        // Project out of clip space
        posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
      }

    } else {
      // Project out of clip space
      posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
    }

    gl_Position = posProjCenter;
    gl_PointSize = 1.0;
  }
  `),e.include(p,o),r.code.add(f`
  void main() {
    fragColor = vec4(1);
    ${o.multipassEnabled?f`
        if(terrainDepthTest(depth)) {
          fragColor.g = 0.5;
        }`:""}
  }
  `)}function T(e){return e.outlineColor[3]>0&&e.outlineSize>0}function B(i,r=V){var t,l,a;return i.textureIsSignedDistanceField?(t=i.anchorPosition,a=r,null!=(l=i.distanceFieldBoundingBox)?e(a,t[0]*(l[2]-l[0])+l[0],t[1]*(l[3]-l[1])+l[1]):e(a,0,0)):o(r,i.anchorPosition),r}const V=i(),E=Object.freeze(Object.defineProperty({__proto__:null,build:function(o){const i=new y,d=o.signedDistanceFieldEnabled;if(i.include(c,o),i.include(l,o),o.occlusionPass)return i.include(F,o),i;const{vertex:p,fragment:E}=i;i.include(j),E.include(b),E.include(u),i.include(g,o),i.include(a,o),i.include(n),i.varyings.add("vcolor","vec4"),i.varyings.add("vtc","vec2"),i.varyings.add("vsize","vec2"),i.varyings.add("voccluded","float"),p.uniforms.add(new A("viewport",((e,o)=>o.camera.fullViewport)),new z("screenOffset",((o,i)=>e(V,2*o.screenOffset[0]*i.camera.pixelRatio,2*o.screenOffset[1]*i.camera.pixelRatio))),new z("anchorPosition",(e=>B(e))),new A("materialColor",(e=>e.color))),S(p),d&&(p.uniforms.add(new A("outlineColor",(e=>e.outlineColor))),E.uniforms.add(new A("outlineColor",(e=>T(e)?e.outlineColor:r)),new w("outlineSize",(e=>T(e)?e.outlineSize:0)))),o.pixelSnappingEnabled&&p.include(s),o.hasScreenSizePerspective&&(P(p),h(p)),o.debugDrawLabelBorder&&i.varyings.add("debugBorderCoords","vec4"),i.attributes.add(D.UV0,"vec2"),i.attributes.add(D.COLOR,"vec4"),i.attributes.add(D.SIZE,"vec2"),i.attributes.add(D.FEATUREATTRIBUTE,"vec4"),p.code.add(f`
    void main(void) {
      ProjectHUDAux projectAux;
      vec4 posProj = projectPositionHUD(projectAux);
      forwardObjectAndLayerIdColor();

      if (rejectBySlice(projectAux.posModel)) {
        // Project outside of clip plane
        gl_Position = vec4(1e038, 1e038, 1e038, 1.0);
        return;
      }
      vec2 inputSize;
      ${o.hasScreenSizePerspective?f`
            inputSize = screenSizePerspectiveScaleVec2(size, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
            vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);
         `:f`
            inputSize = size;
            vec2 screenOffsetScaled = screenOffset;`}

      ${o.vvSize?"inputSize *= vvScale(featureAttribute).xx;":""}

      vec2 combinedSize = inputSize * pixelRatio;
      vec4 quadOffset = vec4(0.0);
      bool visible = testHUDVisibility(posProj);
      voccluded = visible ? 0.0 : 1.0;
    `);const H=f`vec2 uv01 = floor(uv0);
vec2 uv = uv0 - uv01;
quadOffset.xy = ((uv01 - anchorPosition) * 2.0 * combinedSize + screenOffsetScaled) / viewport.zw * posProj.w;`,L=o.pixelSnappingEnabled?d?f`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:f`posProj += quadOffset;
if (inputSize.x == size.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:f`posProj += quadOffset;`;p.code.add(f`
    ${o.occlusionTestEnabled?"if (visible) {":""}
    ${H}
    ${o.vvColor?"vcolor = interpolateVVColor(featureAttribute.y) * materialColor;":"vcolor = color / 255.0 * materialColor;"}

    ${o.output===t.ObjectAndLayerIdColor?f`vcolor.a = 1.0;`:""}

    bool alphaDiscard = vcolor.a < ${f.float(x)};
    ${d?`alphaDiscard = alphaDiscard && outlineColor.a < ${f.float(x)};`:""}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${L}
      gl_Position = posProj;
    }

    vtc = uv;

    ${o.debugDrawLabelBorder?"debugBorderCoords = vec4(uv01, 1.5 / combinedSize);":""}
    vsize = inputSize;
    ${o.occlusionTestEnabled?f`} else { vtc = vec2(0.0);
      ${o.debugDrawLabelBorder?"debugBorderCoords = vec4(0.5, 0.5, 1.5 / combinedSize);}":"}"}`:""}
  }
  `),E.uniforms.add(new O("tex",(e=>e.texture)));const U=o.debugDrawLabelBorder?f`(isBorder > 0.0 ? 0.0 : ${f.float(C)})`:f.float(C),R=f`
    ${o.debugDrawLabelBorder?f`
      float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));`:""}

    ${o.sampleSignedDistanceFieldTexelCenter?f`
      // Attempt to sample texel centers to avoid that thin cross outlines
      // disappear with large symbol sizes.
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/7058#issuecomment-603041
      float txSize = float(textureSize(tex, 0).x);
      float texelSize = 1.0 / txSize;

      // Calculate how much we have to add/subtract to/from each texel to reach the size of an onscreen pixel
      vec2 scaleFactor = (vsize - txSize) * texelSize;
      vec2 samplePos = vtc + (vec2(1.0, -1.0) * texelSize) * scaleFactor;
      `:f`
      vec2 samplePos = vtc;
      `}

    ${d?f`
      vec4 fillPixelColor = vcolor;

      // Get distance and map it into [-0.5, 0.5]
      float d = rgba2float(texture(tex, samplePos)) - 0.5;

      // Distance in output units (i.e. pixels)
      float dist = d * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - dist, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(dist) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < ${U} ||
          fillPixelColor.a + outlinePixelColor.a < ${f.float(x)}
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
          vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        fragColor = vec4(compositeColor, compositeAlpha);
      } else {
        if (fillAlphaFactor < ${U}) {
          discard;
        }

        fragColor = premultiplyAlpha(fillPixelColor);
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-dist/vsize.x*2.0, 0.0, 1.0), clamp(dist/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `:f`
          vec4 texColor = texture(tex, vtc, -0.5);
          if (texColor.a < ${U}) {
            discard;
          }
          fragColor = texColor * premultiplyAlpha(vcolor);
          `}

    // Draw debug border with transparency, so that original texels along border are still partially visible
    ${o.debugDrawLabelBorder?f`fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);`:""}
  `;switch(o.output){case t.Color:E.code.add(f`
        void main() {
          ${R}
          ${o.transparencyPassType===$.FrontFace?"fragColor.rgb /= fragColor.a;":""}
        }`);break;case t.Alpha:E.code.add(f`
        void main() {
          ${R}
          fragColor = vec4(fragColor.a);
        }`);break;case t.ObjectAndLayerIdColor:E.code.add(f`
        void main() {
          ${R}
          outputObjectAndLayerIdColor();
        }`);break;case t.Highlight:E.constants.add("occludedHighlightFlag","vec4",v).add("unoccludedHighlightFlag","vec4",m),E.code.add(f`
        void main() {
          ${R}
          if (voccluded == 1.0) {
            fragColor = occludedHighlightFlag;
          } else {
            fragColor = unoccludedHighlightFlag;
          }
        }`)}return i},calculateAnchorPosForRendering:B},Symbol.toStringTag,{value:"Module"}));export{E as H,B as c};
