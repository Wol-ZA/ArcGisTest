// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["./utils"],function(c){const d={vsPath:"raster/rfx/vs",fsPath:"raster/rfx/compositeband",attributes:new Map([["a_position",0],["a_texcoord",1]])};return{createProgram:function(a,b){return a.painter.materialManager.getProgram(d,[])},bindTextureAndUniforms:function(a,b,e){c.setMultipleImageTextures(a,b,e);c.setCoordsAndTransforms(b)}}});