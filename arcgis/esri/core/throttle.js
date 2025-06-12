// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports"],function(g){g.throttle=function(m,b,h,d){let e=null,c=1E3;"number"===typeof b?(c=b,d=h):(e=b??null,c=h);let a=0,k;const f=()=>{a=0;m.apply(d,k)};b=(...l)=>{e&&e.apply(d,l);k=l;c?a||(a=setTimeout(f,c)):f()};b.remove=()=>{a&&(clearTimeout(a),a=0)};b.forceUpdate=()=>{a&&(clearTimeout(a),f())};b.hasPendingUpdates=()=>!!a;return b};Object.defineProperty(g,Symbol.toStringTag,{value:"Module"})});