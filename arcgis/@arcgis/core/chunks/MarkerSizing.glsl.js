/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{V as t}from"./VisualVariables.glsl.js";import{F as e}from"./Float3PassUniform.js";import{F as r}from"./FloatPassUniform.js";import{F as a}from"./FloatsPassUniform.js";import{g as o}from"./interfaces3.js";import{V as i}from"./VertexAttribute.js";import"./typedArrayUtil.js";import{p as n}from"./floatRGBA.js";import{D as s,T as c}from"./Texture2.js";import{T as p,P as u}from"./enums3.js";import{T as d,a as l}from"./Texture.js";import{b as v}from"./View.glsl.js";import{_ as f}from"./tslib.es6.js";import{S as h}from"./ShaderOutput.js";import{p as m}from"./ShaderTechniqueConfiguration.js";import{T as y}from"./TransparencyPassType.js";var S,O;!function(t){t[t.Draped=0]="Draped",t[t.Screen=1]="Screen",t[t.World=2]="World",t[t.COUNT=3]="COUNT"}(S||(S={})),function(t){t[t.Center=0]="Center",t[t.Tip=1]="Tip",t[t.COUNT=2]="COUNT"}(O||(O={}));class T extends s{constructor(){super(...arguments),this.output=h.Color,this.transparencyPassType=y.NONE,this.occluder=!1,this.hasSlicePlane=!1,this.writeDepth=!1,this.space=S.Screen,this.hideOnShortSegments=!1,this.hasCap=!1,this.anchor=O.Center,this.hasTip=!1,this.vvSize=!1,this.vvColor=!1,this.vvOpacity=!1,this.hasOccludees=!1,this.multipassEnabled=!1,this.cullAboveGround=!1}get draped(){return this.space===S.Draped}}function z(n,s){const c=n.vertex;c.uniforms.add(new r("intrinsicWidth",(t=>t.width))),s.vvSize?(n.attributes.add(i.SIZEFEATUREATTRIBUTE,"float"),c.uniforms.add(new e("vvSizeMinSize",(t=>t.vvSize.minSize)),new e("vvSizeMaxSize",(t=>t.vvSize.maxSize)),new e("vvSizeOffset",(t=>t.vvSize.offset)),new e("vvSizeFactor",(t=>t.vvSize.factor))),c.code.add(o`float getSize() {
return intrinsicWidth * clamp(vvSizeOffset + sizeFeatureAttribute * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).x;
}`)):(n.attributes.add(i.SIZE,"float"),c.code.add(o`float getSize(){
return intrinsicWidth * size;
}`)),s.vvOpacity?(n.attributes.add(i.OPACITYFEATUREATTRIBUTE,"float"),c.constants.add("vvOpacityNumber","int",8),c.uniforms.add(new a("vvOpacityValues",(t=>t.vvOpacity.values),8),new a("vvOpacityOpacities",(t=>t.vvOpacity.opacityValues),8)),c.code.add(o`float interpolateOpacity( float value ){
if (value <= vvOpacityValues[0]) {
return vvOpacityOpacities[0];
}
for (int i = 1; i < vvOpacityNumber; ++i) {
if (vvOpacityValues[i] >= value) {
float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
return mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f);
}
}
return vvOpacityOpacities[vvOpacityNumber - 1];
}
vec4 applyOpacity( vec4 color ){
return vec4(color.xyz, interpolateOpacity(opacityFeatureAttribute));
}`)):c.code.add(o`vec4 applyOpacity( vec4 color ){
return color;
}`),s.vvColor?(n.include(t,s),n.attributes.add(i.COLORFEATUREATTRIBUTE,"float"),c.code.add(o`vec4 getColor(){
return applyOpacity(interpolateVVColor(colorFeatureAttribute));
}`)):(n.attributes.add(i.COLOR,"vec4"),c.code.add(o`vec4 getColor(){
return applyOpacity(color);
}`))}f([m({count:h.COUNT})],T.prototype,"output",void 0),f([m({count:y.COUNT})],T.prototype,"transparencyPassType",void 0),f([m()],T.prototype,"occluder",void 0),f([m()],T.prototype,"hasSlicePlane",void 0),f([m()],T.prototype,"writeDepth",void 0),f([m({count:S.COUNT})],T.prototype,"space",void 0),f([m()],T.prototype,"hideOnShortSegments",void 0),f([m()],T.prototype,"hasCap",void 0),f([m({count:O.COUNT})],T.prototype,"anchor",void 0),f([m()],T.prototype,"hasTip",void 0),f([m()],T.prototype,"vvSize",void 0),f([m()],T.prototype,"vvColor",void 0),f([m()],T.prototype,"vvOpacity",void 0),f([m()],T.prototype,"hasOccludees",void 0),f([m()],T.prototype,"multipassEnabled",void 0),f([m()],T.prototype,"cullAboveGround",void 0),f([m({constValue:!1})],T.prototype,"occlusionPass",void 0),f([m({constValue:!0})],T.prototype,"hasVvInstancing",void 0),f([m({constValue:!0})],T.prototype,"hasSliceTranslatedView",void 0);const M=128,g=.5;function x(t){return"cross"===t||"x"===t}function C(t,e=M,r=e*g,a=0){const o=R(t,e,r,a);return new c(o,{mipmap:!1,wrap:{s:p.CLAMP_TO_EDGE,t:p.CLAMP_TO_EDGE},width:e,height:e,components:4,noUnpackFlip:!0,reloadable:!0})}function R(t,e=M,r=e*g,a=0){switch(t){case"circle":default:return function(t,e){const r=t/2-.5;return E(t,P(r,r,e/2))}(e,r);case"square":return function(t,e){return b(t,e,!1)}(e,r);case"cross":return function(t,e,r=0){return w(t,e,!1,r)}(e,r,a);case"x":return function(t,e,r=0){return w(t,e,!0,r)}(e,r,a);case"kite":return function(t,e){return b(t,e,!0)}(e,r);case"triangle":return function(t,e){return E(t,A(t/2,e,e/2))}(e,r);case"arrow":return function(t,e){const r=e,a=e/2,o=t/2,i=.8*r,n=P(o,(t-e)/2-i,Math.sqrt(i*i+a*a)),s=A(o,r,a);return E(t,((t,e)=>Math.max(s(t,e),-n(t,e))))}(e,r)}}function b(t,e,r){return r&&(e/=Math.SQRT2),E(t,((a,o)=>{let i=a-.5*t+.25,n=.5*t-o-.75;if(r){const t=(i+n)/Math.SQRT2;n=(n-i)/Math.SQRT2,i=t}return Math.max(Math.abs(i),Math.abs(n))-.5*e}))}function w(t,e,r,a=0){e-=a,r&&(e*=Math.SQRT2);const o=.5*e;return E(t,((e,i)=>{let n,s=e-.5*t,c=.5*t-i-1;if(r){const t=(s+c)/Math.SQRT2;c=(c-s)/Math.SQRT2,s=t}return s=Math.abs(s),c=Math.abs(c),n=s>c?s>o?Math.sqrt((s-o)*(s-o)+c*c):c:c>o?Math.sqrt(s*s+(c-o)*(c-o)):s,n-=a/2,n}))}function P(t,e,r){return(a,o)=>{const i=a-t,n=o-e;return Math.sqrt(i*i+n*n)-r}}function A(t,e,r){const a=Math.sqrt(e*e+r*r);return(o,i)=>{const n=Math.abs(o-t)-r,s=i-t+e/2+.75,c=(e*n+r*s)/a,p=-s;return Math.max(c,p)}}function E(t,e){const r=new Uint8Array(4*t*t);for(let a=0;a<t;a++)for(let o=0;o<t;o++){const i=o+t*a;let s=e(o,a);s=s/t+.5,n(s,r,4*i)}return r}const U=64,V=32,F=10,j=.25;function W(t,e){const r=R(t,64,32,6.4),a=new d;return a.internalFormat=u.RGBA,a.width=64,a.height=64,a.wrapMode=p.CLAMP_TO_EDGE,new l(e,a,r)}function k(t,e){const{vertex:a,constants:i}=t;i.add("markerSizePerLineWidth","float",10),v(a),null==a.uniforms.get("markerScale")&&a.constants.add("markerScale","float",1),a.code.add(o`float getLineWidth() {
return max(getSize(), 1.0) * pixelRatio;
}
float getScreenMarkerSize() {
return markerSizePerLineWidth * markerScale * getLineWidth();
}`),e.space===S.World&&(a.constants.add("maxSegmentLengthFraction","float",.45),a.uniforms.add(new r("perRenderPixelRatio",((t,e)=>e.camera.perRenderPixelRatio))),a.code.add(o`bool areWorldMarkersHidden(vec4 pos, vec4 other) {
vec3 midPoint = mix(pos.xyz, other.xyz, 0.5);
float distanceToCamera = length(midPoint);
float screenToWorldRatio = perRenderPixelRatio * distanceToCamera * 0.5;
float worldMarkerSize = getScreenMarkerSize() * screenToWorldRatio;
float segmentLen = length(pos.xyz - other.xyz);
return worldMarkerSize > maxSegmentLengthFraction * segmentLen;
}
float getWorldMarkerSize(vec4 pos) {
float distanceToCamera = length(pos.xyz);
float screenToWorldRatio = perRenderPixelRatio * distanceToCamera * 0.5;
return getScreenMarkerSize() * screenToWorldRatio;
}`))}export{O as L,k as M,z as R,S as a,W as b,C as c,g as d,M as e,T as f,V as g,j as h,F as i,U as m,x as r};
