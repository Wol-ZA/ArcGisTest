// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["../webgl-engine/lib/Camera"],function(a){class b{get gl(){return this.rctx.gl}constructor(c){this.view=c;this.camera=new a.Camera;this._renderTargetHelper=null}resetWebGLState(){null!=this.rctx&&(this.rctx.enforceState(),this._renderTargetHelper&&this._renderTargetHelper.bindFbo())}bindRenderTarget(){this._renderTargetHelper&&this._renderTargetHelper.framebuffer.initializeAndBind()}}return b});