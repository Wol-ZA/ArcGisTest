// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["require","exports","../assets","../core/has"],function(e,c,g,h){async function k(){f=await (h("esri-csp-restrictions")?await (new Promise((a,b)=>e(["../chunks/libtess-asm"],a,b))).then(a=>a.libtessAsm):await (new Promise((a,b)=>e(["../chunks/libtess"],a,b))).then(a=>a.libtess)).load({locateFile:a=>g.getAssetUrl(`esri/core/libs/libtess/${a}`)})}let d=null,f=null;c.loadLibtess=async function(){d||(d=k());return d};c.triangulate=function(a,b){return f.triangulate(a,b,Math.max(a.length,128E3))};
Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});