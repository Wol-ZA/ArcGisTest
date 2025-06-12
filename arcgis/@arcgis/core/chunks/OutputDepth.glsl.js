/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{S as t}from"./ShaderOutput.js";import{R as a}from"./RgbaFloat16Encoding.glsl.js";import{R as e}from"./ReadLinearDepth.glsl.js";import{g as o}from"./interfaces3.js";function r(r,l){switch(l.output){case t.Shadow:case t.ShadowHighlight:case t.ShadowExcludeHighlight:r.fragment.include(a),r.fragment.code.add(o`float _calculateFragDepth(const in float depth) {
const float SLOPE_SCALE = 2.0;
const float BIAS = 20.0 * .000015259;
float m = max(abs(dFdx(depth)), abs(dFdy(depth)));
return depth + SLOPE_SCALE * m + BIAS;
}
void outputDepth(float _linearDepth) {
fragColor = floatToRgba4(_calculateFragDepth(_linearDepth));
}`);break;case t.Depth:r.fragment.include(e),r.fragment.code.add(o`void outputDepth(float _linearDepth) {
fragColor = float2rgba(_linearDepth);
}`)}}export{r as O};
