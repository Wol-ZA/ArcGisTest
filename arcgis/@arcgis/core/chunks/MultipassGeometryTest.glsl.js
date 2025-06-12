/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{a as e}from"./ReadLinearDepth.glsl.js";import{F as t}from"./Float2PassUniform.js";import{g as r}from"./interfaces3.js";import{T as o}from"./Texture2DPassUniform.js";var a;function s(a){a.include(e),a.uniforms.add(new o("geometryDepthTexture",((e,t)=>t.multipassGeometry.linearDepth?.colorTexture)),new t("nearFar",((e,t)=>t.camera.nearFar))),a.code.add(r`bool geometryDepthTest(vec2 pos, float elementDepth) {
float geometryDepth = linearDepthFromTexture(geometryDepthTexture, pos, nearFar);
return (elementDepth < (geometryDepth - 1.0));
}`)}!function(e){e[e.Occluded=0]="Occluded",e[e.NotOccluded=1]="NotOccluded",e[e.Both=2]="Both",e[e.COUNT=3]="COUNT"}(a||(a={}));class m{}export{a as H,m as M,s as m};
