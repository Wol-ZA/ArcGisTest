/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{n as r}from"./compilerUtils.js";import{a as e}from"./mat3f64.js";import{a as o}from"./vec4f64.js";import{g as a}from"./interfaces3.js";import{V as s}from"./VertexAttribute.js";import{V as t,d as m,e as l,M as d}from"./ForwardLinearDepth.glsl.js";import{M as i}from"./Matrix3PassUniform.js";function n(e,o){switch(o.normalType){case c.Compressed:e.attributes.add(s.NORMALCOMPRESSED,"vec2"),e.vertex.code.add(a`vec3 normalModel() {
float z = 1.0 - abs(normalCompressed.x) - abs(normalCompressed.y);
return vec3(normalCompressed + sign(normalCompressed) * min(z, 0.0), z);
}`);break;case c.Attribute:e.attributes.add(s.NORMAL,"vec3"),e.vertex.code.add(a`vec3 normalModel() {
return normal;
}`);break;case c.ScreenDerivative:e.fragment.code.add(a`vec3 screenDerivativeNormal(vec3 positionView) {
return normalize(cross(dFdx(positionView), dFdy(positionView)));
}`);break;default:r(o.normalType);case c.COUNT:case c.Ground:}}var c;function v(e,o){switch(o.normalType){case c.Attribute:case c.Compressed:e.include(n,o),e.varyings.add("vNormalWorld","vec3"),e.varyings.add("vNormalView","vec3"),e.vertex.uniforms.add(new d("transformNormalGlobalFromModel",(r=>r.transformNormalGlobalFromModel)),new i("transformNormalViewFromGlobal",(r=>r.transformNormalViewFromGlobal))),e.vertex.code.add(a`void forwardNormal() {
vNormalWorld = transformNormalGlobalFromModel * normalModel();
vNormalView = transformNormalViewFromGlobal * vNormalWorld;
}`);break;case c.Ground:e.include(l,o),e.varyings.add("vNormalWorld","vec3"),e.vertex.code.add(a`
        void forwardNormal() {
          vNormalWorld = ${o.spherical?a`normalize(vPositionWorldCameraRelative);`:a`vec3(0.0, 0.0, 1.0);`}
        }
        `);break;case c.ScreenDerivative:e.vertex.code.add(a`void forwardNormal() {}`);break;default:r(o.normalType);case c.COUNT:}}!function(r){r[r.Attribute=0]="Attribute",r[r.Compressed=1]="Compressed",r[r.Ground=2]="Ground",r[r.ScreenDerivative=3]="ScreenDerivative",r[r.COUNT=4]="COUNT"}(c||(c={}));class f extends m{constructor(){super(...arguments),this.transformNormalViewFromGlobal=e()}}class p extends t{constructor(){super(...arguments),this.transformNormalGlobalFromModel=e(),this.toMapSpace=o()}}export{n as N,f as V,p as a,c as b,v as c};
