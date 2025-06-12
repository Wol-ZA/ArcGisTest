/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{g as o}from"./interfaces3.js";import{C as e}from"./symbolColorUtils.js";import{I as r}from"./IntegerPassUniform.js";import{V as a}from"./VertexAttribute.js";import{l as t}from"./Material.js";import{c as i}from"./ForwardLinearDepth.glsl.js";import{S as l}from"./ShaderOutput.js";import{S as s}from"./Slice.glsl.js";import{T as d}from"./Transform.glsl.js";import{N as n,c,b as m}from"./VertexNormal.glsl.js";import{O as p}from"./ObjectAndLayerIdColor.glsl.js";import{T as u}from"./EvaluateAmbientLighting.glsl.js";import{O as f}from"./OutputDepth.glsl.js";import{O as v}from"./OutputHighlight.glsl.js";import{V as x}from"./VisualVariables.glsl.js";import{D as h}from"./DiscardOrAdjustAlphaBlend.glsl.js";import{U as C,B as g}from"./ShaderBuilder.js";import{F as y}from"./FloatPassUniform.js";import{A as M}from"./basicInterfaces.js";import{a as b}from"./View.glsl.js";import{T as O}from"./Texture2DPassUniform.js";import{C as j}from"./ColorConversion.glsl.js";function A(e){e.vertex.code.add(o`vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
vec3 camToVert = posWorld - camPosWorld;
bool isBackface = dot(camToVert, normalWorld) > 0.0;
if (isBackface) {
posClip.z += 0.0000003 * posClip.w;
}
return posClip;
}`)}function w(r){r.vertex.code.add(o`
    vec4 decodeSymbolColor(vec4 symbolColor, out int colorMixMode) {
      float symbolAlpha = 0.0;

      const float maxTint = 85.0;
      const float maxReplace = 170.0;
      const float scaleAlpha = 3.0;

      if (symbolColor.a > maxReplace) {
        colorMixMode = ${o.int(e.Multiply)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxReplace);
      } else if (symbolColor.a > maxTint) {
        colorMixMode = ${o.int(e.Replace)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxTint);
      } else if (symbolColor.a > 0.0) {
        colorMixMode = ${o.int(e.Tint)};
        symbolAlpha = scaleAlpha * symbolColor.a;
      } else {
        colorMixMode = ${o.int(e.Multiply)};
        symbolAlpha = 0.0;
      }

      return vec4(symbolColor.r, symbolColor.g, symbolColor.b, symbolAlpha);
    }
  `)}function T(e,i){i.hasSymbolColors?(e.include(w),e.attributes.add(a.SYMBOLCOLOR,"vec4"),e.varyings.add("colorMixMode","mediump float"),e.vertex.code.add(o`int symbolColorMixMode;
vec4 getSymbolColor() {
return decodeSymbolColor(symbolColor, symbolColorMixMode) * 0.003921568627451;
}
void forwardColorMixMode() {
colorMixMode = float(symbolColorMixMode) + 0.5;
}`)):(e.fragment.uniforms.add(new r("colorMixMode",(o=>t[o.colorMixMode]))),e.vertex.code.add(o`vec4 getSymbolColor() { return vec4(1.0); }
void forwardColorMixMode() {}`))}class S extends C{constructor(o,e){super(o,"float",g.Draw,((r,a,t)=>r.setUniform1f(o,e(a,t))))}}function V(o,e){$(o,e,new y("textureAlphaCutoff",(o=>o.textureAlphaCutoff)))}function I(o,e){$(o,e,new S("textureAlphaCutoff",(o=>o.textureAlphaCutoff)))}function $(e,r,a){const t=e.fragment;switch(r.alphaDiscardMode!==M.Mask&&r.alphaDiscardMode!==M.MaskBlend||t.uniforms.add(a),r.alphaDiscardMode){case M.Blend:return e.include(h);case M.Opaque:t.code.add(o`void discardOrAdjustAlpha(inout vec4 color) {
color.a = 1.0;
}`);break;case M.Mask:t.code.add(o`#define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } else { color.a = 1.0; } }`);break;case M.MaskBlend:e.fragment.code.add(o`#define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } }`)}}function D(e,r){const{vertex:a,fragment:t}=e,h=r.hasColorTexture&&r.alphaDiscardMode!==M.Opaque;switch(r.output){case l.Depth:case l.Shadow:case l.ShadowHighlight:case l.ShadowExcludeHighlight:case l.ObjectAndLayerIdColor:b(a,r),e.include(d,r),e.include(u,r),e.include(x,r),e.include(f,r),e.include(s,r),e.include(p,r),i(e),e.varyings.add("depth","float"),h&&t.uniforms.add(new O("tex",(o=>o.texture))),a.code.add(o`void main(void) {
vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
forwardTextureCoordinates();
forwardObjectAndLayerIdColor();
}`),e.include(V,r),t.code.add(o`
          void main(void) {
            discardBySlice(vpos);
            ${h?o`
                    vec4 texColor = texture(tex, ${r.hasColorTextureTransform?o`colorUV`:o`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
            ${r.output===l.ObjectAndLayerIdColor?o`outputObjectAndLayerIdColor();`:o`outputDepth(depth);`}
          }
        `);break;case l.Normal:{b(a,r),e.include(d,r),e.include(n,r),e.include(c,r),e.include(u,r),e.include(x,r),h&&t.uniforms.add(new O("tex",(o=>o.texture))),r.normalType===m.ScreenDerivative&&e.varyings.add("vPositionView","vec3");const i=r.normalType===m.Attribute||r.normalType===m.Compressed;a.code.add(o`
          void main(void) {
            vpos = getVertexInLocalOriginSpace();

            ${i?o`vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:o`
                  // Get vertex position in camera space for screen-space derivative normals
                  vPositionView = (view * vec4(vpos, 1.0)).xyz;
                `}
            vpos = subtractOrigin(vpos);
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, vpos);
            forwardTextureCoordinates();
          }
        `),e.include(s,r),e.include(V,r),t.code.add(o`
          void main() {
            discardBySlice(vpos);
            ${h?o`
                    vec4 texColor = texture(tex, ${r.hasColorTextureTransform?o`colorUV`:o`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}

            ${r.normalType===m.ScreenDerivative?o`vec3 normal = screenDerivativeNormal(vPositionView);`:o`
                  vec3 normal = normalize(vNormalWorld);
                  if (gl_FrontFacing == false){
                    normal = -normal;
                  }`}
            fragColor = vec4(0.5 + 0.5 * normal, 1.0);
          }
        `);break}case l.Highlight:b(a,r),e.include(d,r),e.include(u,r),e.include(x,r),h&&t.uniforms.add(new O("tex",(o=>o.texture))),a.code.add(o`void main(void) {
vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();
}`),e.include(s,r),e.include(V,r),e.include(v,r),t.code.add(o`
          void main() {
            discardBySlice(vpos);
            ${h?o`
                    vec4 texColor = texture(tex, ${r.hasColorTextureTransform?o`colorUV`:o`vuv0`});
                    discardOrAdjustAlpha(texColor);`:""}
            outputHighlight();
          }
        `)}}function P(r){r.include(j),r.code.add(o`
    vec3 mixExternalColor(vec3 internalColor, vec3 textureColor, vec3 externalColor, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      vec3 internalMixed = internalColor * textureColor;
      vec3 allMixed = internalMixed * externalColor;

      if (mode == ${o.int(e.Multiply)}) {
        return allMixed;
      }
      if (mode == ${o.int(e.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${o.int(e.Replace)}) {
        return externalColor;
      }

      // tint (or something invalid)
      float vIn = rgb2v(internalMixed);
      vec3 hsvTint = rgb2hsv(externalColor);
      vec3 hsvOut = vec3(hsvTint.x, hsvTint.y, vIn * hsvTint.z);
      return hsv2rgb(hsvOut);
    }

    float mixExternalOpacity(float internalOpacity, float textureOpacity, float externalOpacity, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      float internalMixed = internalOpacity * textureOpacity;
      float allMixed = internalMixed * externalOpacity;

      if (mode == ${o.int(e.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${o.int(e.Replace)}) {
        return externalOpacity;
      }

      // multiply or tint (or something invalid)
      return allMixed;
    }
  `)}export{w as D,S as F,P as M,A as O,T as S,I as a,V as b,D as c};
