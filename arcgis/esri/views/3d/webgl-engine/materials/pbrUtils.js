// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../../../chunks/vec3","../../../../chunks/vec3f64"],function(a,e,f){a.defaultAdvancedMRRFactors=[1,1,.5];a.defaultEsriSymbologyMRRFactors=[0,1,.2];a.defaultSchematicMRRFactors=[0,.6,.2];a.useSchematicPBR=function({normalTexture:g,metallicRoughnessTexture:h,metallicFactor:b,roughnessFactor:c,emissiveTexture:k,emissiveFactor:d,occlusionTexture:l}){return null==g&&null==h&&null==k&&(null==d||e.exactEquals(d,f.ZEROS))&&null==l&&(null==c||1===c)&&(null==b||1===b||0===b)};Object.defineProperty(a,
Symbol.toStringTag,{value:"Module"})});