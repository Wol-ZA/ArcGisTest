/*
All material copyright ESRI, All Rights Reserved, unless otherwise specified.
See https://js.arcgis.com/4.28/esri/copyright.txt for details.
*/
import{F as e}from"./Float3PassUniform.js";import{v as o,F as v,a as r}from"./FloatsPassUniform.js";import{g as t}from"./interfaces3.js";import{M as a}from"./Matrix3PassUniform.js";import{V as i}from"./VertexAttribute.js";function n(n,l){const{vertex:s,attributes:c}=n;l.hasVvInstancing&&(l.vvSize||l.vvColor)&&c.add(i.INSTANCEFEATUREATTRIBUTE,"vec4"),l.vvSize?(s.uniforms.add(new e("vvSizeMinSize",(e=>e.vvSize.minSize))),s.uniforms.add(new e("vvSizeMaxSize",(e=>e.vvSize.maxSize))),s.uniforms.add(new e("vvSizeOffset",(e=>e.vvSize.offset))),s.uniforms.add(new e("vvSizeFactor",(e=>e.vvSize.factor))),s.uniforms.add(new a("vvSymbolRotationMatrix",(e=>e.vvSymbolRotationMatrix))),s.uniforms.add(new e("vvSymbolAnchor",(e=>e.vvSymbolAnchor))),s.code.add(t`vec3 vvScale(vec4 _featureAttribute) {
return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
}
vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
}`),s.code.add(t`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 vvScale = clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize + eps, vvSizeMaxSize);
        return vec4(vvSymbolRotationMatrix * _normal / vvScale, 1.0);
      }

      ${l.hasVvInstancing?t`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(position, instanceFeatureAttribute);
      }`:""}
    `)):s.code.add(t`vec4 localPosition() { return vec4(position, 1.0); }
vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }`),l.vvColor?(s.constants.add("vvColorNumber","int",o),s.uniforms.add(new v("vvColorValues",(e=>e.vvColor.values),o),new r("vvColorColors",(e=>e.vvColor.colors),o)),s.code.add(t`
      vec4 interpolateVVColor(float value) {
        if (value <= vvColorValues[0]) {
          return vvColorColors[0];
        }

        for (int i = 1; i < vvColorNumber; ++i) {
          if (vvColorValues[i] >= value) {
            float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
            return mix(vvColorColors[i-1], vvColorColors[i], f);
          }
        }
        return vvColorColors[vvColorNumber - 1];
      }

      vec4 vvGetColor(vec4 featureAttribute) {
        return interpolateVVColor(featureAttribute.y);
      }

      ${l.hasVvInstancing?t`
            vec4 vvColor() {
              return vvGetColor(instanceFeatureAttribute);
            }`:"vec4 vvColor() { return vec4(1.0); }"}
    `)):s.code.add(t`vec4 vvColor() { return vec4(1.0); }`)}export{n as V};
