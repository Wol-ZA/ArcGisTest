// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","./shaderRepository","../../../../../webgl/ShaderCompiler"],function(c,d,e){const g=new e.ShaderCompiler(function(b){let a=d;b.split("/").forEach(f=>{a&&(a=a[f])});return a});c.resolveIncludes=function(b){return g.resolveIncludes(b)};Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});