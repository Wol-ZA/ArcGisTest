// All material copyright Esri, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.28/esri/copyright.txt for details.
//>>built
define(["exports","../../chunks/mat4","../../chunks/mat4f64","./MeshGeoreferencedRelativeVertexSpace","../../chunks/vec32"],function(d,e,f,g,h){const k=f.create();d.toRelativeVertexSpace=function(b){var {vertexSpace:c}=b;if(c.isRelative)return b.clone();({anchor:c}=b);var a=c.clone();c=e.fromTranslation(k,[-a.x,-a.y,-a.z]);a=new g({origin:[a.x,a.y,a.z]});b=b.cloneWithVertexSpace(a);({position:a}=b.vertexAttributes);b.vertexAttributes.position=h.transformMat4(new Float64Array(a.length),a,c);b.vertexAttributesChanged();
return b};Object.defineProperty(d,Symbol.toStringTag,{value:"Module"})});