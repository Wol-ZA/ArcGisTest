// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../../../../../chunks/mat3f32","../../shaderModules/interfaces","../../shaderModules/Matrix3PassUniform"],function(c,d,e,f){c.colorTextureUV=function(a){a.vertex.uniforms.add(new f.Matrix3PassUniform("colorTextureTransformMatrix",b=>null!=b.colorTextureTransformMatrix?b.colorTextureTransformMatrix:d.create()));a.varyings.add("colorUV","vec2");a.vertex.code.add(e.glsl`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)};c.emissiveTextureUV=function(a){a.vertex.uniforms.add(new f.Matrix3PassUniform("emissiveTextureTransformMatrix",b=>null!=b.emissiveTextureTransformMatrix?b.emissiveTextureTransformMatrix:d.create()));a.varyings.add("emissiveUV","vec2");a.vertex.code.add(e.glsl`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)};c.metallicRoughnessTextureUV=function(a){a.vertex.uniforms.add(new f.Matrix3PassUniform("metallicRoughnessTextureTransformMatrix",b=>null!=b.metallicRoughnessTextureTransformMatrix?b.metallicRoughnessTextureTransformMatrix:d.create()));a.varyings.add("metallicRoughnessUV","vec2");a.vertex.code.add(e.glsl`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)};c.normalTextureUV=function(a){a.vertex.uniforms.add(new f.Matrix3PassUniform("normalTextureTransformMatrix",b=>null!=b.normalTextureTransformMatrix?b.normalTextureTransformMatrix:d.create()));a.varyings.add("normalUV","vec2");a.vertex.code.add(e.glsl`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)};c.occlusionTextureUV=function(a){a.vertex.uniforms.add(new f.Matrix3PassUniform("occlusionTextureTransformMatrix",b=>null!=b.occlusionTextureTransformMatrix?b.occlusionTextureTransformMatrix:d.create()));a.varyings.add("occlusionUV","vec2");a.vertex.code.add(e.glsl`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)};Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});