// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports"],function(b){b.isGraphic=function(a){return"esri.Graphic"===a?.declaredClass};b.isSceneView=function(a){return"3d"===a?.type};b.isTifOrMrf=function(a){return/.*.(tif|mrf)$/i.test(a??"")};Object.defineProperty(b,Symbol.toStringTag,{value:"Module"})});