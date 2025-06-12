// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../chunks/vec3f64","./projectBuffer"],function(c,f,g){const b=f.create();c.projectVectorToVector=function(a,d,h,e){if(null==d||null==e||2>a.length)return!1;2===a.length&&(b[0]=a[0],b[1]=a[1],b[2]=0,a=b);return g.projectBuffer(a,d,0,h,e,0,1)};Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});