// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../../../core/maybe","../lib/glUtil3D","../../../webgl/enums"],function(a,c,d,e){class f{constructor(b){this._rctx=b;this._vao=d.createScreenSizeTriangleVAO(b)}destroy(){this._vao=c.disposeMaybe(this._vao)}draw(){null!=this._vao&&(this._rctx.bindVAO(this._vao),this._rctx.drawArrays(e.PrimitiveType.TRIANGLES,0,3))}get test(){return{cachedWebGLObjects:(null!=this._vao?.glName?1:0)+(null!=this._vao?.indexBuffer?.glName?1:0)+(null!=this._vao?.vertexBuffers.geometry?1:0)}}}a.ScreenSpaceGeometry=
f;Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});