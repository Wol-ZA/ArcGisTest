// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../../chunks/vec3f64","../../../chunks/vec4f64"],function(b,d,e){class f{constructor(c,g,a,h,k,l){this.texture=c;this.type=g;c.retain();this.offsetAndScale=e.fromValues(a.offset[0],a.offset[1],a.scale,a.scale);this.opacities=d.fromValues(h,k,l)}destroy(){this.texture.release()}}b.TextureReference=f;Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})});