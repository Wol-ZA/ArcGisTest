/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{a as e,b as t}from"./ForwardLinearDepth.glsl.js";import{S as o}from"./ShaderOutput.js";import{S as i}from"./Slice.glsl.js";import{O as r}from"./ObjectAndLayerIdColor.glsl.js";import{R as n,M as a,a as s}from"./MarkerSizing.glsl.js";import{O as l}from"./OutputDepth.glsl.js";import{R as p}from"./ReadLinearDepth.glsl.js";import{c as d,b as c,a as f}from"./View.glsl.js";import{F as m}from"./Float4PassUniform.js";import{F as v}from"./FloatPassUniform.js";import{g as u}from"./interfaces3.js";import{T as h}from"./Texture2DPassUniform.js";import{p as g}from"./floatRGBA.js";import{g as S}from"../core/Accessor.js";import{P as D,T as x}from"./enums3.js";import{T as y,a as C}from"./Texture.js";import{s as L}from"./vec4.js";import{Z as b,a as P}from"./vec4f64.js";import{m as R,C as A}from"./ColorConversion.glsl.js";import{P as w}from"./PiUtils.glsl.js";import{s as T}from"./AlphaCutoff.js";import{F as j}from"./Float2PassUniform.js";import{M as F}from"./Matrix4PassUniform.js";import{S as E}from"./ShaderBuilder.js";import{T as O}from"./TransparencyPassType.js";import{V as z}from"./VertexAttribute.js";import{_}from"./tslib.es6.js";import{p as W}from"./ShaderTechniqueConfiguration.js";import{D as N}from"./Texture2.js";class V{constructor(e,t,o){this._createTexture=e,this._parametersKey=t,this._repository=new Map,this._orphanCache=o.newCache(`procedural-texture-repository:${S()}`,(e=>e.dispose()))}destroy(){for(const[e,{texture:t}]of this._repository)t.dispose();this._repository.clear(),this._orphanCache.destroy()}swap(e,t=null){const o=this._acquire(e);return this.release(t),o}release(e){if(null==e)return;const t=this._parametersKey(e),o=this._repository.get(t);if(o&&(o.refCount--,0===o.refCount)){this._repository.delete(t);const{texture:e}=o,i=e.gpuMemoryUsage;this._orphanCache.put(t,e,i)}}_acquire(e){if(null==e)return null;const t=this._parametersKey(e),o=this._repository.get(t);if(o)return o.refCount++,o.texture;const i=this._orphanCache.pop(t)??this._createTexture(e),r=new U(i);return this._repository.set(t,r),i}}class U{constructor(e){this.texture=e,this.refCount=1}}function I(e,t){return new V((t=>{const{encodedData:o,textureSize:i}=function(e){const t=$(e),o=1/e.pixelRatio,i=M(e),r=B(e),n=(Math.floor(.5*(r-1))+.5)*o,a=[];let s=1;for(const e of t){for(let t=0;t<e;t++){const i=s*(Math.min(t,e-1-t)+.5)*o/n*.5+.5;a.push(i)}s=-s}const l=Math.round(t[0]/2),p=[...a.slice(l),...a.slice(0,l)],d=new Uint8Array(4*i);let c=0;for(const e of p)g(e,d,c),c+=4;return{encodedData:d,textureSize:i}}(t),r=new y;return r.internalFormat=D.RGBA,r.width=i,r.height=1,r.wrapMode=x.REPEAT,new C(e,r,o)}),(e=>`${e.pattern.join(",")}-r${e.pixelRatio}`),t)}function $(e){return e.pattern.map((t=>Math.round(t*e.pixelRatio)))}function M(e){if(null==e)return 1;const t=$(e);return Math.floor(t.reduce(((e,t)=>e+t)))}function B(e){return $(e).reduce(((e,t)=>Math.max(e,t)))}const k=P();function J(e,t){e.constants.add("stippleAlphaColorDiscard","float",.001),e.constants.add("stippleAlphaHighlightDiscard","float",.5),t.stippleEnabled?function(e,t){const o=!(t.draped&&t.stipplePreferContinuous),{vertex:i,fragment:r}=e;r.include(p),t.draped||(d(i,t),i.uniforms.add(new v("worldToScreenPerDistanceRatio",((e,t)=>1/t.camera.perScreenPixelRatio))),i.code.add(u`float computeWorldToScreenRatio(vec3 segmentCenter) {
float segmentDistanceToCamera = length(segmentCenter - cameraPosition);
return worldToScreenPerDistanceRatio / segmentDistanceToCamera;
}`)),e.varyings.add("vStippleDistance","float"),e.varyings.add("vStippleDistanceLimits","vec2"),e.varyings.add("vStipplePatternStretch","float"),i.code.add(u`
    float discretizeWorldToScreenRatio(float worldToScreenRatio) {
      float step = ${G};

      float discreteWorldToScreenRatio = log(worldToScreenRatio);
      discreteWorldToScreenRatio = ceil(discreteWorldToScreenRatio / step) * step;
      discreteWorldToScreenRatio = exp(discreteWorldToScreenRatio);
      return discreteWorldToScreenRatio;
    }
  `),i.code.add(u`vec2 computeStippleDistanceLimits(float startPseudoScreen, float segmentLengthPseudoScreen, float segmentLengthScreen, float patternLength) {`),i.code.add(u`
    if (segmentLengthPseudoScreen >= ${o?"patternLength":"1e4"}) {
  `),c(i),i.code.add(u`float repetitions = segmentLengthScreen / (patternLength * pixelRatio);
float flooredRepetitions = max(1.0, floor(repetitions + 0.5));
float segmentLengthScreenRounded = flooredRepetitions * patternLength;
float stretch = repetitions / flooredRepetitions;
vStipplePatternStretch = max(0.75, stretch);
return vec2(0.0, segmentLengthScreenRounded);
}
return vec2(startPseudoScreen, startPseudoScreen + segmentLengthPseudoScreen);
}`),r.uniforms.add(new h("stipplePatternTexture",(e=>e.stippleTexture)),new v("stipplePatternSDFNormalizer",(e=>{return(t=e.stipplePattern)?(Math.floor(.5*(B(t)-1))+.5)/t.pixelRatio:1;var t})),new v("stipplePatternPixelSizeInv",(e=>1/H(e)))),r.code.add(u`float getStippleSDF(out bool isClamped) {
float stippleDistanceClamped = clamp(vStippleDistance, vStippleDistanceLimits.x, vStippleDistanceLimits.y);
vec2 aaCorrectedLimits = vStippleDistanceLimits + vec2(1.0, -1.0) / gl_FragCoord.w;
isClamped = vStippleDistance < aaCorrectedLimits.x || vStippleDistance > aaCorrectedLimits.y;
float u = stippleDistanceClamped * gl_FragCoord.w * stipplePatternPixelSizeInv * vLineSizeInv;
u = fract(u);
float encodedSDF = rgba2float(texture(stipplePatternTexture, vec2(u, 0.5)));
float sdf = (encodedSDF * 2.0 - 1.0) * stipplePatternSDFNormalizer;
return (sdf - 0.5) * vStipplePatternStretch + 0.5;
}
float getStippleSDF() {
bool ignored;
return getStippleSDF(ignored);
}
float getStippleAlpha() {
bool isClamped;
float stippleSDF = getStippleSDF(isClamped);
float antiAliasedResult = clamp(stippleSDF * vLineWidth + 0.5, 0.0, 1.0);
return isClamped ? floor(antiAliasedResult + 0.5) : antiAliasedResult;
}`),t.stippleOffColorEnabled?(r.uniforms.add(new m("stippleOffColor",(e=>{return null==(t=e.stippleOffColor)?b:4===t.length?t:L(k,t[0],t[1],t[2],1);var t}))),r.code.add(u`#define discardByStippleAlpha(stippleAlpha, threshold) {}
#define blendStipple(color, stippleAlpha) mix(color, stippleOffColor, stippleAlpha)`)):r.code.add(u`#define discardByStippleAlpha(stippleAlpha, threshold) if (stippleAlpha < threshold) { discard; }
#define blendStipple(color, stippleAlpha) vec4(color.rgb, color.a * stippleAlpha)`)}(e,t):function(e){e.fragment.code.add(u`float getStippleAlpha() { return 1.0; }
#define discardByStippleAlpha(_stippleAlpha_, _threshold_) {}
#define blendStipple(color, _stippleAlpha_) color`)}(e)}function H(e){const t=e.stipplePattern;return t?M(e.stipplePattern)/t.pixelRatio:1}const G=u.float(.4);var q;!function(e){e[e.BUTT=0]="BUTT",e[e.SQUARE=1]="SQUARE",e[e.ROUND=2]="ROUND",e[e.COUNT=3]="COUNT"}(q||(q={}));class K extends N{constructor(){super(...arguments),this.output=o.Color,this.capType=q.BUTT,this.transparencyPassType=O.NONE,this.occluder=!1,this.hasSlicePlane=!1,this.hasPolygonOffset=!1,this.writeDepth=!1,this.draped=!1,this.stippleEnabled=!1,this.stippleOffColorEnabled=!1,this.stipplePreferContinuous=!0,this.roundJoins=!1,this.applyMarkerOffset=!1,this.vvSize=!1,this.vvColor=!1,this.vvOpacity=!1,this.falloffEnabled=!1,this.innerColorEnabled=!1,this.hasOccludees=!1,this.multipassEnabled=!1,this.cullAboveGround=!1,this.wireframe=!1,this.objectAndLayerIdColorInstanced=!1}}_([W({count:o.COUNT})],K.prototype,"output",void 0),_([W({count:q.COUNT})],K.prototype,"capType",void 0),_([W({count:O.COUNT})],K.prototype,"transparencyPassType",void 0),_([W()],K.prototype,"occluder",void 0),_([W()],K.prototype,"hasSlicePlane",void 0),_([W()],K.prototype,"hasPolygonOffset",void 0),_([W()],K.prototype,"writeDepth",void 0),_([W()],K.prototype,"draped",void 0),_([W()],K.prototype,"stippleEnabled",void 0),_([W()],K.prototype,"stippleOffColorEnabled",void 0),_([W()],K.prototype,"stipplePreferContinuous",void 0),_([W()],K.prototype,"roundJoins",void 0),_([W()],K.prototype,"applyMarkerOffset",void 0),_([W()],K.prototype,"vvSize",void 0),_([W()],K.prototype,"vvColor",void 0),_([W()],K.prototype,"vvOpacity",void 0),_([W()],K.prototype,"falloffEnabled",void 0),_([W()],K.prototype,"innerColorEnabled",void 0),_([W()],K.prototype,"hasOccludees",void 0),_([W()],K.prototype,"multipassEnabled",void 0),_([W()],K.prototype,"cullAboveGround",void 0),_([W()],K.prototype,"wireframe",void 0),_([W()],K.prototype,"objectAndLayerIdColorInstanced",void 0),_([W({constValue:!1})],K.prototype,"occlusionPass",void 0),_([W({constValue:!0})],K.prototype,"hasVvInstancing",void 0),_([W({constValue:!0})],K.prototype,"hasSliceTranslatedView",void 0);const Q=1,X=Object.freeze(Object.defineProperty({__proto__:null,build:function(p){const d=new E,{vertex:h,fragment:g}=d,S=p.multipassEnabled&&(p.output===o.Color||p.output===o.Alpha);d.include(w),d.include(n,p),d.include(J,p);const D=p.applyMarkerOffset&&!p.draped;D&&(h.uniforms.add(new v("markerScale",(e=>e.markerScale))),d.include(a,{space:s.World,draped:!1})),p.output===o.Depth&&d.include(l,p),d.include(r,p),f(h,p),h.uniforms.add(new F("inverseProjectionMatrix",((e,t)=>t.camera.inverseProjectionMatrix)),new j("nearFar",((e,t)=>t.camera.nearFar)),new v("miterLimit",(e=>"miter"!==e.join?0:e.miterLimit)),new m("viewport",((e,t)=>t.camera.fullViewport))),h.constants.add("LARGE_HALF_FLOAT","float",65500),d.attributes.add(z.POSITION,"vec3"),d.attributes.add(z.SUBDIVISIONFACTOR,"float"),d.attributes.add(z.UV0,"vec2"),d.attributes.add(z.AUXPOS1,"vec3"),d.attributes.add(z.AUXPOS2,"vec3"),d.varyings.add("vColor","vec4"),d.varyings.add("vpos","vec3"),e(d),S&&d.varyings.add("depth","float");const x=p.stippleEnabled;x&&d.varyings.add("vLineSizeInv","float");const y=p.capType===q.ROUND,C=x||y;C&&d.varyings.add("vLineWidth","float");const L=p.innerColorEnabled||y;L&&d.varyings.add("vLineDistance","float");const b=p.stippleEnabled&&y,P=p.falloffEnabled||b;P&&d.varyings.add("vLineDistanceNorm","float"),y&&(d.varyings.add("vSegmentSDF","float"),d.varyings.add("vReverseSegmentSDF","float")),h.code.add(u`#define PERPENDICULAR(v) vec2(v.y, -v.x);
float interp(float ncp, vec4 a, vec4 b) {
return (-ncp - a.z) / (b.z - a.z);
}
vec2 rotate(vec2 v, float a) {
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, -s, s, c);
return m * v;
}`),h.code.add(u`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
return posNdc;
}`),t(d),h.code.add(u`
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

      ${S?"depth = pos.z;":""}
      linearDepth = calculateLinearDepth(nearFar,pos.z);

      pos = projectAndScale(pos);
      next = projectAndScale(next);
      prev = projectAndScale(prev);
    }
  `),c(h),h.code.add(u`
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

      ${C?u`vLineWidth = lineWidth;`:""}
      ${x?u`vLineSizeInv = 1.0 / lineSize;`:""}

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
  `),D&&h.code.add(u`vec4 other = isStartVertex ? next : prev;
bool markersHidden = areWorldMarkersHidden(pos, other);
if(!isJoin && !markersHidden) {
pos.xyz += normalize(other.xyz - pos.xyz) * getWorldMarkerSize(pos) * 0.5;
}`),h.code.add(u`clipAndTransform(pos, prev, next, isStartVertex);
vec2 left = (pos.xy - prev.xy);
vec2 right = (next.xy - pos.xy);
float leftLen = length(left);
float rightLen = length(right);`),(p.stippleEnabled||y)&&h.code.add(u`
      float isEndVertex = float(!isStartVertex);
      vec2 segmentOrigin = mix(pos.xy, prev.xy, isEndVertex);
      vec2 segment = mix(right, left, isEndVertex);
      ${y?u`vec2 segmentEnd = mix(next.xy, pos.xy, isEndVertex);`:""}
    `),h.code.add(u`left = (leftLen > 0.001) ? left/leftLen : vec2(0.0, 0.0);
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
if (isOutside && (displacementLen > miterLimit * lineWidth)) {`),p.roundJoins?h.code.add(u`
        vec2 startDir = leftLen < 0.001 ? right : left;
        startDir = PERPENDICULAR(startDir);

        vec2 endDir = rightLen < 0.001 ? left : right;
        endDir = PERPENDICULAR(endDir);

        float factor = ${p.stippleEnabled?u`min(1.0, subdivisionFactor * ${u.float(1.5)})`:u`subdivisionFactor`};

        float rotationAngle = acos(clamp(dot(startDir, endDir), -1.0, 1.0));
        joinDisplacementDir = rotate(startDir, -sign(uv0.y) * factor * rotationAngle);
      `):h.code.add(u`if (leftLen < 0.001) {
joinDisplacementDir = right;
}
else if (rightLen < 0.001) {
joinDisplacementDir = left;
}
else {
joinDisplacementDir = (isStartVertex || subdivisionFactor > 0.0) ? right : left;
}
joinDisplacementDir = PERPENDICULAR(joinDisplacementDir);`);const _=p.capType!==q.BUTT;return h.code.add(u`
        displacementLen = lineWidth;
      }
    } else {
      // CAP handling ---------------------------------------------------
      joinDisplacementDir = isStartVertex ? right : left;
      joinDisplacementDir = PERPENDICULAR(joinDisplacementDir);

      ${_?u`capDisplacementDir = isStartVertex ? -right : left;`:""}
    }
  `),h.code.add(u`
    // Displacement (in pixels) caused by join/or cap
    vec2 dpos = joinDisplacementDir * sign(uv0.y) * displacementLen + capDisplacementDir * displacementLen;

    ${P||L?u`float lineDistNorm = sign(uv0.y) * pos.w;`:""}

    ${L?u`vLineDistance = lineWidth * lineDistNorm;`:""}
    ${P?u`vLineDistanceNorm = lineDistNorm;`:""}

    pos.xy += dpos;
  `),y&&h.code.add(u`vec2 segmentDir = normalize(segment);
vSegmentSDF = (isJoin && isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentOrigin, segmentDir) * pos.w) ;
vReverseSegmentSDF = (isJoin && !isStartVertex) ? LARGE_HALF_FLOAT : (dot(pos.xy - segmentEnd, -segmentDir) * pos.w);`),p.stippleEnabled&&(p.draped?h.uniforms.add(new v("worldToScreenRatio",((e,t)=>1/t.screenToPCSRatio))):h.code.add(u`vec3 segmentCenter = mix((auxpos2 + position) * 0.5, (position + auxpos1) * 0.5, isEndVertex);
float worldToScreenRatio = computeWorldToScreenRatio(segmentCenter);`),h.code.add(u`float segmentLengthScreenDouble = length(segment);
float segmentLengthScreen = segmentLengthScreenDouble * 0.5;
float discreteWorldToScreenRatio = discretizeWorldToScreenRatio(worldToScreenRatio);
float segmentLengthRender = length(mix(auxpos2 - position, position - auxpos1, isEndVertex));
vStipplePatternStretch = worldToScreenRatio / discreteWorldToScreenRatio;`),p.draped?h.code.add(u`float segmentLengthPseudoScreen = segmentLengthScreen / pixelRatio * discreteWorldToScreenRatio / worldToScreenRatio;
float startPseudoScreen = uv0.x * discreteWorldToScreenRatio - mix(0.0, segmentLengthPseudoScreen, isEndVertex);`):h.code.add(u`float startPseudoScreen = mix(uv0.x, uv0.x - segmentLengthRender, isEndVertex) * discreteWorldToScreenRatio;
float segmentLengthPseudoScreen = segmentLengthRender * discreteWorldToScreenRatio;`),h.uniforms.add(new v("stipplePatternPixelSize",(e=>H(e)))),h.code.add(u`float patternLength = lineSize * stipplePatternPixelSize;
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
vec2(vStippleDistanceLimits.x, 1e34);`)),h.code.add(u`
      // Convert back into NDC
      pos.xy = (pos.xy / viewport.zw) * pos.w;

      vColor = getColor();
      vColor.a *= coverage;

      ${p.wireframe&&!p.draped?"pos.z -= 0.001 * pos.w;":""}

      // transform final position to camera space for slicing
      vpos = (inverseProjectionMatrix * pos).xyz;
      gl_Position = pos;
      forwardObjectAndLayerIdColor();
    }
  }
  `),S&&d.include(R,p),d.include(i,p),g.include(A),g.code.add(u`
  void main() {
    discardBySlice(vpos);
    ${S?"terrainDepthTest(depth);":""}
  `),p.wireframe?g.code.add(u`vec4 finalColor = vec4(1.0, 0.0, 1.0, 1.0);`):(y&&g.code.add(u`
      float sdf = min(vSegmentSDF, vReverseSegmentSDF);
      vec2 fragmentPosition = vec2(
        min(sdf, 0.0),
        vLineDistance
      ) * gl_FragCoord.w;

      float fragmentRadius = length(fragmentPosition);
      float fragmentCapSDF = (fragmentRadius - vLineWidth) * 0.5; // Divide by 2 to transform from double pixel scale
      float capCoverage = clamp(0.5 - fragmentCapSDF, 0.0, 1.0);

      if (capCoverage < ${u.float(T)}) {
        discard;
      }
    `),b?g.code.add(u`
      vec2 stipplePosition = vec2(
        min(getStippleSDF() * 2.0 - 1.0, 0.0),
        vLineDistanceNorm * gl_FragCoord.w
      );
      float stippleRadius = length(stipplePosition * vLineWidth);
      float stippleCapSDF = (stippleRadius - vLineWidth) * 0.5; // Divide by 2 to transform from double pixel scale
      float stippleCoverage = clamp(0.5 - stippleCapSDF, 0.0, 1.0);
      float stippleAlpha = step(${u.float(T)}, stippleCoverage);
      `):g.code.add(u`float stippleAlpha = getStippleAlpha();`),p.output!==o.ObjectAndLayerIdColor&&g.code.add(u`discardByStippleAlpha(stippleAlpha, stippleAlphaColorDiscard);`),g.uniforms.add(new m("intrinsicColor",(e=>e.color))),g.code.add(u`vec4 color = intrinsicColor * vColor;`),p.innerColorEnabled&&(g.uniforms.add(new m("innerColor",(e=>e.innerColor??e.color)),new v("innerWidth",((e,t)=>e.innerWidth*t.camera.pixelRatio))),g.code.add(u`float distToInner = abs(vLineDistance * gl_FragCoord.w) - innerWidth;
float innerAA = clamp(0.5 - distToInner, 0.0, 1.0);
float innerAlpha = innerColor.a + color.a * (1.0 - innerColor.a);
color = mix(color, vec4(innerColor.rgb, innerAlpha), innerAA);`)),g.code.add(u`vec4 finalColor = blendStipple(color, stippleAlpha);`),p.falloffEnabled&&(g.uniforms.add(new v("falloff",(e=>e.falloff))),g.code.add(u`finalColor.a *= pow(max(0.0, 1.0 - abs(vLineDistanceNorm * gl_FragCoord.w)), falloff);`))),g.code.add(u`
    ${p.output===o.ObjectAndLayerIdColor?u`finalColor.a = 1.0;`:""}

    if (finalColor.a < ${u.float(T)}) {
      discard;
    }

    ${p.output===o.Alpha?u`fragColor = vec4(finalColor.a);`:""}
    ${p.output===o.Color?u`fragColor = highlightSlice(finalColor, vpos);`:""}
    ${p.output===o.Color&&p.transparencyPassType===O.Color?"fragColor = premultiplyAlpha(fragColor);":""}
    ${p.output===o.Highlight?u`fragColor = vec4(1.0);`:""}
    ${p.output===o.Depth?u`outputDepth(linearDepth);`:""}
    ${p.output===o.ObjectAndLayerIdColor?u`outputObjectAndLayerIdColor();`:""}
  }
  `),d},ribbonlineNumRoundJoinSubdivisions:1},Symbol.toStringTag,{value:"Module"}));export{q as C,V as P,X as R,K as a,I as c,Q as r};
